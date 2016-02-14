using System.Linq;
using System.Threading.Tasks;
using AlbumTracker.DataAccess.Interface;
using AlbumTracker.DomainModel.Command;
using AlbumTracker.DomainModel.Query;
using System.Data.SqlClient;
using Dapper;
using AlbumTracker.DataAccess.Misc;

namespace AlbumTracker.DataAccess.Implementation
{
    public class AlbumTrackDataAccess : IAlbumTrackDataAccess
    {
        private string _connectionString;

        public AlbumTrackDataAccess(DataAccessConfiguration config)
        {
            _connectionString = config.ConnectionString;
        }

        public async Task<long> CreateAlbumTrack(NewAlbumTrack albumTrack)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var cmd = new CommandDefinition(SqlStatements.InsertAlbumTrack, new
                {
                    albumId = albumTrack.AlbumId,
                    trackNumber = albumTrack.TrackNumber,
                    name = albumTrack.Name,
                    durationMs = albumTrack.LengthInMs
                });
                await connection.OpenAsync();
                var trackId = await connection.ExecuteScalarAsync<long>(cmd);
                return trackId;
            }
        }

        public async Task<AlbumTrack> GetAlbumTrack(long albumTrackId)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var cmd = new CommandDefinition(SqlStatements.SelectAlbumTrack, new { id = albumTrackId });
                await connection.OpenAsync();
                var tracks = await connection.QueryAsync<AlbumTrack>(cmd);
                return tracks.FirstOrDefault();
            }
        }
    }
}
