using AlbumTracker.DataAccess.Interface;
using AlbumTracker.DataAccess.Misc;
using AlbumTracker.DomainModel.Command;
using AlbumTracker.DomainModel.Query;
using System.Data.SqlClient;
using Dapper;
using System.Linq;
using System.Threading.Tasks;

namespace AlbumTracker.DataAccess.Implementation
{
    public class AlbumArtDataAccess : IAlbumArtDataAccess
    {
        private string _connectionString;

        public AlbumArtDataAccess(DataAccessConfiguration config)
        {
            _connectionString = config.ConnectionString;
        }

        public async Task<long> CreateAlbumArt(NewAlbumArt albumArt)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var cmd = new CommandDefinition(SqlStatements.InsertAlbumArt, new { width = albumArt.Width, height = albumArt.Height, filename = albumArt.FileName });
                await connection.OpenAsync();
                var albumArtId = await connection.ExecuteScalarAsync<long>(cmd);
                return albumArtId;
            }
        }

        public async Task<AlbumArt> GetAlbumArt(long albumArtId)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var cmd = new CommandDefinition(SqlStatements.SelectAlbumArt, new { id = albumArtId });
                await connection.OpenAsync();
                var albumArt = await connection.QueryAsync<AlbumArt>(cmd);
                return albumArt.FirstOrDefault();
            }
        }
    }
}
