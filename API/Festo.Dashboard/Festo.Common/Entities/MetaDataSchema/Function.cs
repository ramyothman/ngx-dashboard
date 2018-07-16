using System;
using System.Collections.Generic;
using System.Text;

namespace Festo.Common.Entities.MetaDataSchema
{
    [Serializable]
    public class Function : Entities.Entity
    {
        #region Properties

        private string _schema;
        public string Schema
        {
            set { _schema = value; }
            get { return _schema; }
        }


        private List<Column> _parameters = new List<Column>();
        public List<Column> Parameters
        {
            set { _parameters = value; }
            get { return _parameters; }
        }

        private DataType _resultType = new DataType();
        public DataType ResultType
        {
            set { _resultType = value; }
            get { return _resultType; }
        }
        private string _functionId;
        public string FunctionId
        {
            set { _functionId = value; }
            get { return _functionId; }
        }
        //private Database _database;
        public Database ParentDatabase
        {
            set { _Parent = value; }
            get { return _Parent as Database; }
        }
        #endregion

        #region Methods
        public static Function GetByName(List<Function> functions, string searchName)
        {
            foreach (Function row in functions)
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

        }
        #endregion

        #region ICloneable Members

        public override object Clone()
        {
            if (!this.EntitySelected)
                return null;
            Function function = new Function();
            function.Name = this.Name;
            function.EntitySelected = this.EntitySelected;
            function.Id = this.Id;
            function.ResultType = this.ResultType;
            
            function.Schema = this.Schema;
            function.FunctionId = this.FunctionId;
            foreach (Column col in this.Parameters)
            {
                Column newCol = col.Clone() as Column;
                if (newCol != null)
                {
                    newCol.Parent = function;
                    function.Parameters.Add(newCol);
                }
            }
            return function;

        }

        #endregion
    }
}
