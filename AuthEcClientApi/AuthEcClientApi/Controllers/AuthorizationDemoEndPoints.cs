using Microsoft.AspNetCore.Authorization;

namespace AuthEcClientApi.Controllers
{
    public static class AuthorizationDemoEndPoints
    {
        public static IEndpointRouteBuilder MapAuthorizationDemoEndPoints(this IEndpointRouteBuilder app)
        {
            app.MapGet("/AdminOnly", AdminOnly);
            
            app.MapGet("/AdminOrTeacher", 
                        [Authorize(Roles = "Admin,Teacher")] 
                        () => 
                        { 
                            return "Admin or Teacher"; 
                        });

            app.MapGet("/LibraryMemberOnly",
                        [Authorize(Policy = "HasLibraryId")]
                        () =>
                        {
                            return "Library member only";
                        });
            return app;
        }

        [Authorize(Roles = "Admin")]
        private static string AdminOnly()
        {
            return "Admin Only";
        }
    }
}
