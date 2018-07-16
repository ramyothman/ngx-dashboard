using System;
using System.Collections.Generic;
using System.Text;

namespace Festo.Common.Entities.MetaDataSchema
{
    [Serializable]
    public class DataType : Entities.Entity
    {
        #region Properties
        private string _sqlType;
        public string SQLType
        {
            set { _sqlType = value; }
            get { return _sqlType; }
        }

        private string _dotNetType;
        
        public string DotNetType
        {
            set { _dotNetType = value; }
            get 
            { 
            
                if(DotNetTypes.ContainsKey(SQLType))
                {
                    _dotNetType = DotNetTypes[SQLType].ToString();
                }
                return _dotNetType; 
            }
        }

        private string _csharpType;
        public string CSharpType
        {
            set{_csharpType = value;}
            get 
            {
                if (CSharpTypes.ContainsKey(SQLType))
                    _csharpType = CSharpTypes[SQLType].ToString();
                return _csharpType; 
            }
        }

        private string _vbType;
        public string VBType
        {
            set
            {
                _vbType = value;
            }
            get 
            {
                if (VBTypes.ContainsKey(SQLType))
                    _vbType = VBTypes[SQLType].ToString();
                return _vbType ;
            }
        }

        private string _javaType;
        public string JavaType
        {
            set{_javaType = value;}
            get 
            {
                if (JavaTypes.ContainsKey(SQLType))
                    _javaType = JavaTypes[SQLType].ToString();
                return _javaType; 
            }
        }

        private string _languageSpecificType;
        public string LanguageSpecificType
        {
            set
            {
                _languageSpecificType = value;
            }
            get 
            {
                if (langSpecificTypes.ContainsKey(SQLType))
                    _languageSpecificType = langSpecificTypes[SQLType].ToString();
                return _languageSpecificType; 
            }
        }

        private string _LibraryType;
        public string LibraryType
        {
            set
            {
                _LibraryType = value;
            }
            get
            {
                if (libraryTypes.ContainsKey(SQLType))
                    _LibraryType =  libraryTypes[SQLType].ToString();
                return _LibraryType;
            }
        }

        public bool CalculateLength
        {
            get
            {
                if (calculateLengths.ContainsKey(SQLType))
                    return Convert.ToBoolean(calculateLengths[SQLType]);
                return false;
            }
        }
        #endregion

        #region Declarations
        public static System.Collections.Hashtable CSharpTypes = new System.Collections.Hashtable();
        public static System.Collections.Hashtable VBTypes = new System.Collections.Hashtable();
        public static System.Collections.Hashtable JavaTypes = new System.Collections.Hashtable();
        public static System.Collections.Hashtable DotNetTypes = new System.Collections.Hashtable();
        public static System.Collections.Hashtable langSpecificTypes = new System.Collections.Hashtable();
        public static System.Collections.Hashtable libraryTypes = new System.Collections.Hashtable();
        public static System.Collections.Hashtable calculateLengths = new System.Collections.Hashtable();
        #endregion

        #region Methods
        public static void LoadHashTables(string xmlPath)
        {
            VBTypes.Clear();
            CSharpTypes.Clear();
            JavaTypes.Clear();
            DotNetTypes.Clear();
            libraryTypes.Clear();
            langSpecificTypes.Clear();
            calculateLengths.Clear();
            if(System.IO.File.Exists(xmlPath))
            {
                System.Xml.XmlDocument document = new System.Xml.XmlDocument();
                document.Load(xmlPath);

                System.Xml.XmlNodeList nodeList = document.GetElementsByTagName("*");
                foreach(System.Xml.XmlNode node in nodeList)
                {
                    if (node.Attributes["VBType"] != null && node.Attributes["name"] != null)
                        VBTypes.Add(node.Attributes["name"].Value, node.Attributes["VBType"].Value);

                    if (node.Attributes["CSharpType"] != null && node.Attributes["name"] != null)
                        CSharpTypes.Add(node.Attributes["name"].Value, node.Attributes["CSharpType"].Value);

                    if (node.Attributes["JavaType"] != null && node.Attributes["name"] != null)
                        JavaTypes.Add(node.Attributes["name"].Value, node.Attributes["JavaType"].Value);

                    if (node.Attributes["DotNetType"] != null && node.Attributes["name"] != null)
                        DotNetTypes.Add(node.Attributes["name"].Value, node.Attributes["DotNetType"].Value);

                    if (node.Attributes["LibraryType"] != null && node.Attributes["name"] != null)
                        libraryTypes.Add(node.Attributes["name"].Value, node.Attributes["LibraryType"].Value);

                    if (node.Attributes["LanguageSpecificType"] != null && node.Attributes["name"] != null)
                        langSpecificTypes.Add(node.Attributes["name"].Value, node.Attributes["LanguageSpecificType"].Value);

                    if (node.Attributes["CalculateLength"] != null && node.Attributes["name"] != null)
                        calculateLengths.Add(node.Attributes["name"].Value, node.Attributes["CalculateLength"].Value);
                }
            }
        }
        #endregion

    }
}
