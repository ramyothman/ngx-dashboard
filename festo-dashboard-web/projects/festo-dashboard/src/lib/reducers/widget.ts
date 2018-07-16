import { WidgetState } from './widget';
import { GridStackItem } from 'ng4-gridstack';
import { Widget } from './../models/widget';
import * as widgetActions from './../actions/widget.action';
import { WIDGET_ACTIONS, UpdateLocationAction, UnSelectWidgetsAction } from './../actions/widget.action';
import {
  createSelector,
  createFeatureSelector
} from '@ngrx/store';

export interface WidgetState {
  loading: boolean;
  editing: boolean;
  widgetState: Widget[];
  selectedWidget: Widget;
}

export const initialState: WidgetState = {
  loading: false,
  editing: false,
  widgetState: [],
  selectedWidget: null
};

export function reducer(state = initialState, action: widgetActions.Actions): WidgetState {
  switch (action.type) {
    case WIDGET_ACTIONS.LOAD_WIDGETS:
      return loadWidgetsReducer(state, action as widgetActions.LoadWidgetsAction);
    case WIDGET_ACTIONS.LOAD_WIDGETS_SUCCESS:
      return loadWidgetsSuccessReducer(state, action as widgetActions.LoadWidgetsSuccessAction);
    case WIDGET_ACTIONS.LOAD_WIDGETS_FAIL:
      return loadWidgetsFailReducer(state, action as widgetActions.LoadWidgetsFailAction);
    case WIDGET_ACTIONS.FLIP_WIDGET:
      return flipWidgetReducer(state, action as widgetActions.FlipWidgetAction);
    case WIDGET_ACTIONS.UPDATE_LOCATION:
      return updateLocationReducer(state, action as widgetActions.UpdateLocationAction);
    case WIDGET_ACTIONS.ADD_WIDGET:
      return addWidgetReducer(state, action as widgetActions.AddWidgetAction);
    case WIDGET_ACTIONS.REMOVE_WIDGET:
      return removeWidgetReducer(state, action as widgetActions.RemoveWidgetAction);
    case WIDGET_ACTIONS.SELECT_WIDGET:
      return selectWidgetReducer(state, action as widgetActions.SelectWidgetAction);
    case WIDGET_ACTIONS.UN_SELECT_WIDGETS:
      return unSelectWidgetsReducer(state, action as widgetActions.UnSelectWidgetsAction);
    case WIDGET_ACTIONS.UN_SELECT_WIDGET:
      return unselectWidgetReducer(state, action as widgetActions.UnSelectWidgetAction);
    case WIDGET_ACTIONS.EDIT_WIDGET:
      return editWidgetReducer(state, action as widgetActions.EditWidgetAction);
    case WIDGET_ACTIONS.UPDATE_WIDGET:
      return updateWidgetReducer(state, action as widgetActions.UpdateWidgetAction);
    default:
      return state;
  }
}

function loadWidgetsReducer(state: WidgetState, action: widgetActions.LoadWidgetsAction): WidgetState {
  return {
    ...state,
    loading: true,
  };
}

function loadWidgetsFailReducer(state: WidgetState, action: widgetActions.LoadWidgetsFailAction): WidgetState {
  return {
    ...state,
    loading: false,
  };
}

function loadWidgetsSuccessReducer(state: WidgetState, action: widgetActions.LoadWidgetsSuccessAction): WidgetState {
  return {
    loading: false,
    editing: false,
    widgetState: action.payload,
    selectedWidget: null
  };
}

function flipWidgetReducer(state: WidgetState, action: widgetActions.FlipWidgetAction): WidgetState {
  const index = state.widgetState.findIndex(w => w.id === action.payload.id);
  if (index <= -1) {
    return state;
  }

  const widget = { ...state.widgetState[index], flipped: action.payload.flipped };
  const widgetState = [
    ...state.widgetState.slice(0, index),
    widget,
    ...state.widgetState.slice(index + 1)
  ];
  return {
    ...state,
    widgetState
  };
}

function updateWidgetReducer(state: WidgetState, action: widgetActions.UpdateWidgetAction) {
  if (!action.payload.widget) {
    return state;
  }

  const index = state.widgetState.findIndex(w => w.id === action.payload.widget.id);
  if (index <= -1) {
    return state;
  }

  const widgetState = [
    ...state.widgetState.slice(0, index),
    {...action.payload.widget},
    ...state.widgetState.slice(index + 1)
  ];

  return {
    ...state,
    widgetState
  };
}

function updateLocationReducer(state: WidgetState, action: widgetActions.UpdateLocationAction): WidgetState {
  const index = state.widgetState.findIndex(w => w.id === action.payload.id);
  if (index <= -1) {
    return state;
  }

  const widget = { ...state.widgetState[index], location:  {...action.payload.location} };
  const widgetState = [
    ...state.widgetState.slice(0, index),
    widget,
    ...state.widgetState.slice(index + 1)
  ];
  return {
    ...state,
    widgetState
  };
}

function addWidgetReducer(state: WidgetState, action: widgetActions.AddWidgetAction): WidgetState {
  const widgetState = [
    ...state.widgetState,
    action.payload.widget
  ];
  return {
    ...state,
    widgetState
  };
}

function removeWidgetReducer(state: WidgetState, action: widgetActions.RemoveWidgetAction) {
  const index = state.widgetState.findIndex(w => w.id === action.payload);
  const widgetState = [
    ...state.widgetState.slice(0, index),
    ...state.widgetState.slice(index + 1)
  ];
  return {
    ...state,
    widgetState
  };
}

function selectWidgetReducer(state: WidgetState, action: widgetActions.SelectWidgetAction) {
  const index = state.widgetState.findIndex(w => w.id === action.payload);
  if (index === -1) {
    return state;
  }
  let selected = state.selectedWidget ? { ...state.selectedWidget } : null;
  const widgetState = state.widgetState.map((w, i) => {
    if (i === index) {
      selected = {...w, selected: true};
    }
    return { ...w, selected: i === index };
  });

  return {
    ...state,
    widgetState,
    selectedWidget: selected
  };
}

function unselectWidgetReducer(state: WidgetState, action: widgetActions.UnSelectWidgetAction): WidgetState {
  const index = state.widgetState.findIndex(w => w.id === action.payload);
  if (index <= -1) {
    return state;
  }

  const widget = { ...state.widgetState[index], selected: false };
  const widgetState = [
    ...state.widgetState.slice(0, index),
    widget,
    ...state.widgetState.slice(index + 1)
  ];
  return {
    ...state,
    widgetState,
    selectedWidget: null
  };
}

function unSelectWidgetsReducer(state: WidgetState, action: widgetActions.UnSelectWidgetsAction) {

  const selectedWidget = null;
  const widgetState = state.widgetState.map((w, i) => {
    return { ...w, selected: false };
  });

  return {
    ...state,
    widgetState,
    selectedWidget
  };
}

function editWidgetReducer(state: WidgetState, action: widgetActions.EditWidgetAction): WidgetState {
  const index = state.widgetState.findIndex(w => w.id === action.payload.id);
  if (index <= -1) {
    return state;
  }

  return {
    ...state,
    editing: action.payload.editing
  };
}

export const getWidgetState = createFeatureSelector<WidgetState>('widget');
export const getWidgets = createSelector(getWidgetState, (state: WidgetState) => state.widgetState);
export const getWidgetEditing = createSelector(getWidgetState, (state: WidgetState) => state.editing);
export const getSelectedWidget = createSelector(getWidgetState, (state: WidgetState) => state.selectedWidget);
