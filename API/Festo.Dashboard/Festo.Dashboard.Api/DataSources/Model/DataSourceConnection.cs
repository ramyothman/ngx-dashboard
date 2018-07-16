using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Festo.Dashboard.Api.DataSources.Model
{
    /// <summary>
    /// Datasource Connections provided for dashboard
    /// </summary>
    public class DataSourceConnection
    {
        public DataSourceConnection(string id, string title)
        {
            this.Id = id;
            this.Title = title;
        }
        public string Id { set; get; }
        public string Title { set; get; }
        public List<DataSource> DataSources { set; get; }

    }
}
