using System.Configuration;
using System.Reflection;
using AlbumTracker.DataAccess.Implementation;
using AlbumTracker.DataAccess.Interface;
using AlbumTracker.DataAccess.Misc;

[assembly: WebActivatorEx.PreApplicationStartMethod(typeof(AlbumTracker.WebApi.App_Start.NinjectWebCommon), "Start")]
[assembly: WebActivatorEx.ApplicationShutdownMethodAttribute(typeof(AlbumTracker.WebApi.App_Start.NinjectWebCommon), "Stop")]

namespace AlbumTracker.WebApi.App_Start
{
    using System;
    using System.Web;

    using Microsoft.Web.Infrastructure.DynamicModuleHelper;

    using Ninject;
    using Ninject.Web.Common;

    public static class NinjectWebCommon 
    {
        private static readonly Bootstrapper bootstrapper = new Bootstrapper();

        /// <summary>
        /// Starts the application
        /// </summary>
        public static void Start() 
        {
            DynamicModuleUtility.RegisterModule(typeof(OnePerRequestHttpModule));
            DynamicModuleUtility.RegisterModule(typeof(NinjectHttpModule));
            bootstrapper.Initialize(CreateKernel);
        }
        
        /// <summary>
        /// Stops the application.
        /// </summary>
        public static void Stop()
        {
            bootstrapper.ShutDown();
        }
        
        /// <summary>
        /// Creates the kernel that will manage your application.
        /// </summary>
        /// <returns>The created kernel.</returns>
        private static IKernel CreateKernel()
        {
            var kernel = new StandardKernel();
            try
            {
                kernel.Bind<Func<IKernel>>().ToMethod(ctx => () => new Bootstrapper().Kernel);
                kernel.Bind<IHttpModule>().To<HttpApplicationInitializationHttpModule>();

                RegisterServices(kernel);
                return kernel;
            }
            catch
            {
                kernel.Dispose();
                throw;
            }
        }

        /// <summary>
        /// Load your modules or register your services here!
        /// </summary>
        /// <param name="kernel">The kernel.</param>
        private static void RegisterServices(IKernel kernel)
        {
            //kernel.Load(Assembly.GetExecutingAssembly());
            kernel.Bind<IAlbumDataAccess>().To<AlbumDataAccess>();

            var config = GetDataAccessConfiguration();
            kernel.Bind<DataAccessConfiguration>().ToConstant(config);
        }

        /// <summary>
        /// Generate the configuration class based on the web config.
        /// </summary>
        /// <returns></returns>
        private static DataAccessConfiguration GetDataAccessConfiguration()
        {
            var connectionString = ConfigurationManager.ConnectionStrings["AlbumTracker"].ConnectionString;
            var fileStoreFolderPath = ConfigurationManager.AppSettings["FileStoreFolderPath"];

            return new DataAccessConfiguration
            {
                ConnectionString = connectionString,
                FileStoreFolderPath = fileStoreFolderPath
            };
        }
    }
}
