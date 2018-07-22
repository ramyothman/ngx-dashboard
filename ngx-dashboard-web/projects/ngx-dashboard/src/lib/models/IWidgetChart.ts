import { Widget } from './widget';
export interface IWidgetChart {
  widget: Widget;
  chartOptions: any;
  chartType: string;
  resizeChart(option: any);
  setOptions(options: any);
  updateChartColors(option: any);
  reorderChartLabels(option: any);
  switchChartType(option: any);
  initChart(option: any);
}
