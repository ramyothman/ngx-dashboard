import { Column } from './../models/datasources/column';
import { DataSourceConnection } from './../models/datasources/data-source-connection';
import { DataSource } from './../models/datasources/data-source';
import { HttpClient } from '@angular/common/http';

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/toPromise';
import { map, switchMap, catchError, tap } from 'rxjs/operators';

import { BaseApiService } from './base-api.service';
import { plainToClass, plainToClassFromExist } from 'class-transformer';

@Injectable()
export class DataSourceService extends BaseApiService<DataSourceConnection> {
    public endPoint = 'datasource';
    datasourceEntity: DataSource;
    columnEntity: Column;
    constructor(protected http: HttpClient) {
      super(http);
    }

    getDataSources(id: string): Observable<DataSource[]> {
      const url = `${this.API_ENDPOINT}${this.endPoint}/GetDataSources?id=${id}`;

      return this.http.get(url)
        .pipe(
          map(res => plainToClassFromExist(this.datasourceEntity, res as Object[])),
          catchError((err, caught) => this.handleError(err, caught, this.http))
        );
    }

    getColumns(request: any): Observable<Column[]> {
      const url = `${this.API_ENDPOINT}${this.endPoint}/GetColumns`;
      return this.http.post(url, JSON.stringify(request), this.httpOptions)
        .pipe(
          map(res => plainToClassFromExist(this.columnEntity, res as Object[])),
          catchError((err, caught) => this.handleError(err, caught, this.http))
        );
    }

    getData(request: any): Observable<any[]> {
      const url = `${this.API_ENDPOINT}${this.endPoint}/GetData`;
      return this.http.post(url, JSON.stringify(request), this.httpOptions)
        .pipe(
          catchError((err, caught) => this.handleError(err, caught, this.http))
        );
    }
}
