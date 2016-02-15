using System;
using System.Collections.Generic;

namespace AlbumTracker.DomainModel.Query
{
    public class Album
    {
        public long Id { get; set; }
        public Artist Artist { get; set; }
        public string Name { get; set; }
        public DateTime ReleaseDate { get; set; }
        public AlbumArt AlbumArt { get; set; }
        public List<Track> TrackList { get; set; }
    }
}
