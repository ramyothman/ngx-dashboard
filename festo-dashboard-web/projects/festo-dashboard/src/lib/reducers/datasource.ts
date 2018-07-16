import { plainToClassFromExist, plainToClass } from 'class-transformer';
import { DataSourceConnection } from './../models/datasources/data-source-connection';
import { DataSource } from './../models/datasources/data-source';
import { Column } from './../models/datasources/column';
import { ApiCountResponse } from './../services/models/api-count-response';
import { ApiPaginateResponse } from './../services/models/api-paginate-response';
import { createSelector, createFeatureSelector } from '@ngrx/store';

import * as fromRoot from './index';
import * as dataSourceActions from './../actions/datasource.action';
import { DATASOURCE_ACTIONS } from './../actions/datasource.action';

export interface DataSourceConnectionState {
  loading: boolean;
  connectionStates: DataSourceConnection[];
  selected: DataSourceConnection[];
  allSelected: boolean;
}


export const initialState: DataSourceConnectionState = {
  loading: false,
  connectionStates: [],
  selected: [],
  allSelected: false
};


export function reducer(state = initialState, action: dataSourceActions.Actions): DataSourceConnectionState {
  switch (action.type) {
    case DATASOURCE_ACTIONS.LOAD_CONNECTIONS:
      return loadConnectionsReducer(state, action as dataSourceActions.LoadConnectionsAction);
    case DATASOURCE_ACTIONS.LOAD_CONNECTIONS_SUCCESS:
      return loadConnectionsSuccessReducer(state, action as dataSourceActions.LoadConnectionsSuccessAction);
    case DATASOURCE_ACTIONS.LOAD_CONNECTIONS_FAIL:
      return loadConnectionsFailReducer(state, action as dataSourceActions.LoadConnectionsFailAction);
    case DATASOURCE_ACTIONS.LOAD_DATASOURCES:
      return loadDataSourcesReducer(state, action as dataSourceActions.LoadDataSourcesAction);
    case DATASOURCE_ACTIONS.LOAD_DATASOURCES_SUCCESS:
      return loadDataSourcesSuccessReducer(state, action as dataSourceActions.LoadDataSourcesSuccessAction);
    case DATASOURCE_ACTIONS.LOAD_DATASOURCES_FAIL:
      return loadDataSourcesFailReducer(state, action as dataSourceActions.LoadDataSourcesFailAction);
    case DATASOURCE_ACTIONS.SELECT_DATASOURCE:
      return selectDataSourceReducer(state, action as dataSourceActions.SelectDataSourceAction);
    case DATASOURCE_ACTIONS.LOAD_DATASOURCE_COLUMNS:
      return loadDataSourceColumnsReducer(state, action as dataSourceActions.LoadDataSourceColumnsAction);
    case DATASOURCE_ACTIONS.LOAD_DATASOURCE_COLUMNS_SUCCESS:
      return loadDataSourceColumnsSuccessReducer(state, action as dataSourceActions.LoadDataSourceColumnsSuccessAction);
    case DATASOURCE_ACTIONS.LOAD_DATASOURCE_COLUMNS_FAIL:
      return loadDataSourceColumnsFailReducer(state, action as dataSourceActions.LoadDataSourceColumnsFailAction);
    case DATASOURCE_ACTIONS.LOAD_DATASOURCE_DATA:
      return loadDataSourceDataReducer(state, action as dataSourceActions.LoadDataSourceDataAction);
    case DATASOURCE_ACTIONS.LOAD_DATASOURCE_DATA_SUCCESS:
      return loadDataSourceDataSuccessReducer(state, action as dataSourceActions.LoadDataSourceDataSuccessAction);
    case DATASOURCE_ACTIONS.LOAD_DATASOURCE_DATA_FAIL:
      return loadDataSourceDataFailReducer(state, action as dataSourceActions.LoadDataSourceDataFailAction);
    default:
      return state;
  }
}

/******************* LoadConnectionsReducer ************************* */

function loadConnectionsReducer(
  state: DataSourceConnectionState,
  action: dataSourceActions.LoadConnectionsAction
): DataSourceConnectionState {
  return {
    ...state,
    loading: true,
  };
}

function loadConnectionsFailReducer(
  state: DataSourceConnectionState,
  action: dataSourceActions.LoadConnectionsFailAction
): DataSourceConnectionState {
  return {
    ...state,
    loading: false,
  };
}

function loadConnectionsSuccessReducer(
  state: DataSourceConnectionState,
  action: dataSourceActions.LoadConnectionsSuccessAction
): DataSourceConnectionState {
  return {
    loading: false,
    connectionStates: action.payload,
    selected: state.selected,
    allSelected: false
  };
}

/******************* LoadDataSourcesReducer ************************* */
function loadDataSourcesReducer(
  state: DataSourceConnectionState,
  action: dataSourceActions.LoadDataSourcesAction
): DataSourceConnectionState {
  return {
    ...state,
    loading: true,
  };
}

function loadDataSourcesFailReducer(
  state: DataSourceConnectionState,
  action: dataSourceActions.LoadDataSourcesFailAction
): DataSourceConnectionState {
  return {
    ...state,
    loading: false,
  };
}

function loadDataSourcesSuccessReducer(
  state: DataSourceConnectionState,
  action: dataSourceActions.LoadDataSourcesSuccessAction
): DataSourceConnectionState {
  const index = state.connectionStates.findIndex(w => w.id === action.payload.id);
  if (index <= -1) {
    return state;
  }

  const connection = { ...state.connectionStates[index], dataSources: action.payload.datasources };

  const connectionStates = [
    ...state.connectionStates.slice(0, index),
    connection,
    ...state.connectionStates.slice(index + 1)
  ];

  return {
    loading: false,
    connectionStates: connectionStates,
    selected: { ...state.selected },
    allSelected: state.allSelected
  };
}

function selectDataSourceReducer(
  state: DataSourceConnectionState,
  action: dataSourceActions.SelectDataSourceAction
): DataSourceConnectionState {
  const index = state.connectionStates.findIndex(w => w.id === action.payload.connectionId);
  if (index <= -1) {
    return state;
  }

  const dataSources = state.connectionStates[index].dataSources.map((w, i) => {
    let found = false;
    for (const id of action.payload.dataSourceId) {
      if (w.id === id) {
        found = true;
        break;
      }
    }
    return { ...w, selected: found };
  });

  const connection = { ...state.connectionStates[index], dataSources:  dataSources, selected: true};
  const selected = { ...state.selected, connection};
  const connectionStates = [
    ...state.connectionStates.slice(0, index),
    connection,
    ...state.connectionStates.slice(index + 1)
  ];
  return {
    ...state,
    connectionStates: connectionStates,
    selected: selected
  };
}


/******************* LoadDataSources Columns Reducer ************************* */
function loadDataSourceColumnsReducer(
  state: DataSourceConnectionState,
  action: dataSourceActions.LoadDataSourceColumnsAction
): DataSourceConnectionState {
  return {
    ...state,
    loading: true,
  };
}

function loadDataSourceColumnsFailReducer(
  state: DataSourceConnectionState,
  action: dataSourceActions.LoadDataSourceColumnsFailAction
): DataSourceConnectionState {
  return {
    ...state,
    loading: false,
  };
}

function loadDataSourceColumnsSuccessReducer(
  state: DataSourceConnectionState,
  action: dataSourceActions.LoadDataSourceColumnsSuccessAction
): DataSourceConnectionState {
  const index = state.connectionStates.findIndex(w => w.id === action.payload.id);
  if (index <= -1) {
    return state;
  }

  const dataSources = state.connectionStates[index].dataSources.map((w, i) => {
    if (w.selected) {
      const columns = action.payload.columns.filter(it => it['parentId'].indexOf(w.sourceId) !== -1);
      return { ...w, columns: columns };
    }
    return { ...w };
  });

  const connection = { ...state.connectionStates[index],
    dataSources: dataSources
  };

  const connectionStates = [
    ...state.connectionStates.slice(0, index),
    connection,
    ...state.connectionStates.slice(index + 1)
  ];

  return {
    loading: false,
    connectionStates: connectionStates,
    selected: { ...state.selected },
    allSelected: state.allSelected
  };
}


/******************* LoadDataSources Data Reducer ************************* */
function loadDataSourceDataReducer(
  state: DataSourceConnectionState,
  action: dataSourceActions.LoadDataSourceDataAction
): DataSourceConnectionState {
  return {
    ...state,
    loading: true,
  };
}

function loadDataSourceDataFailReducer(
  state: DataSourceConnectionState,
  action: dataSourceActions.LoadDataSourceDataFailAction
): DataSourceConnectionState {
  return {
    ...state,
    loading: false,
  };
}

function loadDataSourceDataSuccessReducer(
  state: DataSourceConnectionState,
  action: dataSourceActions.LoadDataSourceDataSuccessAction
): DataSourceConnectionState {
  const index = state.connectionStates.findIndex(w => w.id === action.payload.source.connectionId);
  if (index <= -1) {
    return state;
  }

  const dataSourceIndex = state.connectionStates[index].dataSources.findIndex(w => w.id === action.payload.source.id);
  if (dataSourceIndex <= -1) {
    return state;
  }
  const dataSource = {...state.connectionStates[index].dataSources[dataSourceIndex], data: action.payload.data };

  const dataSources = [
    ...state.connectionStates[index].dataSources.slice(0, dataSourceIndex),
    dataSource,
    ...state.connectionStates[index].dataSources.slice(dataSourceIndex + 1)
  ];

  const connection = { ...state.connectionStates[index],
    dataSources: dataSources
  };

  const connectionStates = [
    ...state.connectionStates.slice(0, index),
    connection,
    ...state.connectionStates.slice(index + 1)
  ];

  return {
    loading: false,
    connectionStates: connectionStates,
    selected: { ...state.selected },
    allSelected: state.allSelected
  };
}
export const getDataSourceConnectionState = createFeatureSelector<DataSourceConnectionState>('datasource');
export const getConnections = createSelector(getDataSourceConnectionState, (state: DataSourceConnectionState) => state.connectionStates);
