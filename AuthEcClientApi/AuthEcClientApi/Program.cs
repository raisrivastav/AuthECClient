using AuthEcClientApi.Controllers;
using AuthEcClientApi.Extensions;
using AuthEcClientApi.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddSwaggerExplorer()
                .InjectDbContext(builder.Configuration)
                .AddAppConfig(builder.Configuration)
                .AddIdentityHandlerAndStore()
                .ConfigureIdentityOptions()
                .AddIdentityAuth(builder.Configuration);

var app = builder.Build();

app.ConfigureSwaggerExplorer()
    .ConfigureCors(builder.Configuration)
    .AddIdentityAuthMiddleware();

app.MapControllers();

app.MapGroup("/api")
    .MapIdentityApi<AppUser>();

app.MapGroup("/api")
   .MapAccountEndpoints()
   .MapIdentityUserEndpoints()
   .MapAuthorizationDemoEndPoints();

app.Run();