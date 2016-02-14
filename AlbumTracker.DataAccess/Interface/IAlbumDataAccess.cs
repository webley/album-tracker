using AlbumTracker.DomainModel.Query;
using AlbumTracker.DomainModel.Command;
using System.Threading.Tasks;

namespace AlbumTracker.DataAccess.Interface
{
    public interface IAlbumDataAccess
    {
        Task<Album> GetAlbum(long artistId);
        Task<long> CreateAlbum(NewAlbum album);
    }
}
