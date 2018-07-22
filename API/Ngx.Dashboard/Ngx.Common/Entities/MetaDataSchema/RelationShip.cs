using System;
using System.Collections.Generic;
using System.Text;

namespace Ngx.Common.Entities.MetaDataSchema
{
    [Serializable]
    public class RelationShip : Entities.Entity, ICloneable
    {

        
        private Table _masterTable;
        public Table MasterTable
        {
            set { _masterTable = value; }
            get { return _masterTable; }
        }

        private Table _childTable;
        public Table ChildTable
        {
            set { _childTable = value; }
            get { return _childTable; }
        }

        private Column _ParentColumns;
        public Column ParentColumn
        {
            set { _ParentColumns = value; }
            get { return _ParentColumns; }
        }
        public Database ParentDatabase
        {
            set { _Parent = value; }
            get { return _Parent as Database; }
        }
        private Column _childColumn;
        public Column ChildColumn
        {
            set { _childColumn = value; }
            get { return _childColumn; }
        }

        public static RelationShip GetByName(List<RelationShip> relationShips, string searchName)
        {
            foreach (RelationShip row in relationShips)
            {
                if (row.Name == searchName)
                    return row;
            }
            return null;
        }

        public override void UnSelect()
        {
            ChildColumn.UnSelect();
            ParentColumn.UnSelect();
        }




        #region ICloneable Members

        public override object Clone()
        {
            if (!this.EntitySelected)
                return null;
            RelationShip r = new RelationShip();
            r.Id = this.Id;
            r.Name = this.Name;
            r.ChildColumn = this.ChildColumn.Clone() as Column;
            r.ChildTable = this.ChildTable.Clone() as Table;
            r.EntitySelected = this.EntitySelected;
            r.MasterTable = this.MasterTable.Clone() as Table;
            r.ParentColumn = this.ParentColumn.Clone() as Column;
            r.ParentDatabase = this.ParentDatabase;
            return r;
            

        }

        #endregion
    }
}
