using System;
using System.Collections.Generic;
using System.Text;
using Ngx.Common.MetaDataExtraction.DatabaseExtractors;
using System.Xml.Serialization;
using System.IO;
//using Ngx.Common.MetaDataExtraction.DatabaseExtractors.Resources;


namespace Ngx.Common.Entities.MetaDataSchema
{
    [Serializable]
    public class Project : Entities.Entity
    {
        #region Properties

        private List<Schema> _SchemaDataset;
        [XmlIgnoreAttribute]
        public List<Schema> SchemaDataset
        {
            get
            {
                if (_SchemaDataset == null)
                {
                    _SchemaDataset = new List<Schema>();
                }
                return _SchemaDataset;
            }
        }

        private string _namespace = "";
        public string NameSpace
        {
            set { _namespace = value; }
            get { return _namespace; }
        }

        private string _RoutePrefix = "";
        public string RoutePrefix
        {
            set { _RoutePrefix = value; }
            get { return _RoutePrefix; }
        }

        private string _ComponentNameSpace = "";
        public string ComponentNameSpace
        {
            set { _ComponentNameSpace = value; }
            get { return _ComponentNameSpace; }
        }

        private DateTime _createDate = DateTime.MinValue;
        public DateTime CreateDate
        {
            set { _createDate = value; }
            get { return _createDate; }
        }

        private string _userName;
        [XmlIgnoreAttribute]
        public string UserName
        {
            set { _userName = value; }
            get { return _userName; }
        }

        private string _password;
        [XmlIgnoreAttribute]
        public string Password
        {
            set { _password = value; }
            get { return _password; }
        }

        private string _serverName;
        public string ServerName
        {
            set { _serverName = value; }
            get { return _serverName; }
        }

        private List<Database> _databases = new List<Database>();
        [XmlIgnoreAttribute]
        public List<Database> Databases
        {
            set { _databases = value; }
            get { return _databases; }
        }

        private bool _isWindowsAuthentication = true;
        [XmlIgnoreAttribute]
        public bool IsWindowsAuthentication
        {
            set { _isWindowsAuthentication = value; }
            get { return _isWindowsAuthentication; }
        }

        private DatabaseTypes _databaseType;
        [XmlIgnoreAttribute]
        public DatabaseTypes DatabaseType
        {
            set { _databaseType = value; }
            get { return _databaseType; }
        }
        #endregion

        private Ngx.Common.MetaDataExtraction.ExtractorManager _extractorManager = new Ngx.Common.MetaDataExtraction.ExtractorManager();
        [XmlIgnoreAttribute]
        public Ngx.Common.MetaDataExtraction.ExtractorManager ExtractorManager
        {
            get { return _extractorManager; }
        }

        public void Connect()
        {
            ExtractorManager.SetConnectionString(this, "");
            ExtractorManager.SetDatabaseReader(this);
            ExtractorManager.Connect(DatabaseType, UserName, Password, "", ServerName, IsWindowsAuthentication);
        }

        public void Connect(string conn)
        {
            this.DatabaseType = DatabaseTypes.SQLServer;
            ExtractorManager.SetDatabaseReader(this);
            ExtractorManager.ConnectionString = conn;
        }

        public Database GetDatabaseByName(string dbname)
        {
            Database result = null;
            foreach (Database db in Databases)
            {
                if (db.Name == dbname)
                {
                    result = db;
                    break;
                }
            }
            return result;
        }
        #region General Methods
        public override void UnSelect()
        {
            
            foreach (Database db in Databases)
            {
                db.UnSelect();
            }
        }

        public static string SerializeToString(object obj)
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
