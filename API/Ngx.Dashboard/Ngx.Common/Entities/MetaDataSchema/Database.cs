using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using System.Xml.Serialization;

namespace Ngx.Common.Entities.MetaDataSchema
{
    [Serializable]
    public class Database : Entities.Entity
    {
        
        //private Project _project;
        
        public Project ParentProject
        {
            get { return _Parent as Project; }
            set { _Parent = value; }
        }
        private List<Table> _tables = new List<Table>();
        public List<Table> Tables
        {
            set { _tables = value; }
            get { return _tables; }
        }

        private List<View> _views = new List<View>();
        [XmlIgnoreAttribute]
        public List<View> Views
        {
            set { _views = value; }
            get { return _views; }
        }

        private List<StoredProcedure> _storedProcedures = new List<StoredProcedure>();
        [XmlIgnoreAttribute]
        public List<StoredProcedure> StoredProcedures
        {
            set { _storedProcedures = value; }
            get { return _storedProcedures; }
        }

        private List<Function> _functions = new List<Function>();
        [XmlIgnoreAttribute]
        public List<Function> Functions
        {
            set { _functions = value; }
            get { return _functions; }
        }

        private List<RelationShip> _relationShips = new List<RelationShip>();
        [XmlIgnoreAttribute]

        public List<RelationShip> RelationShips
        {
            set { _relationShips = value; }
            get { return _relationShips; }
        }

        public static Database GetByName(List<Database> databases,string searchName)
        {
            foreach (Database row in databases)
            {
                if (row.Name == searchName)
                    return row;
            }
            return null;
        }
        public override void UnSelect()
        {
            
            foreach (Table tbl in Tables)
            {
                tbl.UnSelect();
            }
            foreach (View view in Views)
            {
                view.UnSelect();
            }

            foreach (Function fns in Functions)
            {
                fns.UnSelect();
            }
            foreach (StoredProcedure sps in StoredProcedures)
            {
                sps.UnSelect();
            }

            foreach (RelationShip rls in RelationShips)
            {
                rls.UnSelect();
            }
        }
        #region ICloneable Members

        public override object Clone()
        {
            if (!this.EntitySelected)
                return null;
            Database db = new Database();
            db.Name = this.Name;
            db.Parent = this.Parent;
            db.EntitySelected = this.EntitySelected;
            db.Id = this.Id;
            
            foreach (Table table in this.Tables)
            {
                Table newTable = table.Clone() as Table;
                if (newTable != null)
                {
                    newTable.Parent = db;
                    db.Tables.Add(newTable);
                }
            }

            foreach (View view in this.Views)
            {
                View newView = view.Clone() as View;
                if (newView != null)
                {
                    newView.Parent = db;
                    db.Views.Add(newView);
                }
            }

            foreach (Function view in this.Functions)
            {
                Function newFunction = view.Clone() as Function;
                if (newFunction != null)
                {
                    newFunction.Parent = db;
                    db.Functions.Add(newFunction);
                }
            }

            foreach (StoredProcedure sp in this.StoredProcedures)
            {
                StoredProcedure newSp = sp.Clone() as StoredProcedure;
                if (newSp != null)
                {
                    newSp.Parent = db;
                    db.StoredProcedures.Add(newSp);
                }
            }
            return db;

        }

        public object Clone(string tableName)
        {
            if (!this.EntitySelected)
                return null;
            Database db = new Database();
            db.Name = this.Name;
            db.Parent = this.Parent;
            db.EntitySelected = this.EntitySelected;
            db.Id = this.Id;

            foreach (Table table in this.Tables)
            {
                if(table.Name == tableName)
                {
                    Table newTable = table.Clone() as Table;
                    if (newTable != null)
                    {
                        newTable.Parent = db;
                        db.Tables.Add(newTable);
                    }
                }
            }
            return db;

        }

        public static string SerializeToString(Database obj)
        {
            XmlSerializer serializer = new XmlSerializer(obj.GetType());

            using (StringWriter writer = new StringWriter())
            {
                serializer.Serialize(writer, obj);

                return writer.ToString();
            }
        }
        #endregion

    }
}
