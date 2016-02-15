using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AlbumTracker.ApiModel.Response
{
    public class TrackResponse
    {
        public long Id { get; set; }
        public string Name { get; set; }
        public int DurationMs { get; set; }
    }
}
