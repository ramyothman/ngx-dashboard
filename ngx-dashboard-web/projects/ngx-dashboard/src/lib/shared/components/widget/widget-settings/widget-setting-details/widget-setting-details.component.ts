import { getWidgetState } from './../../../../../reducers/index';
import { Widget } from './../../../../../models/widget';
import { dashboardAnimations } from './../../../../../shared/animations';
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
  Input} from '@angular/core';
import * as widgetActions from './../../../../../actions/widget.action';
import * as fromWidget from './../../../../../reducers/widget';
import { Store, select } from '@ngrx/store';

@Component({
  selector     : 'ngx-widget-setting-details',
  templateUrl  : './widget-setting-details.component.html',
  styleUrls    : ['./widget-setting-details.component.scss'],
  animations   : dashboardAnimations
})

export class NgxWidgetSettingDetailsComponent  {

  @Input() widget: Widget;
  panelOpenState: boolean;
  set titleDisplay(value: string) {
    this.widget.showTitleIn = value;
    switch (value) {
      case 'none':
      case 'widget':
        this.widget.widgetOptions.title.show = false;
        break;
      case 'both':
      case 'chart':
        this.widget.widgetOptions.title.show = true;
        break;
    }
  }
  get titleDisplay(): string {
    return this.widget.showTitleIn;
  }
  /**
     * Constructor
     *
     * @param {Store<fromWidget.WidgetState>} store
     */
    constructor(
      private store: Store<fromWidget.WidgetState>,
      private cd: ChangeDetectorRef
  ) {

  }

}
