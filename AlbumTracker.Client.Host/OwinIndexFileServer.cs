using System;
using System.IO;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Owin;
using Owin;

namespace AlbumTracker.Client.Host
{
    public static class OwinIndexFileServer
    {
        private static string IndexFileLocation;
        private static string RawIndexFile;
        private static string CachedIndexFile;

        /// <summary>
        /// Return the index file on every request.
        /// </summary>
        /// <param name="app">The <see cref="IAppBuilder"/></param>
        /// <param name="uiFolderAbsolutePath">The absolute path of the UI folder from where to host the index file.</param>
        /// <returns>The modified <see cref="IAppBuilder"/></returns>
        public static IAppBuilder UseIndexFileServer(this IAppBuilder app, string uiFolderAbsolutePath, WebConfiguration config)
        {
            if (string.IsNullOrWhiteSpace(uiFolderAbsolutePath))
            {
                throw new ArgumentException("A UI folder path must be provided.", nameof(uiFolderAbsolutePath));
            }
            if (!Directory.Exists(uiFolderAbsolutePath))
            {
                throw new ArgumentException("The given UI folder path must refer to an existing folder.", nameof(uiFolderAbsolutePath));
            }

            IndexFileLocation = Path.Combine(uiFolderAbsolutePath, "index.html");
            if (RawIndexFile == null)
            {
                RawIndexFile = File.ReadAllText(IndexFileLocation);
                if (!RawIndexFile.Contains("@{server.baseLocation}"))
                {
                    throw new ApplicationException("Index file doesn't contain a base tag with a location of @{server.baseLocation}");
                }
            }

            app.Use((context, next) =>
            {
                // If we haven't cached the index, or we want to reload and regenerate it every time.
                if (!config.CacheFiles)
                {
                    RawIndexFile = File.ReadAllText(IndexFileLocation);
                    if (!RawIndexFile.Contains("@{server.baseLocation}"))
                    {
                        throw new ApplicationException("Index file doesn't contain a base tag with a location of @{server.baseLocation}");
                    }
                }
                if (CachedIndexFile == null || !config.CacheFiles)
                {
                    var pathBase = context.Get<string>("owin.RequestPathBase");
                    string normalizedPathBase = '/' + (pathBase.Trim('/')) + '/';
                    CachedIndexFile = RawIndexFile.Replace("@{server.baseLocation}", normalizedPathBase);
                }

                context.Response.ContentType = "text/html";
                context.Response.StatusCode = 200;
                context.Response.Write(CachedIndexFile);
                return Task.FromResult(0);
            });

            return app;
        }
    }
}