import { Dashboard } from './../models/dashboard';
import { ApiCountResponse } from './../services/models/api-count-response';
import { ApiPaginateResponse } from './../services/models/api-paginate-response';
import { createSelector, createFeatureSelector } from '@ngrx/store';

import * as fromRoot from './index';
import * as dashboardActions from './../actions/dashboard.action';
import { DASHBOARD_ACTIONS } from './../actions/dashboard.action';

export interface DashboardState {
  loading: boolean;
  dashboardStates: Dashboard[];
  selected: { [id: string]: boolean };
  allSelected: boolean;
  orderBy: string;
  orderAscending: boolean;
}


export const initialState: DashboardState = {
  loading: false,
  dashboardStates: [],
  selected: { },
  allSelected: false,
  orderBy: 'title',
  orderAscending: true
};


export function reducer(state = initialState, action: dashboardActions.Actions): DashboardState {
  switch (action.type) {
    case DASHBOARD_ACTIONS.LOAD_DASHBOARDS:
      return loadDashboardReducer(state, action as dashboardActions.LoadDashboardsAction);
    case DASHBOARD_ACTIONS.LOAD_DASHBOARDS_SUCCESS:
      return loadDashboardSuccessReducer(state, action as dashboardActions.LoadSuccessDashboardsAction);
    case DASHBOARD_ACTIONS.LOAD_DASHBOARDS_FAIL:
      return loadDashboardFailReducer(state, action as dashboardActions.LoadFailDashboardsAction);
    default:
      return state;
  }
}

function loadDashboardReducer(state: DashboardState, action: dashboardActions.LoadDashboardsAction): DashboardState {
  return {
    ...state,
    loading: true,
  };
}

function loadDashboardFailReducer(state: DashboardState, action: dashboardActions.LoadFailDashboardsAction): DashboardState {
  return {
    ...state,
    loading: false,
  };
}

function loadDashboardSuccessReducer(state: DashboardState, action: dashboardActions.LoadSuccessDashboardsAction): DashboardState {
  return {
    loading: false,
    dashboardStates: action.payload,
    selected: { },
    allSelected: false,
    orderBy: 'title',
    orderAscending: true
  };
}
