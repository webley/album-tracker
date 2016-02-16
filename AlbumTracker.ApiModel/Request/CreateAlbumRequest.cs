using System;
using System.Collections.Generic;
using AlbumTracker.ApiModel.Types;

namespace AlbumTracker.ApiModel.Request
{
    public class CreateAlbumRequest
    {
        public long ArtistId { get; set; }
        public long AlbumArtId { get; set; }
        public string Name { get; set; }
        public DateTime ReleaseDate { get; set; }
        public List<AlbumTrack> TrackList { get; set; }
    }
}
