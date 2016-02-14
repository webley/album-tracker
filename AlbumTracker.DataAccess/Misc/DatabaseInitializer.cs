using System.Data.SqlClient;

namespace AlbumTracker.DataAccess.Misc
{
    public class DatabaseInitializer
    {
        private const string CreateArtistTableSql = @"IF object_id('Artist', 'U') is null
    CREATE TABLE [dbo].[Artist](
	[Id] [bigint] IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](128) NOT NULL,
	[Country] [nvarchar](128) NOT NULL,
 CONSTRAINT [PK_Artist] PRIMARY KEY CLUSTERED ([Id] ASC)
)";

        private const string CreateAlbumArtTableSql = @"IF object_id('AlbumArt', 'U') is null
    CREATE TABLE [dbo].[AlbumArt](
	[Id] [bigint] IDENTITY(1,1) NOT NULL,
	[Width] [int] NOT NULL,
	[Height] [int] NOT NULL,
	[FileName] [nvarchar](255) NOT NULL,
 CONSTRAINT [PK_AlbumArt] PRIMARY KEY CLUSTERED ([Id] ASC)
)";        

        private const string CreateAlbumTableSql = @"IF object_id('Album', 'U') is null
    CREATE TABLE [dbo].[Album](
	[Id] [bigint] IDENTITY(1,1) NOT NULL,
	[ArtistId] [bigint] NOT NULL,
	[AlbumArtId] [bigint] NOT NULL,
	[Name] [nvarchar](50) NOT NULL,
	[ReleaseDate] [date] NOT NULL,
    CONSTRAINT [PK_Album] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_Album_AlbumArt] FOREIGN KEY([AlbumArtId]) REFERENCES [dbo].[AlbumArt] ([Id]),
    CONSTRAINT [FK_Album_Artist] FOREIGN KEY([ArtistId]) REFERENCES [dbo].[Artist] ([Id])
)";

        private const string CreateAlbumTrackTableSql = @"IF object_id('AlbumTrack', 'U') is null
    CREATE TABLE [dbo].[AlbumTrack](
	[Id] [bigint] IDENTITY(1,1) NOT NULL,
	[AlbumId] [bigint] NOT NULL,
	[TrackNumber] [smallint] NOT NULL,
	[Name] [nvarchar](128) NOT NULL,
	[DurationMs] [int] NOT NULL,
    CONSTRAINT [PK_AlbumTrack] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [UK_AlbumTrackNumber] UNIQUE NONCLUSTERED ([AlbumId] ASC, [TrackNumber] ASC),
    CONSTRAINT [FK_AlbumTrack_Album] FOREIGN KEY([AlbumId]) REFERENCES [dbo].[Album] ([Id])
)";

        private string _connectionString;

        public DatabaseInitializer(string connectionString)
        {
            _connectionString = connectionString;
        }

        public void Initialize()
        {
            CreateTablesIfNotExists();
        }

        private void CreateDatabaseIfNotExists()
        {
            // Don't do this for now.
        }

        private void CreateTablesIfNotExists()
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                SqlCommand command = new SqlCommand(CreateArtistTableSql, connection);                
                command.ExecuteNonQuery();

                command = new SqlCommand(CreateAlbumArtTableSql, connection);
                command.ExecuteNonQuery();

                command = new SqlCommand(CreateAlbumTableSql, connection);
                command.ExecuteNonQuery();

                command = new SqlCommand(CreateAlbumTrackTableSql, connection);
                command.ExecuteNonQuery();
            }
        }
    }
}
