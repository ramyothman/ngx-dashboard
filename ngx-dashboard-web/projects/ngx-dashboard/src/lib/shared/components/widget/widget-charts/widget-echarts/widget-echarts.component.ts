import { ModelService } from './../../../../../services/model.service';
import { WidgetService } from './../../../../../services/widget.service';
import { IWidgetChart } from './../../../../../models/IWidgetChart';
import { getWidgetState } from './../../../../../reducers/index';
import { Widget, WidgetOptions } from './../../../../../models/widget';
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
import { NgxWidgetToggleDirective } from './../../widget-toggle.directive';
import * as widgetActions from './../../../../../actions/widget.action';
import * as fromWidget from './../../../../../reducers/widget';
import { Store, select } from '@ngrx/store';
import { NgxEchartsService } from 'ngx-echarts';
import { Observable, BehaviorSubject } from 'rxjs';
import { WidgetChartItem, WidgetChartItemComponent } from '../../../../../models/widget-chart-item';

@Component({
  selector     : 'ngx-widget-echart',
  templateUrl  : './widget-echarts.component.html',
  styleUrls    : ['./widget-echarts.component.scss'],
  animations   : dashboardAnimations
})

export class WidgetEChartsComponent extends WidgetChartItemComponent {

  @Input() widget: Widget;
  echartsIntance: any;
  initOpts = {
    renderer: 'svg',
    height: 230
  };
  /**
     * Constructor
     *
     * @param {Store<fromWidget.WidgetState>} store
     */
    constructor(
      private store: Store<fromWidget.WidgetState>,
      private cd: ChangeDetectorRef,
      private nes: NgxEchartsService,
      private widgetService: WidgetService,
      private modelService: ModelService<Widget>
  ) {
    super();
  }

  /**
   * IWidgetChart Implementation
   *
   */
  chartOptions = {
    title: {
      text: ''
    },
    tooltip : {
      trigger: 'axis'
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    series : []
  };

  chartType = 'echarts';
  public initChart(option: any) {
    this.echartsIntance = option;
  }

  public setOptions(options: WidgetOptions) {
    if (this.echartsIntance) {
      if (!options.title.text || options.title.text === '') {
        options.title.text = '';
      }
      if (!options.title.subtext || options.title.subtext === '') {
        options.title.subtext = '';
      }
      this.echartsIntance.setOption(options);
    }
  }
  public resizeChart(option: any) {
  }
  public updateChartColors(option: any) {
  }
  public reorderChartLabels(option: any) {

  }
  public switchChartType(option: any) {
  }



}
