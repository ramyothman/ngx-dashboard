import { Store, select } from '@ngrx/store';
import { Widget } from './../../../../../models/widget';
import { Component, OnInit, Input } from '@angular/core';
import * as widgetActions from './../../../../../actions/widget.action';
import * as fromWidget from './../../../../../reducers/widget';
import * as datasourceActions from './../../../../../actions/datasource.action';
import * as fromDataSource from './../../../../../reducers/datasource';

import { Observable, BehaviorSubject, ObjectUnsubscribedError } from 'rxjs';
import { DataSource } from '../../../../../models/datasources/data-source';
import { DataSourceConnection } from '../../../../../models/datasources/data-source-connection';

@Component({
  selector: 'ngx-widget-setting-binding',
  templateUrl: './widget-setting-binding.component.html',
  styleUrls: ['./widget-setting-binding.component.css']
})
export class WidgetSettingBindingComponent implements OnInit {
  @Input() widget: Widget;
  @Input() dataSourcesList: any[];
  selectedDataSource: any;
  widgets$: Observable<Widget[]>;
  source$: Observable<DataSource>;
  selectedSource: DataSource;
  constructor(
    private storeConnections: Store<fromDataSource.DataSourceConnectionState>,
    private storeWidget: Store<fromWidget.WidgetState>
  ) {}

  dataSourceChanged(e) {
    if (e == null) {
      return;
    }
    this.source$ =  this.storeConnections.pipe(select(fromDataSource.getDataSource(e)));
    this.source$.subscribe((event: DataSource) => {
      this.selectedSource = event;
      this.storeWidget.dispatch(new widgetActions.UpdateDataSourceAction({id: this.widget.id, source: event}));
      this.storeWidget.dispatch(new widgetActions.ProcessDataAction(
        {
          id: this.widget.id,
          data: event.data,
          xAxis: this.widget.xAxis,
          yAxis: this.widget.yAxis,
          groupBy: this.widget.groupBy
        }));
    });
  }

  columnChanged(e) {
    this.storeWidget.dispatch(new widgetActions.ProcessDataAction(
      {
        id: this.widget.id,
        data: this.selectedSource.data,
        xAxis: this.widget.xAxis,
        yAxis: this.widget.yAxis,
        groupBy: this.widget.groupBy
      }));
  }

  ngOnInit() {

  }
}
