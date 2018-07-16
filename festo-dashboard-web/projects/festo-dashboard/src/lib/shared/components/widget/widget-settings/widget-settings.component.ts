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
import { FestoWidgetToggleDirective } from './../widget-toggle.directive';
import * as widgetActions from './../../../../actions/widget.action';
import * as fromWidget from './../../../../reducers/widget';
import { Store, select } from '@ngrx/store';
import { NgxEchartsService } from 'ngx-echarts';
import { Observable, BehaviorSubject } from 'rxjs';

declare var _: any;
@Component({
  selector     : 'festo-widget-settings',
  templateUrl  : './widget-settings.component.html',
  styleUrls    : ['./widget-settings.component.scss'],
  animations   : dashboardAnimations
})

export class FestoWidgetSettingsComponent implements DoCheck   {

  _oldWidget: Widget;
  _widget: BehaviorSubject<Widget> = new BehaviorSubject<Widget>(null);
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
  /**
     * Constructor
     *
     * @param {Store<fromWidget.WidgetState>} store
     */
    constructor(
      private store: Store<fromWidget.WidgetState>,
      private cd: ChangeDetectorRef,
      private modelService: ModelService<Widget>,
      private widgetService: WidgetService
  ) {
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
