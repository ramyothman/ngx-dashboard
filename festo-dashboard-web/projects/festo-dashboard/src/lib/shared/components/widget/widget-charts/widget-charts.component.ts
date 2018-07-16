import { ModelService } from './../../../../services/model.service';
import { WidgetService } from './../../../../services/widget.service';
import { WidgetChartItem, WidgetChartItemComponent } from './../../../../models/widget-chart-item';
import { WidgetEChartsComponent } from './widget-echarts/widget-echarts.component';
import { WidgetChartDirective } from './widget-chart.directive';
import { IWidgetChart } from './../../../../models/IWidgetChart';
import { getWidgetState } from './../../../../reducers/index';
import { Widget } from './../../../../models/widget';
import { dashboardAnimations } from './../../../../shared/animations';
import { AfterContentInit,
  Component,
  ChangeDetectorRef,
  ViewChild,
  ComponentFactoryResolver,
  OnInit,
  OnDestroy,
  Input,
  Type
} from '@angular/core';
import { FestoWidgetToggleDirective } from './../widget-toggle.directive';
import * as widgetActions from './../../../../actions/widget.action';
import * as fromWidget from './../../../../reducers/widget';
import { Store, select } from '@ngrx/store';
import { NgxEchartsService } from 'ngx-echarts';
import { Observable, BehaviorSubject } from 'rxjs';

@Component({
  selector     : 'festo-widget-chart',
  templateUrl  : './widget-charts.component.html',
  styleUrls    : ['./widget-charts.component.scss'],
  animations   : dashboardAnimations
})

export class WidgetChartsComponent implements IWidgetChart, OnInit, OnDestroy {
  @ViewChild(WidgetChartDirective) chartWidgetHost: WidgetChartDirective;
  @Input() widget: Widget;
  chartOptions: any;
  chartType = 'echarts';
  chartComponentInstance: WidgetChartItem;
  chartComponentRef: WidgetChartItemComponent;
  /**
     * Constructor
     *
     * @param {Store<fromWidget.WidgetState>} store
     */
    constructor(
      private store: Store<fromWidget.WidgetState>,
      private cd: ChangeDetectorRef,
      private factoryResolver: ComponentFactoryResolver,
      private widgetService: WidgetService,
      private modelService: ModelService<Widget>
  ) {
    this.widgetService.onWidgetLiveUpdate.subscribe((widget: Widget) => {
      const widgetInModel = modelService.get();

      if (widgetInModel) {
        if (this.widget.id === widget.id) {
          this.setOptions(widget.widgetOptions);
        }
      }
    });
  }

  ngOnInit() {
    this.chartComponentInstance = this.addComponent();
    this.loadComponent();
  }

  addComponent() {
    return this.addComponentByType(this.chartType);
  }

  addComponentByType(type: string) {
    return this.addComponentByComponentType(type, null);
  }

  addComponentByComponentType(type: string, componentType: Type<any>) {
    switch (type) {
      case 'echarts':
        return new WidgetChartItem(WidgetEChartsComponent, this.widget);
      default:
        return new WidgetChartItem(WidgetEChartsComponent, this.widget);
    }
  }

  loadComponent() {
    const componentFactory = this.factoryResolver.resolveComponentFactory(this.chartComponentInstance.component);
    const viewContainerRef = this.chartWidgetHost.viewContainerRef;
    viewContainerRef.clear();

    const componentRef = viewContainerRef.createComponent(componentFactory);
    this.chartComponentRef = componentRef.instance;
    (<IWidgetChart>componentRef.instance).widget = this.chartComponentInstance.widget;
  }

  ngOnDestroy() {
    // clearInterval(this.interval);
  }


  /**
   * IWidgetChart Implementation
   *
   */

  resizeChart(option: any) {
  }
  updateChartColors(option: any) {
  }
  reorderChartLabels(option: any) {

  }
  switchChartType(option: any) {
  }
  initChart(option: any) {

  }

  setOptions(options: any) {
    if (this.chartComponentInstance) {
      this.chartComponentRef.setOptions(options);
    }

  }

}
