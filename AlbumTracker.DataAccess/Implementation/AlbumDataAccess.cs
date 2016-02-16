using AlbumTracker.DataAccess.Interface;
using AlbumTracker.DomainModel.Command;
using AlbumTracker.DomainModel.Query;
using AlbumTracker.DataAccess.Misc;
using System.Threading.Tasks;
using System.Data.SqlClient;
using Dapper;
using System.Linq;
using AlbumTracker.DomainModel;

namespace AlbumTracker.DataAccess.Implementation
{
    public class AlbumDataAccess : IAlbumDataAccess
    {
        private string _connectionString;

        public AlbumDataAccess(DataAccessConfiguration config)
        {
            _connectionString = config.ConnectionString;
        }

        public async Task<long> CreateAlbum(NewAlbum album)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var cmd = new CommandDefinition(SqlStatements.InsertAlbum, new { artistId = album.ArtistId, albumArtId = album.AlbumArtId, name = album.Name, releaseDate = album.ReleaseDate });
                await connection.OpenAsync();
                var albumArtId = await connection.ExecuteScalarAsync<long>(cmd);
                return albumArtId;
            }
        }

        public async Task<Album> GetAlbum(long albumId)
        {
            Album albumAggregate;

            using(var connection = new SqlConnection(_connectionString))
            {
                var cmd = new CommandDefinition(SqlStatements.SelectAlbumAggregate, new { albumId = albumId });
                await connection.OpenAsync();
                var albums = await connection.QueryAsync<Album, Artist, AlbumArt, Album>(cmd, (album, artist, art) => { album.Artist = artist; album.AlbumArt = art; return album; });
                albumAggregate = albums.FirstOrDefault();

                if (albumAggregate == null)
                    return null;

                cmd = new CommandDefinition(SqlStatements.SelectAlbumTracksByAlbum, new { albumId = albumId });
                var tracks = await connection.QueryAsync<AlbumTrack>(cmd);
                var trackList = tracks.OrderBy(track => track.TrackNumber)
                    .Select(track => new Track { Id = track.Id, Name = track.Name, DuationMs = track.DurationMs })
                    .ToList();

                albumAggregate.TrackList = trackList;
            }

            return albumAggregate;
        }
    }
}
