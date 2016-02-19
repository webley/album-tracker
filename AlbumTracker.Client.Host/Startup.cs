using System;
using System.Configuration;
using System.IO;
using System.Threading;
using AlbumTracker.Client.Host;
using Microsoft.Owin;
using Microsoft.Owin.FileSystems;
using Microsoft.Owin.StaticFiles;
using Owin;

[assembly: OwinStartup(typeof(Startup))]
namespace AlbumTracker.Client.Host
{
    public class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            var root = AppDomain.CurrentDomain.BaseDirectory;

            // Serve from the debug build location if in debug mode.
#if DEBUG
            var uiRoot = Path.Combine(root, @"..\AlbumTracker.Client\debug");
#else
            var uiRoot = Path.Combine(root, "ui");
#endif

            var config = GetWebConfiguration();
            
            var fileOptions = new StaticFileOptions()
            {
                FileSystem = new PhysicalFileSystem(uiRoot),
                ServeUnknownFileTypes = true
            };

            app.MapWhen(IsStaticFileRequest, spa =>
            {
                spa.UseStaticFiles(fileOptions);
            });

            app.MapWhen(IsNotStaticFileRequest, spa =>
            {
                spa.UseIndexFileServer(uiRoot, config);
            });
        }

        private bool IsStaticFileRequest(IOwinContext context)
        {
            var path = context.Request.Path.Value;
            return RequestHelper.EndsWithValidFileExtension(path);
        }

        private bool IsNotStaticFileRequest(IOwinContext context)
        {
            return !IsStaticFileRequest(context);
        }

        private WebConfiguration GetWebConfiguration()
        {
            var cacheFilesStr = ConfigurationManager.AppSettings["CacheFiles"];
            bool cacheFiles;
            bool.TryParse(cacheFilesStr, out cacheFiles);

            return new WebConfiguration
            {
                CacheFiles = TryGetSetting("CacheFiles", true)
            };
        }

        private T TryGetSetting<T>(string appSettingKey, T defaultValue = default(T))
        {
            T outVal;

            try
            {
                Type type = typeof(T);
                var parseMethod = type.GetMethod("Parse");
                var str = ConfigurationManager.AppSettings[appSettingKey];
                outVal = (T)parseMethod.Invoke(null, new[] {str});
            }
            catch (Exception)
            {
                outVal = defaultValue;
            }

            return outVal;
        }
    }
}