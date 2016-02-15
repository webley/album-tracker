using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Web;
using System.Web.Http;
using System.Web.Routing;
using AlbumTracker.DataAccess.Implementation;
using AlbumTracker.DataAccess.Interface;
using Ninject;
using Ninject.Web.Common;

namespace AlbumTracker.WebApi
{
    public class WebApiApplication : NinjectHttpApplication
    {
        protected void Application_Start()
        {
            GlobalConfiguration.Configure(WebApiConfig.Register);
        }

        protected override IKernel CreateKernel()
        {
            var kernel = new StandardKernel();
            RegisterServices(kernel);
            return kernel;
        }

        /// <summary>
        /// Load your modules or register your services here.
        /// </summary>
        /// <param name="kernel">The kernel.</param>
        private void RegisterServices(IKernel kernel)
        {
            kernel.Load(Assembly.GetExecutingAssembly());
            kernel.Bind<IAlbumDataAccess, AlbumDataAccess>();
        }
    }
}
