using System;
using System.Collections.Generic;
using System.Text;
using Ngx.Common.Entities.MetaDataSchema;

namespace Ngx.Common.MetaDataExtraction.DatabaseExtractors
{
    public abstract class DatabaseExtractor 
    {
        public abstract void GetDatabases(Project project);
        public abstract void GetDatabasesBySql(Project project);
        public abstract void GetTables(Database database);
        public abstract void GetTables(Project project);
        public abstract void GetColumns(Table table);
        public abstract void GetColumns(View view);
        public abstract void GetColumns(Database database);
        public abstract void GetParentRelations(Table table);
        public abstract void GetChildRelations(Table table);
        public abstract void GetTableRelations(Table table);
        public abstract void GetTableRelations(Project project);
        public abstract void GetViews(Database database);
        public abstract void GetViews(Project project);
        public abstract void GetStoredProcedures(Database database);
        public abstract void GetStoredProcedures(Project project);

        public abstract void GetFunctions(Database database);
        public abstract void GetFunctions(Project project);

        public abstract void GetFunctionParameters(Function function);
        public abstract void GetStoredProcedureParameters(StoredProcedure procedure);
        public abstract void LoadData();

        public delegate void StartLoadingEventHandler(object sender,Events.LoadingEventArgs e);
        public delegate void EndLoadingEventHandler(object sender, Events.LoadingEventArgs e);


        public event StartLoadingEventHandler StartLoading;
        public event EndLoadingEventHandler EndLoading;

        protected virtual void OnStartLoading(Events.LoadingEventArgs e)
        {
            if (StartLoading != null)
            {
                //Invokes the delegates.
                StartLoading(this, e);
            }
        }

        protected virtual void OnEndLoading(Events.LoadingEventArgs e)
        {
            if (EndLoading != null)
            {
                //Invokes the delegates.
                EndLoading(this, e);
            }
        }
    }
}
