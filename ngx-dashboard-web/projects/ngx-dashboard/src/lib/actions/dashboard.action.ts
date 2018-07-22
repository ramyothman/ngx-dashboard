import { Dashboard } from './../models/dashboard';
import { Action } from '@ngrx/store';

export const DASHBOARD_ACTIONS =  {
  LOAD_DASHBOARDS: '[Dashboard] Load Dashboards',
  LOAD_DASHBOARDS_FAIL: '[Dashboard] Load Dashboards Fail',
  LOAD_DASHBOARDS_SUCCESS: '[Dashboard] Load Dashboards Success',
  DELETE_DASHBOARDS: '[Dashboard] Delete Dashboards',
  DELETE_DASHBOARDS_FAIL: '[Dashboard] Delete Dashboards Fail',
  DELETE_DASHBOARDS_SUCCESS: '[Dashboard] Delete Dashboards Success',
  CREATE_DASHBOARD: '[Dashboard] Create Dashboard',
  CREATE_DASHBOARD_FAIL: '[Dashboard] Create Dashboard Fail',
  CREATE_DASHBOARD_SUCCESS: '[Dashboard] Create Dashboard Success',
  EDIT_DASHBOARD: '[Dashboard] Edit Dashboard',
  EDIT_DASHBOARD_FAIL: '[Dashboard] Edit Dashboard Fail',
  EDIT_DASHBOARD_SUCCESS: '[Dashboard] Edit Dashboard Success',
  VIEW_DASHBOARD: '[Dashboard] Edit Dashboard',
  VIEW_DASHBOARD_FAIL: '[Dashboard] Edit Dashboard Fail',
  VIEW_DASHBOARD_SUCCESS: '[Dashboard] Edit Dashboard Success'
};

export class LoadDashboardsAction implements Action {
  readonly type = DASHBOARD_ACTIONS.LOAD_DASHBOARDS;

  constructor(public payload?: any) { }
}

export class LoadSuccessDashboardsAction implements Action {
  readonly type = DASHBOARD_ACTIONS.LOAD_DASHBOARDS_SUCCESS;

  constructor(public payload: Dashboard[]) { }
}

export class LoadFailDashboardsAction implements Action {
  readonly type = DASHBOARD_ACTIONS.LOAD_DASHBOARDS_FAIL;

  constructor(public payload?: any) { }
}



export type Actions =
LoadDashboardsAction | LoadSuccessDashboardsAction | LoadFailDashboardsAction;
