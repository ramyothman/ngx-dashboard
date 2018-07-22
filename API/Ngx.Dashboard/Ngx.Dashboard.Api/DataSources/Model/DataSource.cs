using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Ngx.Dashboard.Api.DataSources.Model
{
    public class DataSource
    {
        public string Id { set; get; }
        public string ConnectionId { set; get; }
        public string Name { set; get; }
        public string SourceType { set; get; }
        public string SourceId { set; get; }
        public string Schema { set; get; }
        public string Namespace { set; get; }
        public List<Column> Columns { set; get; }
        public List<Column> Parameters { set; get; }

    }
}
