using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AlbumTracker.ApiModel.Request
{
    public class CreateArtistRequest
    {
        public string Name { get; set; }
        public string Country { get; set; }
    }
}
