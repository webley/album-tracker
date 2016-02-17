using System.Collections.Generic;

namespace AlbumTracker.Client.Host
{
    public static class RequestHelper
    {
        private static readonly HashSet<string> ValidFileExtensions = new HashSet <string> {"js", "css", "less", "html", "png", "json", "svg", "xml", "ico"};

        public static bool EndsWithValidFileExtension(string requestPath)
        {
            var parts = requestPath.Split('.');
            var ext = parts[parts.Length - 1];
            return ValidFileExtensions.Contains(ext);
        }

        private static void ScanFileExtensions()
        {
            // Maybe automatically scan all files in the UI folder to generate this list.
        }
    }
}