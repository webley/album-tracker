namespace AlbumTracker.DataAccess.Misc
{
    public class SqlStatements
    {
        #region Selects

        public const string SelectArtist = "SELECT Id, Name, Country FROM Artist WHERE Id = @id";
        public const string SelectAlbumArt = "SELECT Id, Width, Height, FileName FROM AlbumArt WHERE Id = @id";
        public const string SelectAlbum = "SELECT Id, ArtistId, AlbumArtId, Name, ReleaseDate FROM Album WHERE Id = @id";
        public const string SelectAlbumTrack = "SELECT Id, AlbumId, TrackNumber, Name, DurationMs FROM AlbumTrack WHERE Id = @id";
        public const string SelectAlbumTracksByAlbum = "SELECT Id, AlbumId, TrackNumber, Name, DurationMs FROM AlbumTrack WHERE AlbumId = @albumId";

        public const string SelectAlbumAggregate = @"SELECT a.[Id],a.[ArtistId],a.[AlbumArtId],a.[Name],a.[ReleaseDate], r.Id, r.Name, r.Country, c.Id, c.Width, c.Height, c.[FileName]
FROM [AlbumTracker].[dbo].[Album] a
INNER JOIN [AlbumTracker].[dbo].[Artist] r on r.Id = a.ArtistId
INNER JOIN [AlbumTracker].[dbo].[AlbumArt] c on c.Id = a.AlbumArtId
WHERE a.Id = @albumId";

        #endregion Selects

        #region Inserts

        public const string InsertArtist = "INSERT INTO Artist(Name, Country) OUTPUT INSERTED.Id VALUES (@name, @country)";
        public const string InsertAlbumArt = "INSERT INTO [dbo].[AlbumArt] ([Width],[Height],[FileName]) OUTPUT INSERTED.Id VALUES (@width,@height,@filename)";
        public const string InsertAlbum = "INSERT INTO [dbo].[Album] ([ArtistId],[AlbumArtId],[Name],[ReleaseDate]) OUTPUT INSERTED.Id VALUES (@artistId,@albumArtId,@name,@releaseDate)";
        public const string InsertAlbumTrack = "INSERT INTO [dbo].[AlbumTrack] ([AlbumId],[TrackNumber],[Name],[DurationMs]) OUTPUT INSERTED.Id VALUES (@albumId,@trackNumber,@name,@durationMs)";

        #endregion Inserts

    }
}
