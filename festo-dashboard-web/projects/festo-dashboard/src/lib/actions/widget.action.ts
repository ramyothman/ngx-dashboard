import { DataSource } from './../models/datasources/data-source';
import { Widget } from './../models/widget';
import { Action } from '@ngrx/store';

export const WIDGET_ACTIONS =  {
  LOAD_WIDGETS: '[Widgets] Load Widgets',
  LOAD_WIDGETS_FAIL: '[Widgets] Load Widgets Fail',
  LOAD_WIDGETS_SUCCESS: '[Widgets] Load Widgets Success',
  FLIP_WIDGET: '[WIDGET] Flip Widget',
  UPDATE_LOCATION: '[WIDGET] Update Location',
  ADD_WIDGET: '[WIDGET] Add Widget',
  REMOVE_WIDGET: '[WIDGET] Remove Widget',
  SELECT_WIDGET: '[WIDGET] Select Widget',
  UN_SELECT_WIDGET: '[WIDGET] Unselect Widget',
  UN_SELECT_WIDGETS: '[WIDGET] Unselect Widgets',
  EDIT_WIDGET: '[WIDGET] Start or End Widget Edit',
  UPDATE_WIDGET: '[WIDGET] Update Widget',
  PROCESS_DATA: '[WIDGET] Process Data',
  PROCESS_DATA_SUCCESS: '[WIDGET] Process Data Success',
  PROCESS_DATA_Fail: '[WIDGET] Process Data Fail',
  UPDATE_DATASOURCE: '[WIDGET] Update Datasource'
};


export class FlipWidgetAction implements Action {
  readonly type = WIDGET_ACTIONS.FLIP_WIDGET;

  constructor(public payload?: {id: string, flipped: boolean}) { }
}

export class LoadWidgetsAction implements Action {
  readonly type = WIDGET_ACTIONS.LOAD_WIDGETS;

  constructor(public payload?: string) { }
}

export class LoadWidgetsSuccessAction implements Action {
  readonly type = WIDGET_ACTIONS.LOAD_WIDGETS_SUCCESS;

  constructor(public payload: Widget[]) { }
}

export class LoadWidgetsFailAction implements Action {
  readonly type = WIDGET_ACTIONS.LOAD_WIDGETS_FAIL;

  constructor(public payload?: any) { }
}

export class UpdateLocationAction implements Action {
  readonly type = WIDGET_ACTIONS.UPDATE_LOCATION;

  constructor(public payload?: {id: string, location: any}) { }
}

export class AddWidgetAction implements Action {
  readonly type = WIDGET_ACTIONS.ADD_WIDGET;

  constructor(public payload?: {widget: Widget}) { }
}

export class RemoveWidgetAction implements Action {
  readonly type = WIDGET_ACTIONS.REMOVE_WIDGET;
  // widget id as payload
  constructor(public payload?: string) { }
}

export class SelectWidgetAction implements Action {
  readonly type = WIDGET_ACTIONS.SELECT_WIDGET;
  // widget id as payload
  constructor(public payload?: string) { }
}

export class UnSelectWidgetAction implements Action {
  readonly type = WIDGET_ACTIONS.UN_SELECT_WIDGET;
  // widget id as payload
  constructor(public payload?: string) { }
}

export class UnSelectWidgetsAction implements Action {
  readonly type = WIDGET_ACTIONS.SELECT_WIDGET;
  // widget id as payload
  constructor() { }
}

export class EditWidgetAction implements Action {
  readonly type = WIDGET_ACTIONS.EDIT_WIDGET;

  constructor(public payload?: {id: string, editing: boolean}) { }
}

export class UpdateWidgetAction implements Action {
  readonly type = WIDGET_ACTIONS.UPDATE_WIDGET;

  constructor(public payload?: {widget: Widget}) { }
}

export class ProcessDataAction implements Action {
  readonly type = WIDGET_ACTIONS.PROCESS_DATA;

  constructor(public payload?: {id: string, data: any[]}) { }
}

export class ProcessDataSuccessAction implements Action {
  readonly type = WIDGET_ACTIONS.PROCESS_DATA_SUCCESS;

  constructor(public payload: {id: string, data: any[]}) { }
}

export class ProcessDataFailAction implements Action {
  readonly type = WIDGET_ACTIONS.PROCESS_DATA_Fail;

  constructor(public payload?: any) { }
}

export class UpdateDataSourceAction implements Action {
  readonly type = WIDGET_ACTIONS.UPDATE_DATASOURCE;

  constructor(public payload?: {id: string, source: DataSource}) { }
}



export type Actions =
FlipWidgetAction | LoadWidgetsSuccessAction | LoadWidgetsFailAction |
UpdateLocationAction | AddWidgetAction | RemoveWidgetAction |
SelectWidgetAction | UnSelectWidgetsAction | EditWidgetAction |
UpdateWidgetAction | ProcessDataAction | UpdateDataSourceAction |
ProcessDataSuccessAction | ProcessDataFailAction;
