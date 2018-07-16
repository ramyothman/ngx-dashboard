import { AdvanceConsole } from './../shared/advance-console';
import { IApi } from './models/i-api';
import { Injectable } from '@angular/core';
import {throwError as observableThrowError,  Observable } from 'rxjs';
import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
  HttpHeaders
  } from '@angular/common/http';

import { map, switchMap, catchError, tap } from 'rxjs/operators';
import { plainToClassFromExist } from 'class-transformer';
import { generate } from 'shortid';

@Injectable()
export class BaseApiService<T> implements IApi<T> {
  API_ENDPOINT = 'http://localhost:21119/api/';
  endPoint: string;
  protected headers = new Headers({ 'Content-Type': 'application/json' });
  protected headersPost = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
  protected httpOptionsWithAuthorization = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      'Authorization': 'my-auth-token'
    })
  };
  protected httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json; charset=utf-8'
    })
  };
  protected entity: T;
  lastRefresh: Date = null;
  advanceConsole = new AdvanceConsole();
  getallName = '';
  constructor(protected http: HttpClient) {}

  get(queryParams?: any[]): Observable<T[]> {
    const url = `${this.API_ENDPOINT}${this.endPoint}/${this.getallName}`;
    const params: HttpParams = new HttpParams();
    if (queryParams !== undefined) {
      queryParams.forEach(param => {
        params.append(param.key, param.value);
      });
    }

    return this.http.get(url, { params })
      .pipe(
        map(res => plainToClassFromExist(this.entity, res as Object[])),
        catchError((err, caught) => this.handleError(err, caught, this.http))
      );
  }

  getById(id: number): Observable<T> {
    const url = `${this.API_ENDPOINT}${this.endPoint}/getbyid/` + id;
    return this.http.get(url)
    .pipe(
      map(res => plainToClassFromExist(this.entity, res as Object)),
      catchError((err, caught) => this.handleError(err, caught, this.http))
    );
  }

  delete(id: number): Observable<{}> {
    const url = `${this.API_ENDPOINT}${this.endPoint}/delete/${id}`;
    return this.http.post(url, JSON.stringify({ ID: id }))
    .pipe(
      catchError((err, caught) => this.handleError(err, caught, this.http))
    );
  }

  save(item?: T, queryParams?: any[]): Observable<T> {
    const url = `${this.API_ENDPOINT}${this.endPoint}/save`;

    return this.http.post(url, item)
    .pipe(
      map(res => plainToClassFromExist(this.entity, res as Object)),
      catchError((err, caught) => this.handleError(err, caught, this.http))
    );
  }

  public getNewId() {
    return generate();
  }

  public handleError(error: HttpErrorResponse, caught: Observable<any>, http: HttpClient) {
    let errMessage = `${error.status} - ${error.statusText} - ${error.message}`;
    try {
      if (error.error === undefined || error.error === null) {
        return observableThrowError({ status: error.status, message: errMessage });
      }
      const apiError = typeof error.error === 'object' ? error.error : JSON.parse(error.error);
      errMessage += `\n${apiError.error}: ${apiError['error_description']}`;

      if (error.status === 401 && apiError.error === 'invalid_token') {
        if (this.lastRefresh !== null) {
          const now = new Date();
          const diffInSeconds = Math.abs(this.lastRefresh.valueOf() - now.valueOf()) / 1000;
          this.advanceConsole.info('[AUTH:REFRESH] lastRefresh set. Diff is: ' + diffInSeconds);
          if (diffInSeconds < 30) {
            this.lastRefresh = null;
            this.advanceConsole.info('[AUTH:REFRESH] reset lastRefresh');
            return observableThrowError({ status: error.status, message: errMessage });
          }
        }
        return http.get('/.auth/refresh', { responseType: 'text' })
          .pipe(
            tap(() => {
              if (this.lastRefresh === null) {
                this.lastRefresh = new Date();
                this.advanceConsole.info('[AUTH:REFRESH] set lastRefresh to: ' + this.lastRefresh.toString());
              }
            }),
            switchMap(() => caught),
            catchError(err => observableThrowError({ status: error.status, message: errMessage }))
          );
      } else {
        this.advanceConsole.error(errMessage);
      }
    } catch (e) {
      return observableThrowError({ status: error.status, message: errMessage });
    }

    return observableThrowError({ status: error.status, message: errMessage });
  }
}
