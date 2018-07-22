import { Dashboard } from './../models/dashboard';
import { HttpClient } from '@angular/common/http';

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/toPromise';
import { map, switchMap, catchError, tap } from 'rxjs/operators';

import { BaseApiService } from './base-api.service';
import { plainToClass, plainToClassFromExist } from 'class-transformer';

@Injectable()
export class DashboardService extends BaseApiService<Dashboard> {
    public endPoint = 'dashboard';
    constructor(protected http: HttpClient) {
      super(http);
    }

    getByMasterID(id: string): Observable<Dashboard[]> {
      const url = `${this.API_ENDPOINT}${this.endPoint}/getall-by-master-id/${id}`;

      return this.http.get(url)
        .pipe(
          map(res => plainToClassFromExist(this.entity, res as Object[])),
          catchError((err, caught) => this.handleError(err, caught, this.http))
        );
    }
}
