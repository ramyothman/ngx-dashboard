import { DataSourceService } from './../../../../services/datasource.service';
import { DataSourceConnection } from './../../../../models/datasources/data-source-connection';
import { WidgetService } from './../../../../services/widget.service';
import { ModelService } from './../../../../services/model.service';
import { getWidgetState } from './../../../../reducers/index';
import { Widget } from './../../../../models/widget';
import { dashboardAnimations } from './../../../../shared/animations';
import { AfterContentInit,
  Component,
  ContentChildren,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ElementRef,
  HostBinding,
  QueryList,
  Renderer2,
  ViewEncapsulation,
  DoCheck,
  SimpleChange,
  Input} from '@angular/core';
import { NgxWidgetToggleDirective } from './../widget-toggle.directive';
import * as widgetActions from './../../../../actions/widget.action';
import * as fromWidget from './../../../../reducers/widget';
import { Store, select } from '@ngrx/store';
import { NgxEchartsService } from 'ngx-echarts';
import { Observable, BehaviorSubject } from 'rxjs';
import { DataSource } from '../../../../models/datasources/data-source';
import * as datasourceActions from './../../../../actions/datasource.action';
import * as fromDataSource from './../../../../reducers/datasource';
declare var _: any;
@Component({
  selector     : 'ngx-widget-settings',
  templateUrl  : './widget-settings.component.html',
  styleUrls    : ['./widget-settings.component.scss'],
  animations   : dashboardAnimations
})

export class NgxWidgetSettingsComponent implements DoCheck   {

  _oldWidget: Widget;
  _widget: BehaviorSubject<Widget> = new BehaviorSubject<Widget>(null);
  dataSourcesList: any[] = [];
  @Input()
  get widget(): Widget {
    return this._widget.getValue();
  }
  set widget(value: Widget) {
    if (value) {
      this._widget.next(value);
    }
  }
  @Input() editing: boolean;
  panelOpenState: boolean;
  connections$: Observable<DataSourceConnection[]>;
  /**
     * Constructor
     *
     * @param {Store<fromWidget.WidgetState>} store
     */
    constructor(
      private store: Store<fromWidget.WidgetState>,
      private cd: ChangeDetectorRef,
      private modelService: ModelService<Widget>,
      private widgetService: WidgetService,
      private dataSourceService: DataSourceService
  ) {

    this.connections$ = this.store.pipe(select(fromDataSource.getConnections));
    this.connections$.subscribe((conn: DataSourceConnection[]) => {
      this.dataSourcesList = this.dataSourceService.getDataSourcesDropDown(conn);
    });
    this._widget.subscribe(
      (widget: Widget) => {
        this.modelService.set(widget);
      });
  }

  ngDoCheck() {
    if (this.editing) {
      if (this.widget) {
        if (this.modelService.isChangedAccumulative()) {
          this.update();
        }
      }
    }
  }

  cancel() {
    this.widget = this.modelService.restoreItem();
    this.store.dispatch(new widgetActions.UpdateWidgetAction({widget: this.widget}));
    this.store.dispatch(new widgetActions.EditWidgetAction({id: this.widget.id, editing: false}));
    this.widgetService.onWidgetLiveUpdate.emit(this.widget);
  }

  save() {
    this.update();
    this.store.dispatch(new widgetActions.EditWidgetAction({id: this.widget.id, editing: false}));
    this.modelService.set(this.widget);
  }

  update() {
    this.store.dispatch(new widgetActions.UpdateWidgetAction({widget: this.widget}));
    this.widgetService.onWidgetLiveUpdate.emit(this.widget);
  }

}
