using AlbumTracker.DomainModel.Command;
using AlbumTracker.DomainModel.Query;
using System.Threading.Tasks;

namespace AlbumTracker.DataAccess.Interface
{
    public interface IArtistDataAccess
    {
        Task<Artist> GetArtist(long artistId);
        Task<long> CreateArtist(NewArtist artist);
    }
}
