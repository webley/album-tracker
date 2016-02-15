using System;
using System.Collections.Generic;

namespace AlbumTracker.ApiModel.Response
{
    public class AlbumResponse
    {
        public long Id { get; set; }
        public string Name { get; set; }
        public DateTime Year { get; set; }
        public ArtistResponse Artist { get; set; }
        public AlbumArtResponse AlbumArt { get; set; }
        public List<TrackResponse> TrackList { get; set; }
    }
}
