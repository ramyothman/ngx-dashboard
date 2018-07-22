import { WidgetService } from './../services/widget.service';

import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of, combineLatest } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import * as widgetActions from './../actions/widget.action';
import { WIDGET_ACTIONS } from './../actions/widget.action';

@Injectable()
export class WidgetEffects {

  constructor(private actions$: Actions, private widgetService: WidgetService) { }

  @Effect()
  loadWidgets$: Observable<Action> = this.actions$
    .pipe(
      ofType<widgetActions.LoadWidgetsAction>(WIDGET_ACTIONS.LOAD_WIDGETS),
      map(a => a.payload),
      switchMap(payload => {
        return this.widgetService.getByDashboardID(payload)
          .pipe(
            map(states => new widgetActions.LoadWidgetsSuccessAction(states)),
            catchError((err) => of(new widgetActions.LoadWidgetsFailAction(err)))
          );
      })
    );

    @Effect()
    processData$: Observable<Action> = this.actions$
      .pipe(
        ofType<widgetActions.ProcessDataAction>(WIDGET_ACTIONS.PROCESS_DATA),
        map(a => a.payload),
        switchMap(payload => {
          return this.widgetService.processData(payload.widget)
          .pipe(
            map(processedData => new widgetActions.ProcessDataSuccessAction({id: payload.widget.id, data: processedData})),
            catchError((err) => of(new widgetActions.ProcessDataFailAction(err)))
          );
        })
      );
}
