using AlbumTracker.DataAccess.Implementation;
using AlbumTracker.DataAccess.Interface;
using AlbumTracker.DataAccess.Misc;
using AlbumTracker.DomainModel.Command;
using System;

namespace ConsoleTest
{
    public class Tester
    {
        private IArtistDataAccess _artistDataAccess;
        private IAlbumArtDataAccess _albumArtDataAccess;
        private IAlbumDataAccess _albumDataAccess;
        private IAlbumTrackDataAccess _trackDataAccess;

        public Tester(DataAccessConfiguration config)
        {
            _artistDataAccess = new ArtistDataAccess(config);
            _albumArtDataAccess = new AlbumArtDataAccess(config);
            _albumDataAccess = new AlbumDataAccess(config);
            _trackDataAccess = new AlbumTrackDataAccess(config);
        }

        public void PopulateDatabase()
        {
            var catfishId = _artistDataAccess.CreateArtist(new NewArtist { Name = "Catfish and the Bottlemen", Country = "United Kingdom" }).Result;
            var altJId = _artistDataAccess.CreateArtist(new NewArtist { Name = "alt-J", Country = "United Kingdom" }).Result;

            var artIdCatfish = _albumArtDataAccess.CreateAlbumArt(new NewAlbumArt { Height = 200, Width = 200, FileName = "TheBalcony.png" }).Result;
            var artIdAltJ = _albumArtDataAccess.CreateAlbumArt(new NewAlbumArt { Height = 200, Width = 200, FileName = "AnAwesomeWave.png" }).Result;

            var balconyId = _albumDataAccess.CreateAlbum(new NewAlbum { AlbumArtId = artIdCatfish, ArtistId = catfishId, Name = "The Balcony", ReleaseDate = new DateTime(2015, 9, 15) }).Result;
            var awesomeWaveId = _albumDataAccess.CreateAlbum(new NewAlbum { AlbumArtId = artIdAltJ, ArtistId = altJId, Name = "An Awesome Wave", ReleaseDate = new DateTime(2012, 5, 25) }).Result;

            var tid1 = _trackDataAccess.CreateAlbumTrack(new NewAlbumTrack { AlbumId = balconyId, TrackNumber = 1, Name = "Homesick", LengthInMs = ToMs(2, 28) }).Result;
            var tid2 = _trackDataAccess.CreateAlbumTrack(new NewAlbumTrack { AlbumId = balconyId, TrackNumber = 2, Name = "Kathleen", LengthInMs = ToMs(2, 41) }).Result;
            var tid3 = _trackDataAccess.CreateAlbumTrack(new NewAlbumTrack { AlbumId = balconyId, TrackNumber = 3, Name = "Cocoon", LengthInMs = ToMs(3, 57) }).Result;
            var tid4 = _trackDataAccess.CreateAlbumTrack(new NewAlbumTrack { AlbumId = balconyId, TrackNumber = 4, Name = "Fallout", LengthInMs = ToMs(3, 30) }).Result;
            var tid5 = _trackDataAccess.CreateAlbumTrack(new NewAlbumTrack { AlbumId = balconyId, TrackNumber = 5, Name = "Pacifier", LengthInMs = ToMs(3, 58) }).Result;
            var tid6 = _trackDataAccess.CreateAlbumTrack(new NewAlbumTrack { AlbumId = balconyId, TrackNumber = 6, Name = "Hourglass", LengthInMs = ToMs(2, 18) }).Result;
            var tid7 = _trackDataAccess.CreateAlbumTrack(new NewAlbumTrack { AlbumId = balconyId, TrackNumber = 7, Name = "Business", LengthInMs = ToMs(3, 42) }).Result;
            var tid8 = _trackDataAccess.CreateAlbumTrack(new NewAlbumTrack { AlbumId = balconyId, TrackNumber = 8, Name = "26", LengthInMs = ToMs(3, 39) }).Result;
            var tid9 = _trackDataAccess.CreateAlbumTrack(new NewAlbumTrack { AlbumId = balconyId, TrackNumber = 9, Name = "Rango", LengthInMs = ToMs(2, 58) }).Result;
            var tid10 = _trackDataAccess.CreateAlbumTrack(new NewAlbumTrack { AlbumId = balconyId, TrackNumber = 10, Name = "Sidewinder", LengthInMs = ToMs(3, 27) }).Result;
            var tid11 = _trackDataAccess.CreateAlbumTrack(new NewAlbumTrack { AlbumId = balconyId, TrackNumber = 11, Name = "Tyrants", LengthInMs = ToMs(4, 39) }).Result;

            var jid1 = _trackDataAccess.CreateAlbumTrack(new NewAlbumTrack { AlbumId = awesomeWaveId, TrackNumber = 1, Name = "Intro", LengthInMs = ToMs(2, 38) }).Result;
            var jid2 = _trackDataAccess.CreateAlbumTrack(new NewAlbumTrack { AlbumId = awesomeWaveId, TrackNumber = 2, Name = "(The Ripe & Ruin)", LengthInMs = ToMs(1, 12) }).Result;
            var jid3 = _trackDataAccess.CreateAlbumTrack(new NewAlbumTrack { AlbumId = awesomeWaveId, TrackNumber = 3, Name = "Tessellate", LengthInMs = ToMs(3, 03) }).Result;
            var jid4 = _trackDataAccess.CreateAlbumTrack(new NewAlbumTrack { AlbumId = awesomeWaveId, TrackNumber = 4, Name = "Breezeblocks", LengthInMs = ToMs(3, 47) }).Result;
            var jid5 = _trackDataAccess.CreateAlbumTrack(new NewAlbumTrack { AlbumId = awesomeWaveId, TrackNumber = 5, Name = "(Guitar)", LengthInMs = ToMs(1, 17) }).Result;
            var jid6 = _trackDataAccess.CreateAlbumTrack(new NewAlbumTrack { AlbumId = awesomeWaveId, TrackNumber = 6, Name = "Something Good", LengthInMs = ToMs(3, 38) }).Result;
            var jid7 = _trackDataAccess.CreateAlbumTrack(new NewAlbumTrack { AlbumId = awesomeWaveId, TrackNumber = 7, Name = "Dissolve Me", LengthInMs = ToMs(3, 59) }).Result;
            var jid8 = _trackDataAccess.CreateAlbumTrack(new NewAlbumTrack { AlbumId = awesomeWaveId, TrackNumber = 8, Name = "Matilda", LengthInMs = ToMs(3, 49) }).Result;
            var jid9 = _trackDataAccess.CreateAlbumTrack(new NewAlbumTrack { AlbumId = awesomeWaveId, TrackNumber = 9, Name = "Ms", LengthInMs = ToMs(3, 59) }).Result;
            var jid10 = _trackDataAccess.CreateAlbumTrack(new NewAlbumTrack { AlbumId = awesomeWaveId, TrackNumber = 10, Name = "Fitzpleasure", LengthInMs = ToMs(3, 39) }).Result;
            var jid11 = _trackDataAccess.CreateAlbumTrack(new NewAlbumTrack { AlbumId = awesomeWaveId, TrackNumber = 11, Name = "(Piano)", LengthInMs = ToMs(0, 54) }).Result;
            var jid12 = _trackDataAccess.CreateAlbumTrack(new NewAlbumTrack { AlbumId = awesomeWaveId, TrackNumber = 12, Name = "Bloodflood", LengthInMs = ToMs(4, 09) }).Result;
            var jid13 = _trackDataAccess.CreateAlbumTrack(new NewAlbumTrack { AlbumId = awesomeWaveId, TrackNumber = 13, Name = "Taro", LengthInMs = ToMs(5, 15) }).Result;
            var jid14 = _trackDataAccess.CreateAlbumTrack(new NewAlbumTrack { AlbumId = awesomeWaveId, TrackNumber = 14, Name = "Hand-made (Hidden track)", LengthInMs = ToMs(2, 38) }).Result;
        }

        public void GetStuff()
        {
            var bob = _albumDataAccess.GetAlbum(3).Result;
        }

        private static long ToMs(int mins, int secs)
        {
            return ((mins * 60) + secs) * 1000;
        }
    }
}
