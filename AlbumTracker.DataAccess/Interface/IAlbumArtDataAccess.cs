using AlbumTracker.DomainModel.Query;
using AlbumTracker.DomainModel.Command;
using System.Threading.Tasks;

namespace AlbumTracker.DataAccess.Interface
{
    public interface IAlbumArtDataAccess
    {
        Task<AlbumArt> GetAlbumArt(long albumArtId);
        Task<long> CreateAlbumArt(NewAlbumArt albumArt);
    }
}
