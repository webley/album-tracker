namespace AlbumTracker.DomainModel.Command
{
    public class NewAlbumTrack
    {
        public long AlbumId { get; set; }
        public string Name { get; set; }
        public int TrackNumber { get; set; }
        public long LengthInMs { get; set; }
    }
}
