import { Column } from './../models/datasources/column';
import { DataSourceConnection } from './../models/datasources/data-source-connection';
import { DataSource } from './../models/datasources/data-source';

import { Action } from '@ngrx/store';

export const DATASOURCE_ACTIONS =  {
  LOAD_CONNECTIONS: '[Datasource] Load Connections',
  LOAD_CONNECTIONS_FAIL: '[Datasource] Load Connections Fail',
  LOAD_CONNECTIONS_SUCCESS: '[Datasource] Load Connections Success',
  LOAD_DATASOURCES: '[Datasource] Load Datasources',
  LOAD_DATASOURCES_FAIL: '[Datasource] Load Datasources Fail',
  LOAD_DATASOURCES_SUCCESS: '[Datasource] Load Datasources Success',
  LOAD_DATASOURCE_COLUMNS: '[Datasource] Load Datasources Columns',
  LOAD_DATASOURCE_COLUMNS_FAIL: '[Datasource] Load Datasource Columns Fail',
  LOAD_DATASOURCE_COLUMNS_SUCCESS: '[Datasource] Load Datasource Columns Success',
  LOAD_DATASOURCE_DATA: '[Datasource] Load Datasource Data',
  LOAD_DATASOURCE_DATA_FAIL: '[Datasource] Load Datasource Data Fail',
  LOAD_DATASOURCE_DATA_SUCCESS: '[Datasource] Load Datasource Data Success',
  SELECT_CONNECTION: '[Datasource] Select Connection',
  SELECT_DATASOURCE: '[Datasource] Select Datasource'
};

/*************** Load Connections Action ***************** */
export class LoadConnectionsAction implements Action {
  readonly type = DATASOURCE_ACTIONS.LOAD_CONNECTIONS;

  constructor(public payload?: any) { }
}

export class LoadConnectionsSuccessAction implements Action {
  readonly type = DATASOURCE_ACTIONS.LOAD_CONNECTIONS_SUCCESS;

  constructor(public payload: DataSourceConnection[]) { }
}

export class LoadConnectionsFailAction implements Action {
  readonly type = DATASOURCE_ACTIONS.LOAD_CONNECTIONS_FAIL;

  constructor(public payload?: any) { }
}

/*************** Load DataSource Action ***************** */
export class LoadDataSourcesAction implements Action {
  readonly type = DATASOURCE_ACTIONS.LOAD_DATASOURCES;

  constructor(public payload?: string) { }
}

export class LoadDataSourcesSuccessAction implements Action {
  readonly type = DATASOURCE_ACTIONS.LOAD_DATASOURCES_SUCCESS;

  constructor(public payload: { datasources: DataSource[], id: string }) { }
}

export class LoadDataSourcesFailAction implements Action {
  readonly type = DATASOURCE_ACTIONS.LOAD_DATASOURCES_FAIL;

  constructor(public payload?: any) { }
}

/*************** Load Data Source Columns Action ***************** */
export class LoadDataSourceColumnsAction implements Action {
  readonly type = DATASOURCE_ACTIONS.LOAD_DATASOURCE_COLUMNS;

  constructor(public payload?: {sources: DataSource[], id: string}) { }
}

export class LoadDataSourceColumnsSuccessAction implements Action {
  readonly type = DATASOURCE_ACTIONS.LOAD_DATASOURCE_COLUMNS_SUCCESS;

  constructor(public payload: {columns: Column[], id: string }) { }
}

export class LoadDataSourceColumnsFailAction implements Action {
  readonly type = DATASOURCE_ACTIONS.LOAD_DATASOURCE_COLUMNS_FAIL;

  constructor(public payload?: any) { }
}

/*************** Select Data Source Action ***************** */
export class SelectDataSourceAction implements Action {
  readonly type = DATASOURCE_ACTIONS.SELECT_DATASOURCE;

  constructor(public payload: {connectionId: string, dataSourceId: string[], selected: boolean}) { }
}
/*************** Load Data Source Columns Action ***************** */
export class LoadDataSourceDataAction implements Action {
  readonly type = DATASOURCE_ACTIONS.LOAD_DATASOURCE_DATA;

  constructor(public payload?: {source: DataSource}) { }
}

export class LoadDataSourceDataSuccessAction implements Action {
  readonly type = DATASOURCE_ACTIONS.LOAD_DATASOURCE_DATA_SUCCESS;

  constructor(public payload: {data: any[], source: DataSource }) { }
}

export class LoadDataSourceDataFailAction implements Action {
  readonly type = DATASOURCE_ACTIONS.LOAD_DATASOURCE_DATA_FAIL;

  constructor(public payload?: any) { }
}
export type Actions =
LoadConnectionsAction | LoadConnectionsSuccessAction | LoadConnectionsFailAction |
LoadDataSourcesAction | LoadDataSourcesSuccessAction | LoadDataSourcesFailAction |
LoadDataSourceColumnsAction | LoadDataSourceColumnsSuccessAction | LoadDataSourceColumnsFailAction |
SelectDataSourceAction | LoadDataSourceDataAction | LoadDataSourceDataSuccessAction | LoadDataSourceDataFailAction;
