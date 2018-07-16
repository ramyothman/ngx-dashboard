using System;
using System.Linq;
using System.Collections.Generic;
using System.Text;
using System.Xml.Serialization;
using Pluralize.NET.Core;
namespace Festo.Common.Entities.MetaDataSchema
{
    [Serializable]
    public class Table : Entities.Entity
    {
        Pluralizer pluralizer = new Pluralizer();
        System.Globalization.CultureInfo info = new System.Globalization.CultureInfo("en-US");
        public Table() { }
        public Table(string name)
        {
            this.Name = name;
        }
        public Table(string name,string schema)
        {
            this.Name = name;
            this.Schema = schema;
        }

        public Table(string name,string schema,Database parentDatabase)
        {
            this.Name = name;
            this.Schema = schema;
            this.ParentDatabase = parentDatabase;
        }

        #region Properties

        //private Database _database;
        [XmlIgnoreAttribute]
        public Database ParentDatabase
        {
            set { _Parent = value; }
            get { return _Parent as Database; }
        }
        private string _schema;
        public string Schema
        {
            set { _schema = value; }
            get { return _schema; }
        }

        private string _pluralName;
        public string PluralName
        {
            set { _pluralName = value; }
            get
            {
                _pluralName = pluralizer.Pluralize(Name).Substring(0, pluralizer.Pluralize(Name).Length - 1) + pluralizer.Pluralize(Name).Substring(pluralizer.Pluralize(Name).Length - 1).ToLower();
                return _pluralName;
                
            }
        }

        private string _singularName;
        public string SingularName
        {
            set { _singularName = value; }
            get
            {
                _singularName = pluralizer.Singularize(Name);
                return _singularName;
            }
        }

        string _namespace;
        public string NameSpace
        {
            set { _namespace = value; }
            get
            {
                if (ParentDatabase != null && ParentDatabase.ParentProject != null)
                    if (!string.IsNullOrEmpty(ParentDatabase.ParentProject.NameSpace))
                        _namespace = ParentDatabase.ParentProject.NameSpace + "." + Schema;
                    else
                        _namespace = Schema;
                else
                    _namespace = Schema;
                return _namespace;
            }
        }

        private int _primaryColumnCount = 0;
        public int PrimaryColumnCount
        {
            set { _primaryColumnCount = value; }
            get { return _primaryColumnCount; }
        }

        private int _foreignColumnCount = 0;
        public int ForeignColumnCount
        {
            set { _foreignColumnCount = value; }
            get { return _foreignColumnCount; }
        }

        private string _tableId;
        public string TableID
        {
            set { _tableId = value; }
            get { return _tableId; }
        }

        private List<Column> _columns = new List<Column>();
        public List<Column> Columns
        {
            set { _columns = value; }
            get { return _columns; }
        }

        private List<Column> _displaySortedColumns = new List<Column>();
        public List<Column> DisplaySortedColumns
        {
            set { _displaySortedColumns = value.OrderBy(o => o.DisplayOrder).ToList(); }
            get
            {
                if (_displaySortedColumns.Count() == 0)
                    _displaySortedColumns = _columns.OrderBy(o => o.DisplayOrder).ToList();
                return _displaySortedColumns;
            }
        }

        private List<RelationShip> _ParentRelationShips = new List<RelationShip>();
        [XmlIgnoreAttribute]
        public List<RelationShip> ParentRelationShips
        {
            set { _ParentRelationShips = value; }
            get 
            {
                if (_ParentRelationShips.Count == 0)
                {
                    ParentDatabase.ParentProject.ExtractorManager.DatabaseReaders.GetParentRelations(this);
                }
                return _ParentRelationShips; 
            }
        }

        private List<RelationShip> _ChildRelationShips = new List<RelationShip>();
        [XmlIgnoreAttribute]
        public List<RelationShip> ChildRelationShips
        {
            set { _ChildRelationShips = value; }
            get 
            {
                if (_ChildRelationShips.Count == 0)
                {
                    ParentDatabase.ParentProject.ExtractorManager.DatabaseReaders.GetChildRelations(this);
                }
                return _ChildRelationShips; 
            }
        }

        public static Table GetByName(List<Table> tables, string searchName)
        {
            foreach (Table row in tables)
            {
                if (row.Name == searchName)
                    return row;
            }
            return null;
        }

        public override void UnSelect()
        {
            
            foreach (Column cols in Columns)
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
            Table tbl = new Table();
            tbl.Name = this.Name;
            tbl.EntitySelected = this.EntitySelected;
            tbl.Id = this.Id;
            tbl.PrimaryColumnCount = this.PrimaryColumnCount;
            tbl.Schema = this.Schema;
            tbl.TableID = this.TableID;
            foreach (Column col in this.Columns)
            {
                Column newCol = col.Clone() as Column;
                if (newCol != null)
                {
                    newCol.Parent = tbl;
                    tbl.Columns.Add(newCol);
                }
            }
            tbl.DisplaySortedColumns = tbl.Columns;
            return tbl;

        }

        #endregion
    }
}
