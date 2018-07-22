using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Ngx.Dashboard.Api.DataSources.Model
{
    /// <summary>
    /// Source Schema Columns
    /// </summary>
    public class Column
    {
        /// <summary>
        /// Column Id
        /// </summary>
        public string Id { set; get; }
        /// <summary>
        /// Column Name
        /// </summary>
        public string Name { set; get; }
        /// <summary>
        /// Column Main Id
        /// </summary>
        public string ObjectId { set; get; }
        /// <summary>
        /// Full Name
        /// </summary>
        public string FullName { set; get; }
        /// <summary>
        /// Is Primary Key
        /// </summary>
        public bool IsPrimary { set; get; }
        /// <summary>
        /// Is Foreign
        /// </summary>
        public bool IsForeign { set; get; }
        /// <summary>
        /// Is Identity
        /// </summary>
        public bool IsIdentity { set; get; }
        /// <summary>
        /// Allow Null
        /// </summary>
        public bool AllowNull { set; get; }
        /// <summary>
        /// Is Computed
        /// </summary>
        public bool IsComputed { set; get; }
        /// <summary>
        /// Data Type
        /// </summary>
        public string DataType { set; get; }
        /// <summary>
        /// Parent Id
        /// </summary>
        public string ParentId { set; get; }
        /// <summary>
        /// selected column
        /// </summary>
        public bool Selected { set; get; }
        /// <summary>
        /// only used in case of passing filtering parameter value
        /// </summary>
        public Object ParameterValue { set; get; }
        /// <summary>
        /// Column Header to be displayed
        /// </summary>
        public string Header { set; get; }
    }
}
