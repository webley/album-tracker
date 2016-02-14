namespace AlbumTracker.DomainModel.Query
{
    public class AlbumTrack
    {
        public long Id { get; set; }
        public long AlbumId { get; set; }
        public string Name { get; set; }
        public int TrackNumber { get; set; }
        public int LengthInMs { get; set; }
    }
}
