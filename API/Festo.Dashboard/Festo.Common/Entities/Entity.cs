using System;
using System.Collections.Generic;
using System.Text;
using Festo.Common.Entities.MetaDataSchema;
using System.Text.RegularExpressions;
using System.Xml.Serialization;

namespace Festo.Common.Entities
{
    [Serializable]
    public abstract class Entity: ICloneable
    {
        #region Properties
        private string _id = "";
        public string Id
        {
            set
            {
                _id = value;
            }
            get 
            { 
                if(string.IsNullOrEmpty(_id))
                    _id = Guid.NewGuid().ToString();
                return _id; 
            }
        }
        [XmlIgnoreAttribute]
        public Guid GuidId
        {
            get
            {
                return new Guid(Id);
            }
        }

        private string _name = "";
        public string Name
        {
            set { _name = value; }
            get { return _name; }
        }

        private string _nameForQuery = "";
        public string NameForQuery
        {
            set { _nameForQuery = value; }
            get { return _nameForQuery; }
        }

        private string _NameWithDashes = "";
        public string NameWithDashes
        {
            set
            {
                _NameWithDashes = value;
            }
            get
            {
                _NameWithDashes = Name.SplitCamelCase().Replace(" ", "-");
                return _NameWithDashes;
            }
        }

        private string _NameWithDashesLowered = "";
        public string NameWithDashesLowered
        {
            set
            {
                _NameWithDashesLowered = value;
            }
            get
            {
                _NameWithDashesLowered = Name.SplitCamelCase().Replace(" ", "-").ToLower();
                return _NameWithDashesLowered;
            }
        }

        private bool _entitySelected = false;
        public bool EntitySelected
        {
            get { return _entitySelected; }
            set
            {
                _entitySelected = value;
            }
        }

        protected Entity _Parent;
        [XmlIgnoreAttribute]
        public virtual Entity Parent
        {
            get { return _Parent; }
            set { _Parent = value; }
        }
        #endregion
        public Entity()
        {
            //_id = Guid.NewGuid().ToString();
        }


        public string GetGuid(string value)
        {
            string result = value;
            string guidMatch = @"(\{{0,1}([0-9a-fA-F]){8}-([0-9a-fA-F]){4}-([0-9a-fA-F]){4}-([0-9a-fA-F]){4}-([0-9a-fA-F]){12}\}{0,1})";
            Regex internalReg = new Regex(guidMatch, RegexOptions.Singleline);
            Match internalMatch = internalReg.Match(value);
            if(internalMatch.Success)
                result = internalMatch.Value;
            return result;
        }
        public void ConvertToXML(string path)
        {
            System.Xml.Serialization.XmlSerializer x = new System.Xml.Serialization.XmlSerializer(this.GetType());
            System.IO.StreamWriter writer = new System.IO.StreamWriter(path);
            x.Serialize(writer, this);

        }
        public virtual void UnSelect()
        {
            EntitySelected = false;
        }
        public virtual void Select()
        {
            EntitySelected = true;
            if (Parent != null)
                Parent.Select();
        }
        public Entities.Entity ConvertToObject(string path)
        {
            Entities.Entity result = null;
            System.Xml.Serialization.XmlSerializer x = new System.Xml.Serialization.XmlSerializer(this.GetType());
            System.IO.StreamReader reader = new System.IO.StreamReader(path);
            result = x.Deserialize(reader) as Entities.Entity;
            return result;
        }

        #region Entity Object Retrieval By ID

        public static Entity GetbyId(string id, List<Entities.Entity> entities)
        {
            foreach (Entity e in entities)
            {
                if (e.Id == id)
                    return e;
            }
            return null;
        }
        public static Database GetbyId(string id, List<Entities.MetaDataSchema.Database> databases)
        {
            foreach (MetaDataSchema.Database d in databases)
            {
                if (d.Id == id)
                    return d;
            }
            return null;
        }
        public static Function GetbyId(string id, List<Entities.MetaDataSchema.Function> functions)
        {
            foreach (MetaDataSchema.Function d in functions)
            {
                if (d.Id == id)
                    return d;
            }
            return null;
        }
        public static StoredProcedure GetbyId(string id, List<Entities.MetaDataSchema.StoredProcedure> storedProcedures)
        {
            foreach (MetaDataSchema.StoredProcedure d in storedProcedures)
            {
                if (d.Id == id)
                    return d;
            }
            return null;
        }
        public static Table GetbyId(string id, List<Entities.MetaDataSchema.Table> tables)
        {
            foreach (MetaDataSchema.Table d in tables)
            {
                if (d.Id == id)
                    return d;
            }
            return null;
        }

        public static Table GetbyName(string name, List<Entities.MetaDataSchema.Table> tables)
        {
            foreach (MetaDataSchema.Table d in tables)
            {
                if (d.Name == name)
                    return d;
            }
            return null;
        }
        public static View GetbyId(string id, List<Entities.MetaDataSchema.View> views)
        {
            foreach (MetaDataSchema.View d in views)
            {
                if (d.Id == id)
                    return d;
            }
            return null;
        }
        public static Column GetbyId(string id, List<Entities.MetaDataSchema.Column> columns)
        {
            foreach (MetaDataSchema.Column d in columns)
            {
                if (d.Id == id)
                    return d;
            }
            return null;
        }

        #endregion

        #region Adding Schema Node

        #region Helper Methods
        private string GetTypeString(SectionType type)
        {
            string str = "";
            switch (type)
            {
                case SectionType.Column:
                    str = "Column";
                    break;
                case SectionType.Database:
                    str = "Database";
                    break;
                case SectionType.Folder:
                    str = "Folder";
                    break;
                case SectionType.Table:
                    str = "Table";
                    break;
                case SectionType.View:
                    str = "View";
                    break;
                case SectionType.StoredProcedure:
                    str = "Stored Procedure";
                    break;
                case SectionType.Function:
                    str = "Function";
                    break;
                case SectionType.NoType:
                    str = "NoType";
                    break;
            }
            return str;
        }
        private SectionType GetStringType(string type)
        {
            SectionType str = SectionType.NoType;
            switch (type)
            {
                case "Column":
                    str = SectionType.Column;
                    break;
                case "Database":
                    str = SectionType.Database;
                    break;
                case "Table":
                    str = SectionType.Table;
                    break;
                case "Folder":
                    str = SectionType.Folder;
                    break;
                case "Stored Procedure":
                    str = SectionType.StoredProcedure;
                    break;
                case "Function":
                    str = SectionType.Function;
                    break;
                case "View":
                    str = SectionType.View;
                    break;
                case "NoType":
                    str = SectionType.NoType;
                    break;
            }
            return str;
        }

        private string GetColumnTypeString(string text)
        {
            string[] result = text.Split(',');
            if (result.Length > 0)
            {
                return result[0];
            }
            return "";
        }
        private string GetColumnIdString(string text)
        {
            string[] result = text.Split(',');
            if (result.Length > 1)
            {
                return result[1];
            }
            return "";
        }

        #endregion

        public Schema AddDatabaseNode(List<Schema> mainDS, Guid id, string schema, string name, string fullName)
        {
            return AddNodeRow(mainDS, id, null, schema, name, fullName, GetTypeString(SectionType.Database), "", 0);
        }

        public Schema AddTableNode(List<Schema> mainDS, Guid id, Guid parent, string schema, string name, string fullName)
        {
            return AddNodeRow(mainDS, id, parent, schema, name, fullName, GetTypeString(SectionType.Table), "", 1);
        }

        public Schema AddColumnNode(List<Schema> mainDS, Guid id, Guid parent, string fullName, string dataType, int imageIndex)
        {
            return AddNodeRow(mainDS, id, parent, "", fullName, fullName, GetTypeString(SectionType.Column), dataType, imageIndex);
        }

        public Schema AddFolderNode(List<Schema> mainDS, Guid id, Guid parent, string fullName)
        {
            return AddNodeRow(mainDS, id, parent, "", fullName, fullName, GetTypeString(SectionType.Folder), "", 6);
        }

        public Schema AddViewNode(List<Schema> mainDS, Guid id, Guid parent, string schema, string name, string fullName)
        {
            return AddNodeRow(mainDS, id, parent, schema, name, fullName, GetTypeString(SectionType.View), "", 7);
        }

        public Schema AddStoredProcedureNode(List<Schema> mainDS, Guid id, Guid parent, string schema, string name, string fullName)
        {
            return AddNodeRow(mainDS, id, parent, schema, name, fullName, GetTypeString(SectionType.StoredProcedure), "", 11);
        }

        public Schema AddFunctionNode(List<Schema> mainDS, Guid id, Guid parent, string schema, string name, string fullName)
        {
            return AddNodeRow(mainDS, id, parent, schema, name, fullName, GetTypeString(SectionType.Function), "", 8);
        }
        private Schema AddNodeRow(List<Schema> mainDS,Guid id, Guid? parent, string schema, string name, string fullName, string schemaType, string dataType, int imageIndex)
        {
            Schema row = new Schema();
            row.Name = name;
            row.SchemaName = schema;
            row.FullName = fullName;
            row.ID = id;
            row.SchemaType = schemaType;
            row.ImageIndex = imageIndex;
            if (parent.HasValue) row.ParentID = parent.Value;
            row.DataType = dataType;
            mainDS.Add(row);
            return row;
        }
        #endregion

        #region ICloneable Members

        public virtual object Clone()
        {
            throw new Exception("The method or operation is not implemented.");
        }
        
        #endregion
    }


}
