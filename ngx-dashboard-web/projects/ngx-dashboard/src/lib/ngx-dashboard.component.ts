import { DataSourceConnection } from './models/datasources/data-source-connection';
import { LoadConnectionsAction } from './actions/datasource.action';
import { WidgetService } from './services/widget.service';
import { Widget, WidgetOptions } from './models/widget';

import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewChild,
  AfterViewInit,
  ViewChildren,
  QueryList,
  EventEmitter,
  Output
} from '@angular/core';
import { dashboardAnimations } from './shared/animations';
import { Store, select } from '@ngrx/store';
import * as dashboardActions from './actions/dashboard.action';
import * as widgetActions from './actions/widget.action';
import * as datasourceActions from './actions/datasource.action';
import * as fromDashboard from './reducers/dashboard';
import * as fromWidget from './reducers/widget';
import * as fromDataSource from './reducers/datasource';
import { Observable } from 'rxjs';
import { GridStackItem, GridStackOptions, GridStackItemComponent, GridStackComponent} from 'ngx-grid-stack';
declare var _: any;
declare var $: any;
@Component({
  selector: 'ngx-dashboard',
  templateUrl  : './ngx-dashboard.component.html',
  styleUrls: ['./ngx-dashboard.component.scss'],
  animations   : dashboardAnimations,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NgxDashboardComponent implements OnInit, AfterViewInit {

  @ViewChild('gridStackDashboard') gridStackDashboard: GridStackComponent;
  @ViewChildren(GridStackItemComponent) widgetComponents: QueryList<GridStackItemComponent>;
  gridStackOptions: GridStackOptions = new GridStackOptions();
  dashboardOption: {float: false, cellHeight: '60px'};
  widgets: Widget[] = [];
  widgets$: Observable<Widget[]>;

  selectedWidget$: Observable<Widget>;
  editing$: Observable<boolean>;
  showFiller: boolean;
  @Output() widgetsUpdated: EventEmitter<Widget[]> = new EventEmitter<Widget[]>();

  constructor(
    private store: Store<fromDashboard.DashboardState>,
    private widgetService: WidgetService,
    private cd: ChangeDetectorRef
  ) {
    this.gridStackOptions.float = false;
    this.gridStackOptions.handleClass = 'widget-handle';
    this.gridStackOptions.resizable = true;
    
    this.widgetsUpdated.subscribe((widgets: Widget[]) => {
      this.onWidgetsUpdated(widgets);
    });
  }

  ngOnInit() {
    this.store.dispatch(new widgetActions.LoadWidgetsAction('123'));
    this.widgets$ = this.store.pipe(select(fromWidget.getWidgets));
    this.editing$ = this.store.pipe(select(fromWidget.getWidgetEditing));
    this.selectedWidget$ = this.store.pipe(select(fromWidget.getSelectedWidget));
    this.widgets$.subscribe((widgets: Widget[]) => {
      this.widgets = this.widgetService.updateWidget(widgets, this.widgets, this.widgetComponents, this.gridStackDashboard);
      this.cd.detectChanges();
      this.widgetsUpdated.emit(this.widgets);
    });
  }

  ngAfterViewInit(): void {
    // if(this.gridStackDashboard) {
    //   this.gridStackDashboard.makeWidget()
    // }

  }

  onGridConfigurationChanged(e, widget: Widget) {
    this.store.dispatch(new widgetActions.UpdateLocationAction({id: widget.id, location: e}));
  }

  onWidgetsUpdated(widgets: Widget[]) {
    const arr = this.widgetComponents.toArray();
    for (let index = 0; index < arr.length; index++) {
      const widget = arr[index];
      const widgitInitialized = widget.nativeElement.getAttribute('data-gs-init');
      const hasDraggable = widget.nativeElement.classList.contains('ui-draggable');

      if (widgitInitialized !== 'true' && !hasDraggable) {
        widget.nativeElement.setAttribute('data-gs-init', 'true');
        this.gridStackDashboard.AddWidget(widget);
      } else if (widgitInitialized !== 'true') {
        widget.nativeElement.setAttribute('data-gs-init', 'true');
      }
      // const wIndex = this.widgets.findIndex(iw => iw.id === widget.option.customId);
      // if (wIndex === -1) {

      //   this.gridStackDashboard.RemoveWidget(widget);
      // }
    }
  }

  addWidget() {
    const newWidget = new Widget();
    newWidget.dashboardId = '1';
    newWidget.flipped = false;
    newWidget.id = this.widgetService.getNewId();
    newWidget.location = new GridStackItem();
    newWidget.location.customId = newWidget.id;
    newWidget.location.x = 0;
    newWidget.location.y = 0;
    newWidget.location.width = 6;
    newWidget.location.height = 4;
    newWidget.widgetOptions = new WidgetOptions();
    newWidget.widgetOptions.title.text = newWidget.title;
    this.store.dispatch(new widgetActions.AddWidgetAction({widget: newWidget}));
  }

  onClick() {
    this.store.dispatch(new dashboardActions.LoadDashboardsAction('123'));
  }

  loadConnections() {
    $('#connectionModal').modal({show: true});
  }

  onCloseModal(e) {
    $('#connectionModal').modal('hide');
  }

  loadDataSources() {
    $('#dataSourcesModal').modal({show: true});
  }
}
