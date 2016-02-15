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

        /// <summary>
        /// Insert a new artist in the database, or return its ID if it already exists.
        /// </summary>
        /// <param name="artist">The artist to insert.</param>
        /// <returns>The ID of the new artist inserted, or the existing ID if it is a duplicate.</returns>
        public async Task<long> CreateArtist(NewArtist artist)
        {
            //var existingArtist = await GetArtistByName(artist.Name);
            //if (existingArtist != null)
            //{
            //    return existingArtist.Id;
            //}

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

        private async Task<Artist> GetArtistByName(string artistName)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var cmd = new CommandDefinition(SqlStatements.SelectArtistByName, new { name = artistName });
                await connection.OpenAsync();
                var artists = await connection.QueryAsync<Artist>(cmd);
                return artists.FirstOrDefault();
            }
        }
    }
}
