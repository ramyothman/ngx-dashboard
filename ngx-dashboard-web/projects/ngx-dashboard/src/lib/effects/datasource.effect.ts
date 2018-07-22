import { DataSourceService } from './../services/datasource.service';

import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of, combineLatest } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import * as dataSourceActions from './../actions/datasource.action';
import { DATASOURCE_ACTIONS } from './../actions/datasource.action';
import { DataSourceConnection } from '../models/datasources/data-source-connection';

@Injectable()
export class DataSourceEffects {
  constructor(private actions$: Actions, private dataSourceService: DataSourceService) { }

  @Effect()
  loadConnections$: Observable<Action> = this.actions$
    .pipe(
      ofType<dataSourceActions.LoadConnectionsAction>(DATASOURCE_ACTIONS.LOAD_CONNECTIONS),
      map(a => a.payload),
      switchMap(payload => {
        return this.dataSourceService.get(payload)
          .pipe(
            map(states => new dataSourceActions.LoadConnectionsSuccessAction(states)),
            catchError((err) => of(new dataSourceActions.LoadConnectionsFailAction(err)))
          );
      })
    );

  @Effect()
  loadDataSources$: Observable<Action> = this.actions$
    .pipe(
      ofType<dataSourceActions.LoadDataSourcesAction>(DATASOURCE_ACTIONS.LOAD_DATASOURCES),
      map(a => a.payload),
      switchMap(payload => {
        return this.dataSourceService.getDataSources(payload)
          .pipe(
            map(states => new dataSourceActions.LoadDataSourcesSuccessAction({datasources: states, id: payload })),
            catchError((err) => of(new dataSourceActions.LoadConnectionsFailAction(err)))
          );
      })
    );

    @Effect()
    loadColumns$: Observable<Action> = this.actions$
      .pipe(
        ofType<dataSourceActions.LoadDataSourceColumnsAction>(DATASOURCE_ACTIONS.LOAD_DATASOURCE_COLUMNS),
        map(a => a.payload),
        switchMap(payload => {
          return this.dataSourceService.getColumns(payload)
            .pipe(
              map(states => new dataSourceActions.LoadDataSourceColumnsSuccessAction({columns: states, id: payload.id })),
              catchError((err) => of(new dataSourceActions.LoadDataSourceColumnsFailAction(err)))
            );
        })
      );

      @Effect()
      loadData$: Observable<Action> = this.actions$
        .pipe(
          ofType<dataSourceActions.LoadDataSourceDataAction>(DATASOURCE_ACTIONS.LOAD_DATASOURCE_DATA),
          map(a => a.payload),
          switchMap(payload => {
            return this.dataSourceService.getData(payload)
              .pipe(
                map(states => new dataSourceActions.LoadDataSourceDataSuccessAction({data: states, source: payload.source })),
                catchError((err) => of(new dataSourceActions.LoadDataSourceDataFailAction(err)))
              );
          })
        );
}
