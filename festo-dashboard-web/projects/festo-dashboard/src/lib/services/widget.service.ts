import { Widget, WidgetOptions } from './../models/widget';
import { Dashboard } from './../models/dashboard';
import { HttpClient } from '@angular/common/http';

import { Injectable, EventEmitter, QueryList } from '@angular/core';
import { Observable, of } from 'rxjs';
import 'rxjs/add/operator/toPromise';
import { map, switchMap, catchError, tap } from 'rxjs/operators';

import { BaseApiService } from './base-api.service';
import { plainToClass, plainToClassFromExist } from 'class-transformer';
import { GridStackItem, GridStackComponent, GridStackItemComponent } from 'ng4-gridstack';
declare var _: any;
@Injectable()
export class WidgetService extends BaseApiService<Dashboard> {
    public onWidgetAdded: EventEmitter<Widget> = new EventEmitter<Widget>();
    public onWidgetRemoved: EventEmitter<Widget> = new EventEmitter<Widget>();
    public onWidgetUpdated: EventEmitter<Widget> = new EventEmitter<Widget>();
    public onWidgetLiveUpdate: EventEmitter<Widget> = new EventEmitter<Widget>();
    public endPoint = 'widget';
    constructor(protected http: HttpClient) {
      super(http);
    }

    getByDashboardID(id: string): Observable<Widget[]> {
      const url = `${this.API_ENDPOINT}${this.endPoint}/getall-by-dashboard-id/${id}`;
      const location1 = new GridStackItem();
      location1.customId = this.getNewId();
      location1.width = 6;
      location1.height = 4;
      location1.x = 0;
      location1.y = 0;
      const location2 = new GridStackItem();
      location2.customId = this.getNewId();
      location2.width = 6;
      location2.height = 4;
      location2.x = 6;
      location2.y = 0;
      const location3 = new GridStackItem();
      location3.customId = this.getNewId();
      location3.width = 6;
      location3.height = 4;
      location3.x = 0;
      location3.y = 4;
      const location4 = new GridStackItem();
      location4.customId = this.getNewId();
      location4.width = 6;
      location4.height = 4;
      location4.x = 6;
      location4.y = 4;
      const widgets: Widget[] = [{
        id: location1.customId,
        dashboardId: '1',
        location : location1,
        flipped: false,
        title: 'Machines Bar Chart',
        selected: false,
        showTitleIn: 'widget',
        data: null,
        widgetOptions: new WidgetOptions()
      },
      {
        id: location2.customId,
        dashboardId: '1',
        location: location2,
        flipped: false,
        title: 'Tasks Chart',
        showTitleIn: 'both',
        selected: false,
        data: null,
        widgetOptions: new WidgetOptions()
      },
      {
        id: location3.customId,
        dashboardId: '1',
        location: location3,
        flipped: false,
        title: 'Example Chart',
        showTitleIn: 'both',
        selected: false,
        data: null,
        widgetOptions: new WidgetOptions()
      },
      {
        id: location4.customId,
        dashboardId: '1',
        location: location4,
        flipped: true,
        title: 'Machines List',
        selected: false,
        showTitleIn: 'none',
        data: null,
        widgetOptions: new WidgetOptions()
      }];
      return of (widgets);
    }

    updateWidget(
      source: Widget[],
      destination: Widget[],
      widgetComponents: QueryList<GridStackItemComponent>,
      gridStackDashboard: GridStackComponent) {

      if (destination && destination.length > 0) {
        for (let index = 0; index < source.length; index++) {
          const wIndex = destination.findIndex(iw => iw.id === source[index].id);
          if (wIndex !== -1) {
            destination[wIndex].dashboardId = source[index].dashboardId;
            destination[wIndex].flipped = source[index].flipped;
            destination[wIndex].location = source[index].location;
            destination[wIndex].selected = source[index].selected;
            destination[wIndex].title = source[index].title;
            destination[wIndex].widgetOptions = source[index].widgetOptions;
            destination[wIndex].showTitleIn = source[index].showTitleIn;
            this.onWidgetUpdated.emit(destination[wIndex]);
          } else {
            destination.push(source[index]);
            this.onWidgetAdded.emit(source[index]);
          }
        }
        const removeList: number[] = [];
        for (let index = 0; index < destination.length; index++) {
          const wIndex = source.findIndex(iw => iw.id === destination[index].id);
          if (wIndex === -1) {
            removeList.push(index);
          }
        }
        const widgetsArray = widgetComponents.toArray();
        for (let index = 0; index < removeList.length; index++) {
          destination.splice(removeList[index], 1);
          gridStackDashboard.RemoveWidget(widgetsArray[removeList[index]]);
          this.onWidgetRemoved.emit(destination[removeList[index]]);

        }
      } else {
        destination = source;
      }
      return destination;
    }

    getJson(obj: any) {
      const filtered = _.pick(obj, function (v) { return v !== '' && v !== null; });
      return _.cloneDeep(filtered, function (v) { return v !== filtered && _.isPlainObject(v) ? this.filter(v) : undefined; });
    }
}
