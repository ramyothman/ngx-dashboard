using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Ngx.Dashboard.Api.DataSources.Controllers
{
    /// <summary>
    /// Datasource Controller for retreiving datasource schema
    /// </summary>
    [Route("api/[controller]")]
    public class DataSourceController : Controller
    {
        private Services.DataSourceService dataSourceService;
        public DataSourceController(IHostingEnvironment host)
        {
            dataSourceService = new Services.DataSourceService(host);
        }
        
        /// <summary>
        /// Get Connections
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(List<Model.DataSourceConnection>))]
        public Task<List<Model.DataSourceConnection>> Get(Model.Request.DataSourceConnectionRequest request)
        {
            return dataSourceService.GetConnectionsAsync(request);
        }

        /// <summary>
        /// Get Data Sources
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpGet("GetDataSources")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(List<Model.DataSource>))]
        public Task<List<Model.DataSource>> GetDataSources(Model.Request.DataSourcesRequest request)
        {
            return dataSourceService.GetDataSourcesAsync(request);
        }

        /// <summary>
        /// Get Columns for Multiple Datasources
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpPost("GetColumns")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(List<Model.DataSource>))]
        public Task<List<Model.Column>> GetColumns([FromBody]Model.Request.ColumnsRequest request)
        {
            return dataSourceService.GetColumnsAsync(request);
        }

        /// <summary>
        /// Get Data Async
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpPost("GetData")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(JsonResult))]
        public async Task<JsonResult> GetData([FromBody]Model.Request.DataRequest request)
        {
            var result = await dataSourceService.GetSourceData(request);
            return Json(result);
        }
    }
}
