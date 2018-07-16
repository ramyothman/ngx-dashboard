using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace Festo.Dashboard.Api.Middleware
{
    public class CorsPreflightMiddleware
    {
        private readonly RequestDelegate _next;

        public CorsPreflightMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task Invoke(HttpContext context)
        {
            context.Response.Headers.Add("Access-Control-Allow-Origin", "*");
            if (context.Request.Method == "OPTIONS")
            {
                context.Response.Headers.Add("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE");
                context.Response.Headers.Add("Access-Control-Allow-Headers", "authorization,content-type");

                context.Response.StatusCode = StatusCodes.Status200OK;
            }
            else
            {
                await _next.Invoke(context);
            }
        }
    }
}