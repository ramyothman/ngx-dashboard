using System;
using System.Collections.Generic;
using System.Text;

namespace Festo.Common.Entities.MetaDataSchema
{
    [Serializable]
    public class StoredProcedure : Entities.Entity
    {
        #region Properties
        private string _schema;
        public string Schema
        {
            set { _schema = value; }
            get { return _schema; }
        }
        //private Database _database;
        public Database ParentDatabase
        {
            set { _Parent = value; }
            get { return _Parent as Database; }
        }
        private List<Column> _parameters = new List<Column>();
        public List<Column> Parameters
        {
            set { _parameters = value; }
            get { return _parameters; }
        }
        private string _StoredProcedureId;
        public string StoredProcedureId
        {
            get { return _StoredProcedureId; }
            set
            {
                _StoredProcedureId = value;
            }
        }
        

        private List<Column> _returnList = new List<Column>();
        public List<Column> ReturnList
        {
            set { _returnList = value; }
            get { return _returnList; }
        }

        #endregion

        #region Methods
        public static StoredProcedure GetByName(List<StoredProcedure> storedProcedures, string searchName)
        {
            foreach (StoredProcedure row in storedProcedures)
            {
                if (row.Name == searchName)
                    return row;
            }
            return null;
        }

        public override void UnSelect()
        {
            
            foreach (Column cols in Parameters)
            {
                cols.UnSelect();
            }
            foreach (Column cols in ReturnList)
            {
                cols.UnSelect();
            }
        }
        #endregion

        #region ICloneable Members

        public override object Clone()
        {
            if (!this.EntitySelected)
                return null;
            StoredProcedure sps = new StoredProcedure();
            sps.Name = this.Name;
            sps.StoredProcedureId = sps.StoredProcedureId;
            sps.EntitySelected = this.EntitySelected;
            sps.Id = this.Id;
            sps.Schema = this.Schema;
            foreach (Column col in this.Parameters)
            {
                Column newCol = col.Clone() as Column;
                if (newCol != null)
                {
                    newCol.Parent = sps;
                    sps.Parameters.Add(newCol);
                }
            }
            foreach (Column col in this.ReturnList)
            {
                Column newCol = col.Clone() as Column;
                if (newCol != null)
                {
                    newCol.Parent = sps;
                    sps.ReturnList.Add(newCol);
                }
            }
            return sps;

        }

        #endregion


    }
}
