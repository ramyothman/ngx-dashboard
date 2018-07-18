import { DataSourceConnection } from './../../../../models/datasources/data-source-connection';
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
  Input,
  OnInit} from '@angular/core';
import { FestoWidgetToggleDirective } from './../widget-toggle.directive';
import * as widgetActions from './../../../../actions/widget.action';
import * as fromWidget from './../../../../reducers/widget';
import { Store, select } from '@ngrx/store';
import { NgxEchartsService } from 'ngx-echarts';
import { Observable, BehaviorSubject } from 'rxjs';
import { WidgetService } from '../../../../services/widget.service';
import { DataSource } from '../../../../models/datasources/data-source';
import * as datasourceActions from './../../../../actions/datasource.action';
import * as fromDataSource from './../../../../reducers/datasource';

declare var $: any;
@Component({
  selector     : 'festo-widget-card',
  templateUrl  : './widget-card.component.html',
  styleUrls    : ['./widget-card.component.scss'],
  animations   : dashboardAnimations
})

export class FestoWidgetCardComponent implements OnInit {

  @Input() widget: Widget;
  @Input() selectedWidget: Widget;
  @Input() editing: boolean;

  chartHeight = '200';

  /**
     * Constructor
     *
     * @param {Store<fromWidget.WidgetState>} store
     */
    constructor(
      private store: Store<fromWidget.WidgetState>,
      private cd: ChangeDetectorRef,
      private nes: NgxEchartsService,
      private widgetService: WidgetService
  ) {

  }

  ngOnInit(): void {

  }

  onOpenEdit() {
    this.store.dispatch(new widgetActions.EditWidgetAction({id: this.widget.id, editing: true}));
  }

  onCloseEdit() {
    this.store.dispatch(new widgetActions.EditWidgetAction({id: this.widget.id, editing: false}));
  }

  onRemoveWidget() {
    this.onCloseEdit();
    this.store.dispatch(new widgetActions.RemoveWidgetAction(this.widget.id));
  }

  toggleSettingsDropDown() {
    $(`widgetDropDown${this.widget.id}`).dropdown('toggle');
  }

  close() {
    if (this.widget.selected) {
      this.store.dispatch(new widgetActions.UnSelectWidgetAction(this.widget.id));
      this.onCloseEdit();
    }
  }

  onWidgetSelected() {
    if (!this.widget.selected) {
      this.store.dispatch(new widgetActions.SelectWidgetAction(this.widget.id));
    }
  }

  onUnSelectWidgets() {
    this.store.dispatch(new widgetActions.UnSelectWidgetsAction());
    this.onCloseEdit();
  }
}
