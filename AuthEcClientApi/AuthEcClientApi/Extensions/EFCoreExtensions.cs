using AuthEcClientApi.Models;
using Microsoft.EntityFrameworkCore;

namespace AuthEcClientApi.Extensions
{
    public static class EFCoreExtensions
    {
        public static IServiceCollection InjectDbContext(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddDbContext<AppDbContext>(options =>
            options.UseSqlServer(
                configuration.GetConnectionString("DevDB")
            ));
            return services;
        }
    }
}
