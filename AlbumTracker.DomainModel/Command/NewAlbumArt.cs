namespace AlbumTracker.DomainModel.Command
{
    public class NewAlbumArt
    {
        public int Width { get; set; }
        public int Height { get; set; }
        public string FileName { get; set; }
    }
}
