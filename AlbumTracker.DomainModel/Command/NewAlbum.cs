using System;

namespace AlbumTracker.DomainModel.Command
{
    public class NewAlbum
    {
        public long ArtistId { get; set; }
        public long AlbumArtId { get; set; }
        public string Name { get; set; }
        public DateTime ReleaseDate { get; set; }        
    }
}
