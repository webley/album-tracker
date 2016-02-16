namespace AlbumTracker.DomainModel.Query
{
    public class AlbumArt
    {
        public long Id { get; set; }
        public int Width { get; set; }
        public int Height { get; set; }
        public string FileName { get; set; }
        public byte[] Data { get; set; }
    }
}
