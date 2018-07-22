using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Ngx.Dashboard.Api.DataSources.Model.Request
{
    /// <summary>
    /// Request for Columns
    /// </summary>
    public class ColumnsRequest
    {
        /// <summary>
        /// Connection Id
        /// </summary>
        public string Id { set; get; }
        /// <summary>
        /// Source Ids
        /// </summary>
        public List<DataSource> Sources { set; get; }
    }
}
