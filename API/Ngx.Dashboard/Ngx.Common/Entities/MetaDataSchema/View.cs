using System;
using System.Collections.Generic;
using System.Text;

namespace Ngx.Common.Entities.MetaDataSchema
{
    [Serializable]
    public class View : Entities.Entity
    {
       
        private string _schema;
        public string Schema
        {
            set { _schema = value; }
            get { return _schema; }
        }
        private string _viewId;
        public string ViewID
        {
            set { _viewId = value; }
            get { return _viewId; }
        }
        //private Database _database;
        public Database ParentDatabase
        {
            set { _Parent = value; }
            get { return _Parent as Database; }
        }
        private List<Column> _columns = new List<Column>();
        public List<Column> Columns
        {
            set { _columns = value; }
            get { return _columns; }
        }

        public override void UnSelect()
        {
            
            foreach (Column cols in Columns)
            {
                cols.UnSelect();
            }

        }

        #region ICloneable Members

        public override object Clone()
        {
            if (!this.EntitySelected)
                return null;
            View view = new View();
            view.EntitySelected = this.EntitySelected;
            view.Id = this.Id;
            view.Name = this.Name;
            view.Schema = this.Schema;
            view.ViewID = this.ViewID;
            
            foreach (Column col in this.Columns)
            {
                Column newCol = col.Clone() as Column;
                if (newCol != null)
                {
                    newCol.Parent = view;
                    view.Columns.Add(newCol);
                }
            }
            return view;

        }

        #endregion
    }
}
