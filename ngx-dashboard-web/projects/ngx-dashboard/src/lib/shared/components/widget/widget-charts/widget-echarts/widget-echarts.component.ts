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
      text: '堆叠区域图'
    },
    tooltip : {
      trigger: 'axis'
    },
    legend: {
      data: ['Cat 1', 'Cat 2', 'Cat 3', 'Cat 4']
    },
    toolbox: {
      feature: {
        saveAsImage: {}
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis : [
      {
        type : 'category',
        boundaryGap : false,
        data : ['Jan', 'Feb', 'Mar', 'Jun', 'Jul', 'Aug', 'Sep']
      }
    ],
    yAxis : [
      {
        type : 'value'
      }
    ],
    series : [
      {
        name: 'Cat 1',
        type: 'line',
        stack: '总量',
        areaStyle: {normal: {}},
        data: [120, 132, 101, 134, 90, 230, 210]
      },
      {
        name: 'Cat 2',
        type: 'line',
        stack: '总量',
        areaStyle: {normal: {}},
        data: [220, 182, 191, 234, 290, 330, 310]
      },
      {
        name: 'Cat 3',
        type: 'line',
        stack: '总量',
        areaStyle: {normal: {}},
        data: [150, 232, 201, 154, 190, 330, 410]
      },
      {
        name: 'Cat 4',
        type: 'line',
        stack: '总量',
        areaStyle: {normal: {}},
        data: [320, 332, 301, 334, 390, 330, 320]
      },
      {
        name: 'Cat 6',
        type: 'line',
        stack: '总量',
        label: {
          normal: {
            show: true,
            position: 'top'
          }
        },
        areaStyle: {normal: {}},
        data: [820, 932, 901, 934, 1290, 1330, 1320]
      }
    ]
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
