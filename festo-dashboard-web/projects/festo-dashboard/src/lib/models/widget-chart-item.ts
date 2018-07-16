import { Widget } from './widget';
import { Type } from '@angular/core';
import { IWidgetChart } from './IWidgetChart';

export class WidgetChartItem {
  chartOptions: any;
  chartType: string;
  resizeChart(option: any) {
  }

  constructor(public component: Type<WidgetChartItemComponent>, public widget: Widget) {}
}

export abstract class WidgetChartItemComponent implements IWidgetChart {
  widget: Widget;  chartOptions: any;
  chartType: string;
  public abstract resizeChart(option: any);
  public abstract setOptions(options: any);
  public abstract updateChartColors(option: any);
  public abstract reorderChartLabels(option: any);
  public abstract switchChartType(option: any);
  public abstract initChart(option: any);
}
