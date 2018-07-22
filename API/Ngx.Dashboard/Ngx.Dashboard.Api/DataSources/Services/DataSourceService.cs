using Ngx.Common.Entities.MetaDataSchema;
using Ngx.Dashboard.Api.DataSources.Model;
using Ngx.Dashboard.Api.DataSources.Model.Request;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;
using Column = Ngx.Dashboard.Api.DataSources.Model.Column;

namespace Ngx.Dashboard.Api.DataSources.Services
{
    public class DataSourceService
    {
        private IHostingEnvironment _hostingEnvironment;
        /// <summary>
        /// sample connections simulating database references
        /// </summary>
        public string[] connections = {
            @"Data Source=212.227.198.182,56221\SQL2016;Initial Catalog=PamsZeroAbdo3;Persist Security Info=True;User ID=sa;Password=Pams@Sh0tec;Max Pool Size=32767;",
            @"Data Source=212.227.198.182,56221\SQL2016;Initial Catalog=PamsZeroAbdo3;Persist Security Info=True;User ID=sa;Password=Pams@Sh0tec;Max Pool Size=32767;" };
            
        public DataSourceService(IHostingEnvironment host)
        {
            _hostingEnvironment = host;
        }

        public async Task<List<DataSourceConnection>> GetConnectionsAsync(DataSources.Model.Request.DataSourceConnectionRequest request)
        {
            List<DataSourceConnection> result = new List<DataSourceConnection>();
            result.Add(new DataSourceConnection("0", "Smartenance Dev 1"));
            result.Add(new DataSourceConnection("1", "Smartenance Dev 2"));
            return result;
        }

        public Project GetProject(string idStr)
        {
            Project project = new Project();
            string path = string.Format("{0}\\App_Data\\DataTypesMapper.xml", _hostingEnvironment.ContentRootPath);
            DataType.LoadHashTables(path);
            // TODO: change this to come from database
            /*------------- start just for testing --------------*/
            int id = Convert.ToInt32(idStr);
            if (id > connections.Length)
                return null;
            string connString = connections[id];
            project.Connect(connString);

            /*------------- end just for testing --------------*/
            string[] tokens = connString.Split(';');
            string databaseName = "";
            foreach (var str in tokens)
            {
                if (str.Contains("Initial Catalog"))
                {
                    databaseName = str.Replace("Initial Catalog=", "");
                    databaseName = databaseName.Replace("Initial Catalog =", "");
                    databaseName = databaseName.Replace("Initial Catalog = ", "");
                }
            }
            if (string.IsNullOrEmpty(databaseName))
            {
                return null;
            }
            try
            {
                // project.ExtractorManager.DatabaseReaders.GetDatabasesBySql(project);
                Database db = new Database();
                db.Name = databaseName;
                db.Parent = project;
                db.NameForQuery = "";
                db.EntitySelected = true;
                project.Databases.Add(db);
            }
            catch (Exception ex)
            {
                return null;
            }

            return project;
        }

        public async Task<List<DataSource>> GetDataSourcesAsync(DataSourcesRequest request)
        {
       
            Project project = GetProject(request.Id);
            if(project == null)
                return new List<DataSource>();
            try
            {
                if(project.Databases == null || project.Databases.Count == 0)
                    return new List<DataSource>();
                var db = project.Databases[0];
                List<DataSource> dataSources = new List<DataSource>();
                #region Tables
                project.ExtractorManager.DatabaseReaders.GetTables(db);
                foreach (var table in db.Tables)
                {
                    DataSource source = new DataSource
                    {
                        Id = table.Id,
                        ConnectionId =  request.Id,
                        Name = table.Name,
                        Schema = table.Schema,
                        SourceId = table.TableID,
                        SourceType = "table",
                        Namespace = table.NameSpace
                    };
                    dataSources.Add(source);
                }
                #endregion

                #region Views
                project.ExtractorManager.DatabaseReaders.GetViews(db);
                foreach (var view in db.Views)
                {
                    DataSource source = new DataSource
                    {
                        Id = view.Id,
                        ConnectionId = request.Id,
                        Name = view.Name,
                        Schema = view.Schema,
                        SourceId = view.ViewID,
                        SourceType = "view"
                    };
                    dataSources.Add(source);
                }
                #endregion

                #region Stored Procedures
                project.ExtractorManager.DatabaseReaders.GetStoredProcedures(db);
                foreach (var sp in db.StoredProcedures)
                {
                    DataSource source = new DataSource
                    {
                        Id = sp.Id,
                        ConnectionId = request.Id,
                        Name = sp.Name,
                        Schema = sp.Schema,
                        SourceId = sp.StoredProcedureId,
                        SourceType = "procedure"
                    };
                    dataSources.Add(source);
                }
                #endregion
                return dataSources;
            }
            catch (Exception ex)
            {

            }

            return new List<DataSource>();
        }

        public async Task<List<Model.Column>> GetColumnsAsync(ColumnsRequest request)
        {
            List<Model.Column> columns = new List<Model.Column>();
            Project project = GetProject(request.Id);
            if (project == null)
                return new List<Column>();
            try
            {
                if (project.Databases == null || project.Databases.Count == 0)
                    return new List<Column>();
                var db = project.Databases[0];
                
                foreach (var source in request.Sources)
                {
                    List<Ngx.Common.Entities.MetaDataSchema.Column> columnSchema = null;
                    switch (source.SourceType)
                    {
                        case "table":
                            Common.Entities.MetaDataSchema.Table table = new Table
                            {
                                Id = source.Id,
                                Name = source.Name,
                                Schema = source.Schema,
                                Parent = db,
                                TableID = source.SourceId
                            };
                            db.Tables.Add(table);
                            project.ExtractorManager.DatabaseReaders.GetColumns(table);
                            columnSchema = table.Columns;
                            break;
                        case "view":
                            Common.Entities.MetaDataSchema.View view = new View
                            {
                                Id = source.Id,
                                Name = source.Name,
                                Schema = source.Schema,
                                Parent = db,
                                ViewID = source.SourceId
                            };
                            db.Views.Add(view);
                            project.ExtractorManager.DatabaseReaders.GetColumns(view);
                            columnSchema = view.Columns;
                            break;
                        case "procedure":
                            Common.Entities.MetaDataSchema.StoredProcedure sp = new StoredProcedure
                            {
                                Id = source.Id,
                                Name = source.Name,
                                Schema = source.Schema,
                                Parent = db,
                                StoredProcedureId = source.SourceId
                            };
                            db.StoredProcedures.Add(sp);
                            project.ExtractorManager.DatabaseReaders.GetStoredProcedureParameters(sp);
                            columnSchema = sp.ReturnList;
                            break;
                    }

                    if (columnSchema == null) continue;
                    foreach (var column in columnSchema)
                    {
                        Column cdata = new Column
                        {
                            Name = column.Name,
                            AllowNull = column.AllowNull,
                            DataType = column.ColumnDataType.LanguageSpecificType,
                            FullName = column.ColumnFullName,
                            Id = column.Id,
                            IsComputed = column.IsComputed,
                            IsForeign = column.IsForeign,
                            IsIdentity = column.IsIdentity,
                            IsPrimary = column.IsPrimary,
                            ObjectId = column.ColumnId,
                            ParentId =  source.SourceId,
                            Header = DataSourceService.SplitCamelCase(column.Name)
                        };
                        columns.Add(cdata);
                    }

                }
                return columns;

            }
            catch (Exception ex)
            {

            }
            return new List<Column>();

        }

        public async Task<List<Dictionary<string, object>>> GetSourceData(DataRequest parameter)
        {
            if (parameter.Source == null)
                return null;
            /*------------- start just for testing --------------*/
            int id = Convert.ToInt32(parameter.Source.ConnectionId);
            if (id > connections.Length)
                return null;
            string connString = connections[id];
            /*------------- end just for testing --------------*/
            string queryString = "";
            queryString = string.Format(parameter.Source.SourceType != "procedure" ? "select * from {0}.{1}" : "{0}.{1}", parameter.Source.Schema, parameter.Source.Name);

            using (SqlConnection connection =
                new SqlConnection(connString))
            {
                // Create the Command and Parameter objects.
                if (parameter.Source.SourceType != "procedure")
                {
                    string paramsString = "";
                    foreach (var par in parameter.Source.Parameters)
                    {
                        if (paramsString.Length > 0)
                            paramsString += " and ";
                        paramsString += string.Format(" {0} {1}", par.Name, par.ParameterValue);
                    }

                    if (!string.IsNullOrEmpty(paramsString))
                    {
                        queryString += " where " + paramsString;
                    }
                }
                SqlCommand command = new SqlCommand(queryString, connection);
                if (parameter.Source.SourceType == "procedure")
                {
                    command.CommandType = CommandType.StoredProcedure;
                    foreach (var par in parameter.Source.Parameters)
                    {
                        command.Parameters.Add(new SqlParameter(par.Name, par.ParameterValue));
                    }
                }

                try
                {
                    connection.Open();
                    SqlDataReader reader = await command.ExecuteReaderAsync();

                    var dt = new System.Data.DataTable();
                    dt.Load(reader);
                    DataRow[] result = dt.Select();
                    reader.Close();
                    List<Dictionary<string, object>> rows = new List<Dictionary<string, object>>();
                    Dictionary<string, object> row;
                    foreach (DataRow dr in dt.Rows)
                    {
                        row = new Dictionary<string, object>();
                        foreach (DataColumn col in dt.Columns)
                        {
                            row.Add(col.ColumnName, dr[col]);
                        }

                        rows.Add(row);
                    }

                    return rows;
                }
                catch (Exception ex)
                {
                    connection.Close();
                }
            }

            return null;
        }

        public static string SplitCamelCase(string input)
        {
            return System.Text.RegularExpressions.Regex.Replace(input, "([A-Z])", " $1", System.Text.RegularExpressions.RegexOptions.Compiled).Trim();
        }

    }
}
