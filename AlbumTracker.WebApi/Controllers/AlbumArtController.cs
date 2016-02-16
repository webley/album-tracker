using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using AlbumTracker.DataAccess.Interface;
using AlbumTracker.DomainModel.Command;

namespace AlbumTracker.WebApi.Controllers
{
    public class AlbumArtController : ApiController
    {
        private IAlbumArtDataAccess _albumArtDataAccess;

        public AlbumArtController(IAlbumArtDataAccess albumArtDataAccess)
        {
            _albumArtDataAccess = albumArtDataAccess;
        }

        [HttpPost, Route("api/upload")]
        public async Task<long> Upload()
        {
            if (!Request.Content.IsMimeMultipartContent())
                throw new HttpResponseException(HttpStatusCode.UnsupportedMediaType);

            var provider = new MultipartMemoryStreamProvider();
            await Request.Content.ReadAsMultipartAsync(provider);

            long artId = -1;
            foreach (var file in provider.Contents)
            {
                var filename = file.Headers.ContentDisposition.FileName.Trim('\"');
                var buffer = await file.ReadAsByteArrayAsync();
                //Do whatever you want with filename and its binaray data.

                artId = await _albumArtDataAccess.CreateAlbumArt(new NewAlbumArt
                {
                    FileName = filename,
                    Data = buffer
                });
            }

            return artId;
        }
    }
}