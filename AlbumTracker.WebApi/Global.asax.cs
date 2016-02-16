using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Web;
using System.Web.Http;
using System.Web.Routing;
using AlbumTracker.DataAccess.Implementation;
using AlbumTracker.DataAccess.Interface;
using AlbumTracker.WebApi.Controllers;
using Ninject;
using Ninject.Web.Common;

namespace AlbumTracker.WebApi
{
    public class WebApiApplication : HttpApplication
    {
        protected void Application_Start()
        {
            GlobalConfiguration.Configure(WebApiConfig.Register);
        }
    }
}
