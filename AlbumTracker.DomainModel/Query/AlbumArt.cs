using System;

namespace AlbumTracker.DomainModel.Query
{
    public class AlbumArt
    {
        public long Id { get; set; }
        public int Width { get; set; }
        public int Height { get; set; }
        public DateTime ReleaseDate { get; set; }
    }
}
