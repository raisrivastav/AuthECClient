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

            app.MapGet("/ApplyForMaternityLeave", [Authorize(Roles = "Teacher", Policy = "FemaleOnly")] () =>
            {
                return "Applied for maternity leave.";
            });

            app.MapGet("/Under10AndFemaleOnly", 
                [Authorize(Policy = "Under10")]
                [Authorize(Policy = "FemaleOnly")] () =>
            {
                return "Under 10 and Female only.";
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
