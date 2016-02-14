using AlbumTracker.DomainModel.Command;
using AlbumTracker.DomainModel.Query;
using System.Threading.Tasks;

namespace AlbumTracker.DataAccess.Interface
{
    public interface IAlbumTrackDataAccess
    {
        Task<AlbumTrack> GetAlbumTrack(long albumTrackId);
        Task<long> CreateAlbumTrack(NewAlbumTrack albumTrack);
    }
}
