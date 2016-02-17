using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Web;
using Microsoft.Owin;
using Microsoft.Owin.FileSystems;
using Microsoft.Owin.StaticFiles;
using Owin;

namespace AlbumTracker.Client.Host
{
    public class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            var root = AppDomain.CurrentDomain.BaseDirectory;
            var uiRoot = Path.Combine(root, "ui");

            var fileOptions = new StaticFileOptions()
            {
                FileSystem = new PhysicalFileSystem(uiRoot),
                ServeUnknownFileTypes = true
            };

            app.MapWhen(IsStaticFileRequest, spa =>
            {
                spa.UseStaticFiles(fileOptions);

                //spa.Use((context, next) =>
                //{
                //    context.Request.Path = new PathString("/index.html");
                //
                //    return next();
                //});

                
            });

            app.MapWhen(IsNotStaticFileRequest, spa =>
            {
                spa.UseIndexFileServer(uiRoot);
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
    }
}