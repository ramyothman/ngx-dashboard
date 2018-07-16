using System;
using System.Collections.Generic;
using System.Text;

namespace Festo.Common.Entities
{
    public class Schema
    {
        public Guid ID { set; get; }
        public Guid ParentID { set; get; }
        public string Name { set; get; }
        public string SchemaType { set; get; }
        public string SchemaName { set; get; }
        public string DataType { set; get; }
        public string FullName { set; get; }
        public int ImageIndex { set; get; }
    }
}
