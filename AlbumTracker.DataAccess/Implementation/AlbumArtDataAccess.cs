using AlbumTracker.DataAccess.Interface;
using AlbumTracker.DataAccess.Misc;
using AlbumTracker.DomainModel.Command;
using AlbumTracker.DomainModel.Query;
using System.Data.SqlClient;
using System.IO;
using Dapper;
using System.Linq;
using System.Threading.Tasks;

namespace AlbumTracker.DataAccess.Implementation
{
    public class AlbumArtDataAccess : IAlbumArtDataAccess
    {
        private string _connectionString;
        private string _fileStore;

        public AlbumArtDataAccess(DataAccessConfiguration config)
        {
            _connectionString = config.ConnectionString;
            _fileStore = Path.Combine(config.FileStoreFolderPath.Trim('\\', '/'), "AlbumArt");

            if (!Directory.Exists(_fileStore))
            {
                Directory.CreateDirectory(_fileStore);
            }
        }

        public async Task<long> CreateAlbumArt(NewAlbumArt albumArt)
        {
            var fileSaveLocation = Path.Combine(_fileStore, albumArt.FileName);
            using (var writer = new BinaryWriter(File.Create(fileSaveLocation, albumArt.Data.Length)))
            {
                writer.Write(albumArt.Data);
            }

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
                var art = albumArt.FirstOrDefault();

                var fileSaveLocation = Path.Combine(_fileStore, art.FileName);
                var fileBytes = File.ReadAllBytes(fileSaveLocation);
                art.Data = fileBytes;
                return art;
            }
        }
    }
}
