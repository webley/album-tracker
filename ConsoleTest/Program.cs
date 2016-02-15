using AlbumTracker.DataAccess.Misc;

namespace ConsoleTest
{
    class Program
    {
        static void Main(string[] args)
        {
            string connectionString = "Server=(local);Database=AlbumTracker;User Id=albumTracker;Password=nicetry;";
            DataAccessConfiguration config = new DataAccessConfiguration { ConnectionString = connectionString };
            DatabaseInitializer dbInit = new DatabaseInitializer(connectionString);
            dbInit.Initialize();

            var tester = new Tester(config);
            for (int i = 0; i < 3000; i++)
            {
                tester.PopulateDatabase();
            }
            
            //tester.GetStuff();
        }
        
    }
}
