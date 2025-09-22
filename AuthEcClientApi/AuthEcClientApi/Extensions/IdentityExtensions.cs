using AuthEcClientApi.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace AuthEcClientApi.Extensions
{
    public static class IdentityExtensions
    {
        public static IServiceCollection AddIdentityHandlerAndStore(this IServiceCollection services)
        {
            services
            .AddIdentityApiEndpoints<AppUser>()
            .AddRoles<IdentityRole>()
            .AddEntityFrameworkStores<AppDbContext>();

            return services;
        }

        public static IServiceCollection ConfigureIdentityOptions(this IServiceCollection services)
        {
            //Modification of IdentityOptions Rule for password and email
            services.Configure<IdentityOptions>(options =>
            {
                options.Password.RequireDigit = false;
                options.Password.RequireUppercase = false;
                options.Password.RequireLowercase = false;
                options.User.RequireUniqueEmail = true;
            });

            return services;
        }

        //Auth = Authentication + Authorization
        public static IServiceCollection AddIdentityAuth(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(y =>
            {
                y.SaveToken = false;
                y.TokenValidationParameters = new TokenValidationParameters()
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(
                        Encoding.UTF8.GetBytes(configuration["AppSettings:JwtSecret"]!)),
                    ValidateIssuer = false,
                    ValidateAudience = false,
                };
            });

            services.AddAuthorization(options =>
            {
                options.FallbackPolicy = new AuthorizationPolicyBuilder()
                .AddAuthenticationSchemes(JwtBearerDefaults.AuthenticationScheme)
                .RequireAuthenticatedUser()
                .Build();

                options.AddPolicy("HasLibraryId", policy => policy.RequireClaim("LibraryID"));
                options.AddPolicy("FemaleOnly", policy => policy.RequireClaim("Gender", "Female"));
                options.AddPolicy("Under10", policy => policy.RequireAssertion(context =>
                Int32.Parse(context.User.Claims.First(x => x.Type == "Age").Value) < 10));
            });

            return services;
        }

        public static WebApplication AddIdentityAuthMiddleware(this WebApplication app)
        {
            app.UseAuthentication();
            app.UseAuthorization();
            return app;
        }
    }
}
