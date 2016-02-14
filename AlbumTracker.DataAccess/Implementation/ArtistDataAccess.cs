using AlbumTracker.DomainModel.Command;
using AlbumTracker.DomainModel.Query;
using AlbumTracker.DataAccess.Interface;
using AlbumTracker.DataAccess.Misc;
using Dapper;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;

namespace AlbumTracker.DataAccess.Implementation
{
    public class ArtistDataAccess : IArtistDataAccess
    {
        private string _connectionString;

        public ArtistDataAccess(DataAccessConfiguration config)
        {
            _connectionString = config.ConnectionString;
        }

        public async Task<long> CreateArtist(NewArtist artist)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var cmd = new CommandDefinition(SqlStatements.InsertArtist, new { name = artist.Name, country = artist.Country });
                await connection.OpenAsync();
                var artistId = await connection.ExecuteScalarAsync<long>(cmd);
                return artistId;
            }
        }

        public async Task<Artist> GetArtist(long artistId)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var cmd = new CommandDefinition(SqlStatements.SelectArtist, new { id = artistId });
                await connection.OpenAsync();
                var artists = await connection.QueryAsync<Artist>(cmd);
                return artists.FirstOrDefault();
            }
        }
    }
}
