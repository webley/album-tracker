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
        private static string CachedIndexFile;

        /// <summary>
        /// Return the index file on every request.
        /// </summary>
        /// <param name="app">The <see cref="IAppBuilder"/></param>
        /// <param name="uiFolderAbsolutePath">The absolute path of the UI folder from where to host the index file.</param>
        /// <returns>The modified <see cref="IAppBuilder"/></returns>
        public static IAppBuilder UseIndexFileServer(this IAppBuilder app, string uiFolderAbsolutePath)
        {
            if (string.IsNullOrWhiteSpace(uiFolderAbsolutePath))
            {
                throw new ArgumentException("A UI folder path must be provided.", nameof(uiFolderAbsolutePath));
            }
            if (!Directory.Exists(uiFolderAbsolutePath))
            {
                throw new ArgumentException("The given UI folder path must refer to an existing folder.", nameof(uiFolderAbsolutePath));
            }

            var indexFile = Path.Combine(uiFolderAbsolutePath, "index.html");
            if (CachedIndexFile == null)
            {
                CachedIndexFile = File.ReadAllText(indexFile);
            }

            app.Use((context, next) =>
            {
                var pathBase = context.Get<string>("owin.RequestPathBase");
                string normalizedPathBase = '/' + (pathBase.Trim('/')) + '/';

                context.Response.ContentType = "text/html";
                //context.Response.Body = GenerateStreamFromString(CachedIndexFile);
                context.Response.StatusCode = 200;
                context.Response.Write(CachedIndexFile);
                return Task.FromResult(0);
            });

            return app;
        }

        private static MemoryStream GenerateStreamFromString(string value)
        {
            return new MemoryStream(Encoding.UTF8.GetBytes(value ?? ""));
        }
    }
}