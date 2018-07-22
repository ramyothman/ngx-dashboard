import { DashboardService } from './../services/dashboard.service';

import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of, combineLatest } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import * as dashboardActions from './../actions/dashboard.action';
import { DASHBOARD_ACTIONS } from './../actions/dashboard.action';

@Injectable()
export class DashboardEffects {

  constructor(private actions$: Actions, private dashboardService: DashboardService) { }

  @Effect()
  loadDashboards$: Observable<Action> = this.actions$
    .pipe(
      ofType<dashboardActions.LoadDashboardsAction>(DASHBOARD_ACTIONS.LOAD_DASHBOARDS),
      map(a => a.payload),
      switchMap(payload => {
        return this.dashboardService.getByMasterID(payload)
          .pipe(
            map(states => new dashboardActions.LoadSuccessDashboardsAction(states)),
            catchError((err) => of(new dashboardActions.LoadFailDashboardsAction(err)))
          );
      })
    );
}
