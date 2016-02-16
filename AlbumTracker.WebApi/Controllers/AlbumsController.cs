using System.Collections.Generic;
using System.Threading.Tasks;
using System.Web.Http;
using AlbumTracker.ApiModel.Response;
using AlbumTracker.DataAccess.Interface;

namespace AlbumTracker.WebApi.Controllers
{
    public class AlbumsController : ApiController
    {
        private IAlbumDataAccess _albumDataAccess;

        public AlbumsController(IAlbumDataAccess albumDataAccess)
        {
            _albumDataAccess = albumDataAccess;
        }

        // GET: api/Albums
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET: api/Albums/5
        public async Task<AlbumResponse> Get(int id)
        {
            var album = await _albumDataAccess.GetAlbum(id);
            return album.ToAlbumResponse();
        }

        // POST: api/Albums
        public void Post([FromBody]string value)
        {
        }

        // PUT: api/Albums/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE: api/Albums/5
        public void Delete(int id)
        {
        }
    }
}
