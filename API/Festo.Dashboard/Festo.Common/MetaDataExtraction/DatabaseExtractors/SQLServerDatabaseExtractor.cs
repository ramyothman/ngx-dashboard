using System;
using System.Collections.Generic;
using System.Text;
using System.Data;

namespace Festo.Common.MetaDataExtraction.DatabaseExtractors
{
    public class SQLServerDatabaseExtractor : DatabaseExtractor
    {
        public override void GetDatabases(Festo.Common.Entities.MetaDataSchema.Project project)
        {
            GetDatabasesBySql(project);
        }

        public override void GetDatabasesBySql(Festo.Common.Entities.MetaDataSchema.Project project)
        {
            
            System.Data.SqlClient.SqlConnection conn = new System.Data.SqlClient.SqlConnection(project.ExtractorManager.ConnectionString);
            conn.Open();
            System.Data.DataTable tables = new DataTable();
            tables.Load(project.ExtractorManager.SelectStatement(String.Format("SELECT name FROM master.dbo.sysdatabases")), LoadOption.OverwriteChanges);
            project.Databases.Clear();
            foreach (DataRow row in tables.Rows)
            {
                Entities.MetaDataSchema.Database db = new Festo.Common.Entities.MetaDataSchema.Database();
                db.Name = row["name"].ToString();
                db.NameForQuery = db.Name;
                db.ParentProject = project;
                project.Databases.Add(db);
                project.AddDatabaseNode(project.SchemaDataset, db.GuidId, "", db.Name, db.Name);
            }
        }

        #region Tables
        public override void GetTables(Festo.Common.Entities.MetaDataSchema.Database database)
        {
            System.Data.DataTable tables = new DataTable();
            System.Data.DataTable sqlServerTable = new DataTable();
            tables.Load(database.ParentProject.ExtractorManager.SelectStatement(String.Format("Select * From INFORMATION_SCHEMA.TABLES Where Table_Type = '{1}'", database.NameForQuery, Resources.DataStructure.TableType)), LoadOption.OverwriteChanges);
            sqlServerTable.Load(database.ParentProject.ExtractorManager.SelectStatement(String.Format("Select * From sys.all_objects Where Type_Desc = 'user_table'", database.NameForQuery)), LoadOption.OverwriteChanges);
            database.Tables.Clear();
            foreach (DataRow row in tables.Rows)
            {
                Entities.MetaDataSchema.Table tbl = new Festo.Common.Entities.MetaDataSchema.Table();
                
                tbl.ParentDatabase = database;
                tbl.Schema = row["Table_Schema"].ToString();
                tbl.Name = row["Table_Name"].ToString();
                DataRow[] sqlRows = sqlServerTable.Select("[name] = '" + tbl.Name + "'");
                if (sqlRows.Length > 0)
                {
                    tbl.TableID = sqlRows[0]["object_id"].ToString();
                }
                database.Tables.Add(tbl);
            }
        }

        public override void GetTables(Festo.Common.Entities.MetaDataSchema.Project project)
        {
            foreach (Entities.MetaDataSchema.Database dbase in project.Databases)
            {
                System.Data.DataTable tables = new DataTable();
                System.Data.DataTable sqlServerTable = new DataTable();
                tables.Load(project.ExtractorManager.SelectStatement("Select * From " + dbase.NameForQuery + "INFORMATION_SCHEMA.TABLES Where Table_Type = '" + Resources.DataStructure.TableType + "'"), LoadOption.OverwriteChanges);
                sqlServerTable.Load(project.ExtractorManager.SelectStatement("Select * From " + dbase.NameForQuery + "sys.all_objects Where Type_Desc = 'user_table'"), LoadOption.OverwriteChanges);
                OnStartLoading(new Festo.Common.Events.LoadingEventArgs(dbase.Name,"Tables","Database"));
                dbase.Tables.Clear();
                foreach (DataRow row in tables.Rows)
                {
                    
                    Entities.MetaDataSchema.Table tbl = new Festo.Common.Entities.MetaDataSchema.Table();
                    tbl.ParentDatabase = dbase;
                    tbl.Schema = row["Table_Schema"].ToString();
                    tbl.Name = row["Table_Name"].ToString();
                    DataRow[] sqlRows = sqlServerTable.Select("[name] = '" + tbl.Name + "'");
                    if (sqlRows.Length > 0)
                    {
                        tbl.TableID = sqlRows[0]["object_id"].ToString();
                    }
                    dbase.Tables.Add(tbl);
                }
                OnEndLoading(new Festo.Common.Events.LoadingEventArgs(dbase.Name, "Tables","Database"));
                tables.Dispose();
            }
            GC.Collect();
        }
        #endregion

        #region Columns
        public override void GetColumns(Festo.Common.Entities.MetaDataSchema.Table table)
        {
            System.Data.DataTable tables = new DataTable();
            System.Data.DataTable sqlServerTable = new DataTable();
            
            //System.Data.DataTable sqlObjectsTable = new DataTable();
            System.Data.DataTable keyConstraints = new DataTable();
            tables.Load(table.ParentDatabase.ParentProject.ExtractorManager.SelectStatement(String.Format("Select * From {0}INFORMATION_SCHEMA.COLUMNS", table.ParentDatabase.NameForQuery)), LoadOption.OverwriteChanges);
            //sqlObjectsTable.Load(table.ParentDatabase.ParentProject.ExtractorManager.SelectStatement("Select * From " + table.ParentDatabase.Name + ".sys.objects"), LoadOption.OverwriteChanges);
            sqlServerTable.Load(table.ParentDatabase.ParentProject.ExtractorManager.SelectStatement(String.Format("Select * From {0}sys.all_columns", table.ParentDatabase.NameForQuery)), LoadOption.OverwriteChanges);

            string query = String.Format("Select c.CONSTRAINT_NAME,c.Constraint_Type,t.Column_Name,c.Table_Name,c.Table_Schema From {0}INFORMATION_SCHEMA.TABLE_CONSTRAINTS as c Inner join {0}INFORMATION_SCHEMA.CONSTRAINT_COLUMN_USAGE as t on c.Constraint_Name = t.Constraint_Name", table.ParentDatabase.NameForQuery);
            //Select * From INFORMATION_SCHEMA.KEY_COLUMN_USAGE
            //"Select * From " + table.ParentDatabase.Name + ".INFORMATION_SCHEMA.KEY_COLUMN_USAGE"
            keyConstraints.Load(table.ParentDatabase.ParentProject.ExtractorManager.SelectStatement(query), LoadOption.OverwriteChanges);

            DataRow[] standRows = tables.Select(String.Format("Table_Schema = '{0}' AND Table_Name = '{1}'", table.Schema, table.Name));
            DataRow[] sqlRows = null;// sqlServerTable.Select("object_id = " + table.TableID);
            DataRow[] keyRows = null;
            OnStartLoading(new Festo.Common.Events.LoadingEventArgs(table.Name,"Columns","Table"));
            table.Columns.Clear();
            foreach (DataRow row in standRows)
            {
                Entities.MetaDataSchema.Column col = new Festo.Common.Entities.MetaDataSchema.Column();
                col.ParentTable = table;
                col.Name = row["Column_Name"].ToString();

                //Extracting the HTML display information from the column description
                System.Data.DataTable displayInfo = new DataTable();
                string _query = String.Format("select sep.value[Description] from {0}sys.tables st inner join {0}sys.columns sc on st.object_id = sc.object_id left join {0}sys.extended_properties sep on st.object_id = sep.major_id and sc.column_id = sep.minor_id and sep.name = 'MS_Description' where st.name = '{1}' and sc.name='{2}'", table.ParentDatabase.NameForQuery, table.Name, col.Name);  
                displayInfo.Load(table.ParentDatabase.ParentProject.ExtractorManager.SelectStatement(_query), LoadOption.OverwriteChanges);
                DataRow[] off = displayInfo.Select(String.Format("1=1"));
                string des = off[0].ItemArray[0].ToString();
                col.DisplayType = "";
                if (des.Contains("field"))
                {
                    col.DisplayType = "field";
                    des = des.Replace("field ", "");
                    col.DisplayOrder = int.Parse(des.Split(',')[0]);
                    col.ColSpan = int.Parse(des.Split(',')[1]);
                    col.NewGroup = int.Parse(des.Split(',')[2]) == 1 ? true : false;
                    col.NewRow = int.Parse(des.Split(',')[3]) == 1 ? true : false;
                }
                else
                {
                    col.DisplayType = des;
                    col.DisplayOrder = 0;
                }

                col.OrdinalPosition = Convert.ToInt32(row["Ordinal_Position"]);
                if (row["Is_Nullable"].ToString().ToLower() == "yes")
                    col.AllowNull = true;
                else
                    col.AllowNull = false;
                col.ColumnDataType.SQLType = row["Data_Type"].ToString();
                if (row["Character_Maximum_Length"] != DBNull.Value)
                {
                    col.Length = Convert.ToInt32(row["Character_Maximum_Length"]);
                }

                sqlRows = sqlServerTable.Select("object_id = " + table.TableID + " AND [name] = '" + col.Name + "'");

                if (sqlRows.Length > 0)
                {
                    col.IsIdentity = Convert.ToBoolean(sqlRows[0]["is_identity"]);
                    col.IsComputed = Convert.ToBoolean(sqlRows[0]["is_computed"]);
                    col.Precision = Convert.ToInt32(sqlRows[0]["precision"]);
                    col.Scale = Convert.ToInt32(sqlRows[0]["scale"]);
                    col.ColumnId = sqlRows[0]["column_id"].ToString();
                    keyRows = keyConstraints.Select("Table_Schema = '" + table.Schema + "' AND Table_Name = '" + table.Name + "' AND Column_Name = '" + col.Name + "'");
                    foreach (DataRow key in keyRows)
                    {
                        if (key["Constraint_Type"].ToString() == "PRIMARY KEY")
                            col.IsPrimary = true;
                        else if (key["Constraint_Type"].ToString() == "FOREIGN KEY")
                        {
                            col.IsForeign = true;
                            col.ParentTableName = key["Constraint_Name"].ToString().Replace("FK_"+ table.Name+"_", ""); 
                            col.ParentTableNameDashesLowered = col.ParentTableName.SplitCamelCase().Replace(" ", "-").ToLower();
                        }
                    }
                    //keyRows = keyConstraints.Select("TABLE_Name = '" + table.Name + "' AND Column_Name = '" + col.Name + "'");
                    //foreach(DataRow key in keyRows)
                    //{
                    //    string ordinalKey = key["Column_Name"].ToString();
                    //    DataRow[] objectRelationRow = sqlObjectsTable.Select("name = '" + key["Constraint_Name"] + "'");
                    //    if (objectRelationRow.Length > 0)
                    //    {
                    //        if (objectRelationRow[0]["type"].ToString().Trim() == "PK")
                    //            col.IsPrimary = true;
                    //        else if ((objectRelationRow[0]["type"].ToString().Trim() == "FK" || objectRelationRow[0]["type"].ToString().Trim() == "F"))
                    //            col.IsForeign = true;
                    //    }
                    //}
                }
                table.Columns.Add(col);
            }
            table.DisplaySortedColumns = table.Columns;
            OnEndLoading(new Festo.Common.Events.LoadingEventArgs(table.Name,"Columns","Table"));
            GC.Collect();
        }

        public override void GetColumns(Festo.Common.Entities.MetaDataSchema.View view)
        {
            System.Data.DataTable views = new DataTable();
            string query = String.Format("select {0}sys.all_columns.*,{0}sys.types.name as typename From {0}sys.all_columns inner join {0}sys.types on {0}sys.all_columns.system_type_id = {0}sys.types.system_type_id where object_id = {1} and {0}sys.types.name <> 'sysname'", view.ParentDatabase.NameForQuery, view.ViewID);
            views.Load(view.ParentDatabase.ParentProject.ExtractorManager.SelectStatement(query), LoadOption.OverwriteChanges);
            OnStartLoading(new Festo.Common.Events.LoadingEventArgs(view.Name, "Columns","View"));
            view.Columns.Clear();
            foreach (DataRow row in views.Rows)
            {
                Entities.MetaDataSchema.Column col = new Festo.Common.Entities.MetaDataSchema.Column();
                col.ParentView = view;
                col.Name = row["name"].ToString();
                col.OrdinalPosition = Convert.ToInt32(row["column_id"]);
                col.Precision = Convert.ToInt32(row["precision"]);
                col.Scale = Convert.ToInt32(row["scale"]);
                if (row["is_nullable"].ToString().ToLower() == "yes" || row["is_nullable"].ToString().ToLower() == "1" || row["is_nullable"].ToString().ToLower() == "true")
                    col.AllowNull = true;
                else
                    col.AllowNull = false;
                col.ColumnDataType.SQLType = row["typename"].ToString();
                if (row["max_length"] != DBNull.Value)
                {
                    col.Length = Convert.ToInt32(row["max_length"])/2;
                }
                col.IsIdentity = Convert.ToBoolean(row["is_identity"]);
                col.IsComputed = Convert.ToBoolean(row["is_computed"]);
                col.ColumnId = row["column_id"].ToString();
                view.Columns.Add(col);
            }
            OnEndLoading(new Festo.Common.Events.LoadingEventArgs(view.Name, "Columns","View"));
            GC.Collect();
        }

        public override void GetColumns(Festo.Common.Entities.MetaDataSchema.Database database)
        {
            System.Data.DataTable tables = new DataTable();
            System.Data.DataTable sqlServerTable = new DataTable();
            //System.Data.DataTable sqlObjectsTable = new DataTable();
            System.Data.DataTable keyConstraints = new DataTable();
            tables.Load(database.ParentProject.ExtractorManager.SelectStatement("Select * From " + database.NameForQuery + "INFORMATION_SCHEMA.COLUMNS"), LoadOption.OverwriteChanges);
            sqlServerTable.Load(database.ParentProject.ExtractorManager.SelectStatement("Select * From " + database.NameForQuery + "sys.all_columns"), LoadOption.OverwriteChanges);
            string query = "Select c.CONSTRAINT_NAME,c.Constraint_Type,t.Column_Name,c.Table_Name,c.Table_Schema From " + database.NameForQuery + "INFORMATION_SCHEMA.TABLE_CONSTRAINTS as c Inner join " + database.NameForQuery + "INFORMATION_SCHEMA.CONSTRAINT_COLUMN_USAGE as t on c.Constraint_Name = t.Constraint_Name";
            //sqlObjectsTable.Load(table.ParentDatabase.ParentProject.ExtractorManager.SelectStatement("Select * From " + table.ParentDatabase.Name + ".sys.objects"), LoadOption.OverwriteChanges);
            keyConstraints.Load(database.ParentProject.ExtractorManager.SelectStatement(query), LoadOption.OverwriteChanges) ;

            foreach (Entities.MetaDataSchema.Table table in database.Tables)
            {
                OnStartLoading(new Festo.Common.Events.LoadingEventArgs(table.Name,"Columns","Table"));
                DataRow[] standRows = tables.Select("Table_Schema = '" + table.Schema + "' AND Table_Name = '" + table.Name + "'");
                DataRow[] sqlRows = null;// sqlServerTable.Select("object_id = " + table.TableID);
                DataRow[] keyRows = null;
                table.Columns.Clear();
                foreach (DataRow row in standRows)
                {
                    Entities.MetaDataSchema.Column col = new Festo.Common.Entities.MetaDataSchema.Column();
                    col.ParentTable = table;
                    col.Name = row["Column_Name"].ToString();
                    col.OrdinalPosition = Convert.ToInt32(row["Ordinal_Position"]);
                    if (row["Is_Nullable"].ToString().ToLower() == "yes")
                        col.AllowNull = true;
                    else
                        col.AllowNull = false;
                    col.ColumnDataType.SQLType = row["Data_Type"].ToString();
                    if (row["Character_Maximum_Length"] != DBNull.Value)
                    {
                        col.Length = Convert.ToInt32(row["Character_Maximum_Length"]);
                    }

                    sqlRows = sqlServerTable.Select("object_id = " + table.TableID + " AND [name] = '" + col.Name + "'");
                    if (sqlRows.Length > 0)
                    {
                        col.IsIdentity = Convert.ToBoolean(sqlRows[0]["is_identity"]);
                        col.IsComputed = Convert.ToBoolean(sqlRows[0]["is_computed"]);
                        col.Precision = Convert.ToInt32(sqlRows[0]["precision"]);
                        col.Scale = Convert.ToInt32(sqlRows[0]["scale"]);
                        col.ColumnId = sqlRows[0]["object_id"].ToString();
                        keyRows = keyConstraints.Select("Table_Schema = '" + table.Schema + "' AND Table_Name = '" + table.Name + "' AND Column_Name = '" + col.Name + "'");
                        foreach (DataRow key in keyRows)
                        {
                            if (key["Constraint_Type"].ToString() == "PRIMARY KEY")
                                col.IsPrimary = true;
                            else if (key["Constraint_Type"].ToString() == "FOREIGN KEY")
                                col.IsForeign = true;
                        }
                    }
                    table.Columns.Add(col);
                }
                OnEndLoading(new Festo.Common.Events.LoadingEventArgs(table.Name, "Columns","Table"));
            }
            GC.Collect();


        }
        #endregion

        #region Relations
        public override void GetParentRelations(Festo.Common.Entities.MetaDataSchema.Table table)
        {
            string query = String.Format(@"select sv.*,cu.COLUMN_NAME as ParentColumn,cu.TABLE_CATALOG as ParentCatalog,cu.TABLE_NAME as ParentTable,cu.TABLE_SCHEMA as ParentSchema
                           From 
                           (select r.CONSTRAINT_NAME,r.UNIQUE_CONSTRAINT_CATALOG,r.UNIQUE_CONSTRAINT_NAME,r.UNIQUE_CONSTRAINT_SCHEMA,r.UPDATE_RULE,t.CONSTRAINT_CATALOG,t.CONSTRAINT_SCHEMA,t.CONSTRAINT_TYPE,t.TABLE_CATALOG,t.TABLE_NAME,t.TABLE_SCHEMA,c.COLUMN_NAME,c.ORDINAL_POSITION
                           From {0}INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS as r
                           INNER JOIN {0}INFORMATION_SCHEMA.TABLE_CONSTRAINTS as t on r.CONSTRAINT_NAME = t.CONSTRAINT_NAME 
                           INNER JOIN {0}INFORMATION_SCHEMA.KEY_COLUMN_USAGE as c on
                           t.CONSTRAINT_NAME = c.CONSTRAINT_NAME
                           where t.TABLE_SCHEMA = '{1}' AND t.TABLE_NAME = '{2}') as sv Inner Join
                           {0}INFORMATION_SCHEMA.KEY_COLUMN_USAGE as cu on sv.UNIQUE_CONSTRAINT_NAME = cu.CONSTRAINT_NAME
                           ", table.ParentDatabase.NameForQuery, table.Schema, table.NameForQuery);
            System.Data.DataTable relations = new DataTable();
            List<Festo.Common.Entities.MetaDataSchema.RelationShip> _ParentRelationShips = new List<Festo.Common.Entities.MetaDataSchema.RelationShip>();
            relations.Load(table.ParentDatabase.ParentProject.ExtractorManager.SelectStatement(query), LoadOption.OverwriteChanges);
            foreach (DataRow row in relations.Rows)
            {
                Festo.Common.Entities.MetaDataSchema.RelationShip relationShip = new Entities.MetaDataSchema.RelationShip();
                relationShip.Name = row["CONSTRAINT_NAME"].ToString();
                relationShip.ChildTable = new Entities.MetaDataSchema.Table(row["TABLE_NAME"].ToString(), row["TABLE_SCHEMA"].ToString(), table.ParentDatabase);
                relationShip.ChildColumn = new Entities.MetaDataSchema.Column(row["COLUMN_NAME"].ToString());
                relationShip.MasterTable = new Entities.MetaDataSchema.Table(row["ParentTable"].ToString(), row["ParentSchema"].ToString(), table.ParentDatabase);
                relationShip.ParentColumn = new Entities.MetaDataSchema.Column(row["ParentColumn"].ToString());
                _ParentRelationShips.Add(relationShip);   
            }
            table.ParentRelationShips = _ParentRelationShips;
        }
        public override void GetChildRelations(Festo.Common.Entities.MetaDataSchema.Table table)
        {
            DataTable relations = new DataTable();
            string query = string.Format(@"select * From 
(select sv.*,cu.COLUMN_NAME as ParentColumn,cu.TABLE_CATALOG as ParentCatalog,cu.TABLE_NAME as ParentTable,cu.TABLE_SCHEMA as ParentSchema
From 
(select r.CONSTRAINT_NAME,r.UNIQUE_CONSTRAINT_CATALOG,r.UNIQUE_CONSTRAINT_NAME,r.UNIQUE_CONSTRAINT_SCHEMA,r.UPDATE_RULE,t.CONSTRAINT_CATALOG,t.CONSTRAINT_SCHEMA,t.CONSTRAINT_TYPE,t.TABLE_CATALOG,t.TABLE_NAME,t.TABLE_SCHEMA,c.COLUMN_NAME,c.ORDINAL_POSITION
From {0}INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS as r
INNER JOIN {0}INFORMATION_SCHEMA.TABLE_CONSTRAINTS as t on r.CONSTRAINT_NAME = t.CONSTRAINT_NAME 
INNER JOIN {0}INFORMATION_SCHEMA.KEY_COLUMN_USAGE as c on
t.CONSTRAINT_NAME = c.CONSTRAINT_NAME) as sv Inner Join
{0}INFORMATION_SCHEMA.KEY_COLUMN_USAGE as cu on sv.UNIQUE_CONSTRAINT_NAME = cu.CONSTRAINT_NAME
) as mview
where ParentTable = '{2}' AND ParentSchema = '{1}'
", table.ParentDatabase.NameForQuery, table.Schema, table.Name);
            List<Festo.Common.Entities.MetaDataSchema.RelationShip> _ChildRelationShips = new List<Festo.Common.Entities.MetaDataSchema.RelationShip>();
            relations.Load(table.ParentDatabase.ParentProject.ExtractorManager.SelectStatement(query), LoadOption.OverwriteChanges);
            foreach (DataRow row in relations.Rows)
            {
                Festo.Common.Entities.MetaDataSchema.RelationShip relationShip = new Entities.MetaDataSchema.RelationShip();
                relationShip.Name = row["CONSTRAINT_NAME"].ToString();
                relationShip.ChildTable = new Entities.MetaDataSchema.Table(row["TABLE_NAME"].ToString(), row["TABLE_SCHEMA"].ToString(), table.ParentDatabase);
                relationShip.ChildColumn = new Entities.MetaDataSchema.Column(row["COLUMN_NAME"].ToString());
                relationShip.MasterTable = new Entities.MetaDataSchema.Table(row["ParentTable"].ToString(), row["ParentSchema"].ToString(), table.ParentDatabase);
                relationShip.ParentColumn = new Entities.MetaDataSchema.Column(row["ParentColumn"].ToString());
                _ChildRelationShips.Add(relationShip);
            }
            table.ChildRelationShips = _ChildRelationShips;
        }
        public override void GetTableRelations(Festo.Common.Entities.MetaDataSchema.Table table)
        {
            GetParentRelations(table);
            GetChildRelations(table);
            
        }

        public override void GetTableRelations(Festo.Common.Entities.MetaDataSchema.Project project)
        {
            throw new NotImplementedException();
        }

        #endregion

        #region Views
        public override void GetViews(Festo.Common.Entities.MetaDataSchema.Database database)
        {
            System.Data.DataTable views = new DataTable();
            System.Data.DataTable sqlServerTable = new DataTable();
            views.Load(database.ParentProject.ExtractorManager.SelectStatement("Select * From " + database.NameForQuery + "INFORMATION_SCHEMA.VIEWS Order By Table_Name"), LoadOption.OverwriteChanges);
            sqlServerTable.Load(database.ParentProject.ExtractorManager.SelectStatement("Select * From " + database.NameForQuery + "sys.all_objects Where Type_Desc = 'VIEW'"), LoadOption.OverwriteChanges);
            database.Views.Clear();
            foreach (DataRow row in views.Rows)
            {
                Entities.MetaDataSchema.View view = new Festo.Common.Entities.MetaDataSchema.View();

                view.ParentDatabase = database;
                view.Schema = row["Table_Schema"].ToString();
                view.Name = row["Table_Name"].ToString();
                DataRow[] sqlRows = sqlServerTable.Select("[name] = '" + view.Name + "'");
                if (sqlRows.Length > 0)
                {
                    view.ViewID = sqlRows[0]["object_id"].ToString();
                }
                //GetColumns(view);
                database.Views.Add(view);
            }
        }

        public override void GetViews(Festo.Common.Entities.MetaDataSchema.Project project)
        {
            foreach (Entities.MetaDataSchema.Database database in project.Databases)
            {
                System.Data.DataTable views = new DataTable();
                System.Data.DataTable sqlServerTable = new DataTable();
                views.Load(database.ParentProject.ExtractorManager.SelectStatement("Select * From " + database.NameForQuery + "INFORMATION_SCHEMA.VIEWS Order By Table_Name"), LoadOption.OverwriteChanges);
                sqlServerTable.Load(database.ParentProject.ExtractorManager.SelectStatement("Select * From " + database.NameForQuery + "sys.all_objects Where Type_Desc = 'VIEW'"), LoadOption.OverwriteChanges);
                OnStartLoading(new Festo.Common.Events.LoadingEventArgs(database.Name, "Views","Database"));
                database.Views.Clear();
                foreach (DataRow row in views.Rows)
                {
                    Entities.MetaDataSchema.View view = new Festo.Common.Entities.MetaDataSchema.View();

                    view.ParentDatabase = database;
                    view.Schema = row["Table_Schema"].ToString();
                    view.Name = row["Table_Name"].ToString();
                    DataRow[] sqlRows = sqlServerTable.Select("[name] = '" + view.Name + "'");
                    if (sqlRows.Length > 0)
                    {
                        view.ViewID = sqlRows[0]["object_id"].ToString();
                    }
                    //GetColumns(view);
                    database.Views.Add(view);
                }
                OnEndLoading(new Festo.Common.Events.LoadingEventArgs(database.Name, "Views","Database"));
                views.Dispose();
            }
            GC.Collect();
        }
        #endregion

        #region Procedures
        public override void GetStoredProcedures(Festo.Common.Entities.MetaDataSchema.Database database)
        {
            System.Data.DataTable procedures = new DataTable();
            System.Data.DataTable sqlServerTable = new DataTable();
            procedures.Load(database.ParentProject.ExtractorManager.SelectStatement("Select * From " + database.NameForQuery + "INFORMATION_SCHEMA.ROUTINES where ROUTINE_TYPE = 'PROCEDURE'"), LoadOption.OverwriteChanges);
            sqlServerTable.Load(database.ParentProject.ExtractorManager.SelectStatement("Select * From " + database.NameForQuery + "sys.all_objects Where [Type] = 'P'"), LoadOption.OverwriteChanges);
            database.StoredProcedures.Clear();
            foreach (DataRow row in procedures.Rows)
            {
                Entities.MetaDataSchema.StoredProcedure storedProcedure = new Festo.Common.Entities.MetaDataSchema.StoredProcedure();

                storedProcedure.ParentDatabase = database;
                storedProcedure.Schema = row["Routine_Schema"].ToString();
                storedProcedure.Name = row["Routine_Name"].ToString();
                DataRow[] sqlRows = sqlServerTable.Select("[name] = '" + storedProcedure.Name + "'");
                if (sqlRows.Length > 0)
                {
                    storedProcedure.StoredProcedureId = sqlRows[0]["object_id"].ToString();
                }
                //GetColumns(view);
                database.StoredProcedures.Add(storedProcedure);
            }
        }

        public override void GetStoredProcedures(Festo.Common.Entities.MetaDataSchema.Project project)
        {
            foreach (Entities.MetaDataSchema.Database database in project.Databases)
            {

                System.Data.DataTable procedures = new DataTable();
                System.Data.DataTable sqlServerTable = new DataTable();
                procedures.Load(database.ParentProject.ExtractorManager.SelectStatement("Select * From " + database.NameForQuery + "INFORMATION_SCHEMA.ROUTINES where ROUTINE_TYPE = 'PROCEDURE'"), LoadOption.OverwriteChanges);
                sqlServerTable.Load(database.ParentProject.ExtractorManager.SelectStatement("Select * From " + database.NameForQuery + "sys.all_objects Where [Type] = 'P'"), LoadOption.OverwriteChanges);
                OnStartLoading(new Festo.Common.Events.LoadingEventArgs(database.Name, "Stored Procedures", "Database"));
                database.StoredProcedures.Clear();
                foreach (DataRow row in procedures.Rows)
                {
                    Entities.MetaDataSchema.StoredProcedure storedProcedure = new Festo.Common.Entities.MetaDataSchema.StoredProcedure();

                    storedProcedure.ParentDatabase = database;
                    storedProcedure.Schema = row["Routine_Schema"].ToString();
                    storedProcedure.Name = row["Routine_Name"].ToString();
                    DataRow[] sqlRows = sqlServerTable.Select("[name] = '" + storedProcedure.Name + "'");
                    if (sqlRows.Length > 0)
                    {
                        storedProcedure.StoredProcedureId = sqlRows[0]["object_id"].ToString();
                    }
                    //GetColumns(view);
                    database.StoredProcedures.Add(storedProcedure);
                }
                OnEndLoading(new Festo.Common.Events.LoadingEventArgs(database.Name, "Stored Procedures", "Database"));
                procedures.Dispose();
            }
            GC.Collect();
        }

        public override void GetStoredProcedureParameters(Common.Entities.MetaDataSchema.StoredProcedure procedure)
        {
            System.Data.DataTable functions = new DataTable();
            string query = "select " + procedure.ParentDatabase.Name + ".sys.all_parameters.*," + procedure.ParentDatabase.Name + ".sys.types.name as typename From " + procedure.ParentDatabase.Name + ".sys.all_parameters inner join " + procedure.ParentDatabase.Name + ".sys.types on " + procedure.ParentDatabase.Name + ".sys.all_parameters.system_type_id = " + procedure.ParentDatabase.Name + ".sys.types.system_type_id and " + procedure.ParentDatabase.Name + ".sys.all_parameters.user_type_id = " + procedure.ParentDatabase.Name + ".sys.types.user_type_id where object_id = " + procedure.StoredProcedureId;
            functions.Load(procedure.ParentDatabase.ParentProject.ExtractorManager.SelectStatement(query), LoadOption.OverwriteChanges);
            OnStartLoading(new Common.Events.LoadingEventArgs(procedure.Name, "Parameters", "Stored Procedures"));
            procedure.Parameters.Clear();
            //GetStoredProcedureParameters(procedure);
            foreach (DataRow row in functions.Rows)
            {
                Entities.MetaDataSchema.Column col = new Common.Entities.MetaDataSchema.Column();
                col.ParentStoredProcedure = procedure;
                col.Name = row["name"].ToString();
                col.OrdinalPosition = Convert.ToInt32(row["parameter_id"]);
                col.Precision = Convert.ToInt32(row["precision"]);
                col.Scale = Convert.ToInt32(row["scale"]);
                col.AllowNull = false;
                col.ColumnDataType.SQLType = row["typename"].ToString();
                if (row["max_length"] != DBNull.Value)
                {
                    col.Length = Convert.ToInt32(row["max_length"]) / 2;
                }
                col.IsIdentity = false;
                col.IsComputed = false;
                col.ColumnId = row["parameter_id"].ToString();
                if (row["is_output"].ToString() == "1" || row["is_output"].ToString() == "True")
                {
                    col.ColumnDirection = ColumnDirection.Output;
                    procedure.Parameters.Add(col);
                }
                else
                {
                    col.ColumnDirection = ColumnDirection.Input;
                    procedure.Parameters.Add(col);
                }
            }

            var schemaResult = SchemaReader(procedure);
            if (schemaResult != null)
            {
                foreach (DataRow row in schemaResult.Rows)
                {
                    Entities.MetaDataSchema.Column col = new Common.Entities.MetaDataSchema.Column();
                    col.ParentStoredProcedure = procedure;
                    col.Name = row["ColumnName"].ToString();
                    col.OrdinalPosition = Convert.ToInt32(row["ColumnOrdinal"]);
                    col.Precision = Convert.ToInt32(row["NumericPrecision"]);
                    col.Scale = Convert.ToInt32(row["NumericScale"]);
                    col.AllowNull = Convert.ToBoolean(row["AllowDBNull"]); ;
                    col.ColumnDataType.SQLType = row["DataTypeName"].ToString();
                    //if (row["max_length"] != DBNull.Value)
                    //{
                    //    col.Length = Convert.ToInt32(row["max_length"]) / 2;
                    //}
                    col.IsIdentity = Convert.ToBoolean(row["IsIdentity"]);
                    col.IsComputed = false;
                    col.ColumnId = Guid.NewGuid().ToString();

                    col.ColumnDirection = ColumnDirection.Output;
                    procedure.ReturnList.Add(col);
                }
            }
            OnEndLoading(new Common.Events.LoadingEventArgs(procedure.Name, "Parameters", "Stored Procedures"));
            GC.Collect();
        }

        public static DataTable SchemaReader(Entities.MetaDataSchema.StoredProcedure procedure)
        {
            try
            {
                string sql = procedure.Schema + "." + procedure.Name;//replace this with your store procedure name    
                var project = procedure.ParentDatabase.ParentProject;
                System.Data.SqlClient.SqlConnection conn = new System.Data.SqlClient.SqlConnection(project.ExtractorManager.ConnectionString);

                conn.Open();
                System.Data.SqlClient.SqlCommand cmd = new System.Data.SqlClient.SqlCommand(sql, conn);
                cmd.CommandType = CommandType.StoredProcedure;
                foreach (var item in procedure.Parameters)
                {
                    cmd.Parameters.Add(new System.Data.SqlClient.SqlParameter(item.Name, DBNull.Value));
                    //System.Data.SqlClient.SqlParameter parameter = new System.Data.SqlClient.SqlParameter(item.Name, SqlDbType.BigInt);
                    //cmd.Parameters.Add(parameter);
                }
                //cmd.Parameters.Add(new System.Data.SqlClient.SqlParameter("@CompanyBranchID", DBNull.Value));
                System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
                DataTable schema = reader.GetSchemaTable();
                reader.Close();
                conn.Close();
                return schema;
            }
            catch (Exception ex)
            {
                return null;
            }

        }
        #endregion

        #region Functions
        public override void GetFunctions(Festo.Common.Entities.MetaDataSchema.Database database)
        {
            System.Data.DataTable functions = new DataTable();
            System.Data.DataTable sqlServerTable = new DataTable();
            functions.Load(database.ParentProject.ExtractorManager.SelectStatement("Select * From " + database.NameForQuery + "INFORMATION_SCHEMA.ROUTINES where ROUTINE_TYPE = 'FUNCTION'"), LoadOption.OverwriteChanges);
            sqlServerTable.Load(database.ParentProject.ExtractorManager.SelectStatement("Select * From " + database.NameForQuery + "sys.all_objects Where [Type] = 'FN'"), LoadOption.OverwriteChanges);
            database.Functions.Clear();
            foreach (DataRow row in functions.Rows)
            {
                Entities.MetaDataSchema.Function function = new Festo.Common.Entities.MetaDataSchema.Function();

                function.ParentDatabase = database;
                function.Schema = row["Routine_Schema"].ToString();
                function.Name = row["Routine_Name"].ToString();
                DataRow[] sqlRows = sqlServerTable.Select("[name] = '" + function.Name + "'");
                if (sqlRows.Length > 0)
                {
                    function.FunctionId = sqlRows[0]["object_id"].ToString();
                }
                //GetColumns(view);
                database.Functions.Add(function);
            }
        }

        public override void GetFunctions(Festo.Common.Entities.MetaDataSchema.Project project)
        {
            foreach (Entities.MetaDataSchema.Database database in project.Databases)
            {

                System.Data.DataTable functions = new DataTable();
                System.Data.DataTable sqlServerTable = new DataTable();
                functions.Load(database.ParentProject.ExtractorManager.SelectStatement("Select * From " + database.NameForQuery + "INFORMATION_SCHEMA.ROUTINES where ROUTINE_TYPE = 'FUNCTION'"), LoadOption.OverwriteChanges);
                sqlServerTable.Load(database.ParentProject.ExtractorManager.SelectStatement("Select * From " + database.NameForQuery + "sys.all_objects Where [Type] = 'FN'"), LoadOption.OverwriteChanges);
                OnStartLoading(new Festo.Common.Events.LoadingEventArgs(database.Name, "Functions","Database"));
                database.Functions.Clear();
                foreach (DataRow row in functions.Rows)
                {
                    Entities.MetaDataSchema.Function function = new Festo.Common.Entities.MetaDataSchema.Function();

                    function.ParentDatabase = database;
                    function.Schema = row["Routine_Schema"].ToString();
                    function.Name = row["Routine_Name"].ToString();
                    DataRow[] sqlRows = sqlServerTable.Select("[name] = '" + function.Name + "'");
                    if (sqlRows.Length > 0)
                    {
                        function.FunctionId = sqlRows[0]["object_id"].ToString();
                    }
                    //GetColumns(view);
                    database.Functions.Add(function);
                }
                OnEndLoading(new Festo.Common.Events.LoadingEventArgs(database.Name, "Functions","Database"));
                functions.Dispose();
            }
            GC.Collect();
        }

        public override void GetFunctionParameters(Festo.Common.Entities.MetaDataSchema.Function function)
        {
            System.Data.DataTable functions = new DataTable();
            string query = "select " + function.ParentDatabase.NameForQuery + "sys.all_parameters.*," + function.ParentDatabase.NameForQuery + "sys.types.name as typename From " + function.ParentDatabase.NameForQuery + "sys.all_parameters inner join " + function.ParentDatabase.NameForQuery + "sys.types on " + function.ParentDatabase.NameForQuery + "sys.all_parameters.system_type_id = " + function.ParentDatabase.NameForQuery + "sys.types.system_type_id and " + function.ParentDatabase.NameForQuery + "sys.all_parameters.user_type_id = " + function.ParentDatabase.NameForQuery + "sys.types.user_type_id where object_id = " + function.FunctionId;
            functions.Load(function.ParentDatabase.ParentProject.ExtractorManager.SelectStatement(query), LoadOption.OverwriteChanges);
            OnStartLoading(new Festo.Common.Events.LoadingEventArgs(function.Name, "Parameters","Function"));
            function.Parameters.Clear();
            
            foreach (DataRow row in functions.Rows)
            {
                Entities.MetaDataSchema.Column col = new Festo.Common.Entities.MetaDataSchema.Column();
                col.ParentFunction = function;
                col.Name = row["name"].ToString();
                col.OrdinalPosition = Convert.ToInt32(row["parameter_id"]);
                col.Precision = Convert.ToInt32(row["precision"]);
                col.Scale = Convert.ToInt32(row["scale"]);
                col.AllowNull = false;
                col.ColumnDataType.SQLType = row["typename"].ToString();
                if (row["max_length"] != DBNull.Value)
                {
                    col.Length = Convert.ToInt32(row["max_length"]) / 2;
                }
                col.IsIdentity = false;
                col.IsComputed = false;
                col.ColumnId = row["parameter_id"].ToString();
                if (row["is_output"].ToString() == "1" || row["is_output"].ToString() == "True")
                {
                    if (col.Name == "")
                        function.ResultType.SQLType = col.ColumnDataType.SQLType;

                    col.ColumnDirection = ColumnDirection.Output;
                    function.Parameters.Add(col);
                }
                else
                {
                    col.ColumnDirection = ColumnDirection.Input;
                    function.Parameters.Add(col);
                }
            }
            OnEndLoading(new Festo.Common.Events.LoadingEventArgs(function.Name, "Parameters","Function"));
            GC.Collect();
        }

        #endregion

        public override void LoadData()
        {
            throw new NotImplementedException();
        }
    }
}
