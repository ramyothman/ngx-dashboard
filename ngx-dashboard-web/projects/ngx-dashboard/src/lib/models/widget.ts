import { ProcessedData } from './datasources/processed-data';
import { DataSource } from './datasources/data-source';
import { GridStackItem } from 'ngx-grid-stack';

export const WidgetTypes = {
  line: 'line',
  bar: 'bar',
  pie: 'pie',
  scatter: 'scatter',
  map: 'map',
  parallel: 'parallel',
  lines: 'lines',
  funnel: 'funnel',
  gauge: 'gauge'
};

export class Widget {
  id: string;
  dashboardId: string;
  location: GridStackItem;
  flipped: boolean;
  selected: boolean;
  title: string;
  // options [widget, chart, both, none]
  showTitleIn: string;
  widgetOptions: WidgetOptions;
  dataSource: DataSource;
  xAxis: string;
  widgetType = 'bar';
  groupBy: string;
  yAxis: string[];
  data: ProcessedData;
}

export class WidgetOptions {
  title: WidgetTitle = new WidgetTitle();
  legend: WidgetLegend = new WidgetLegend();
  grid: WidgetGrid = new WidgetGrid();
  xAxis: WidgetAxis = new WidgetAxis();
  yAxis: WidgetAxis = new WidgetAxis();
  tooltip: WidgetTooltip = new WidgetTooltip();
  axisPointer: WidgetAxisPointer = new WidgetAxisPointer();
  singleAxis: WidgetAxis ;
  dataset: WidgetDataset = new WidgetDataset();
  series: any;
  color: any[];
  backgroundColor: string;
  textStyle: WidgetStyleOptions = new WidgetStyleOptions();
  animation: boolean;
  useUTC: boolean;
  dataZoom: WidgetZoom ;
}

// https://ecomfe.github.io/echarts-doc/public/en/option.html#dataset
export class WidgetZoom {
  type: string;
  bottom: string;
  top: string;
}
export class WidgetDataset {
  id: string;
  source: any | any[];
  dimensions: any[];
  /*
    Whether the first row/column of dataset.source represents dimension names. Optional values:
    null/undefine: means auto detect whether the first row/column is dimension names or data.
    true: the first row/column is dimension names.
    false: data start from the first row/column.
    Note: "the first row/column" means that if series.seriesLayoutBy is set as 'column',
    pick the first row, otherwise, if it is set as 'row', pick the first column.
  */
  sourceHeader: boolean;
}

/*
  Tooltip component.
  General Introduction:
  tooltip can be configured on different places:
  Configured on global: tooltip
  Configured in a coordinate system: grid.tooltip, polar.tooltip, single.tooltip
  Configured in a series: series.tooltip
  Configured in each item of series.data: series.data.tooltip
*/
export class WidgetTooltip {
  // Whether to show the tooltip component, including tooltip floating layer and axisPointer.
  show: boolean;
  /*
  [ default: 'item' ]
  Type of triggering.
  Options:
  'item'
  Triggered by data item, which is mainly used for charts that don't have a category axis like scatter charts
  or pie charts.
  'axis'
  Triggered by axes, which is mainly used for charts that have category axes, like bar charts or line charts.
  'none'
  Trigger nothing.
  */
  trigger: string;
  axisPointer: WidgetAxisPointer;
  showContent: boolean;
  alwaysShowContent: boolean;
  /*
  [ default: 'mousemove|click' ]
  Conditions to trigger tooltip. Options:
  'mousemove'
  Trigger when mouse moves.
  'click'
  Trigger when mouse clicks.
  'mousemove|click'
  Trigger when mouse clicks and moves.
  'none'
  Do not triggered by 'mousemove' and 'click'. Tooltip can be triggered and hidden manually by
  calling action.tooltip.showTip and action.tooltip.hideTip. It can also be triggered by axisPointer.
  handle in this case.
  */
  triggerOn: string;
  // [ default: 0 ]
  // Delay time for showing tooltip, in ms. No delay by default, and it is not recommended to set.
  // Only valid when triggerOn is set to be 'mousemove'.
  showDelay: number;
  // [ default: 100 ]
  // Delay time for hiding tooltip, in ms. It will be invalid when alwaysShowContent is true.
  hideDelay: number;
  // Whether mouse is allowed to enter the floating layer of tooltip,
  // whose default value is false. If you need to interact in the tooltip like with links or buttons,
  // it can be set as true.
  enterable: boolean;
  // [default: false]
  // Whether confine tooltip content in the view rect of chart instance.
  // Useful when tooltip is cut because of 'overflow: hidden' set on outer dom of chart instance,
  // or because of narrow screen on mobile.
  confine: boolean;
  // The transition duration of tooltip's animation, in seconds.
  // When it is set to be 0, it would move closely with the mouse.
  transitionDuration: number;
  /*
    The position of the tooltip's floating layer, which would follow the position of mouse by default.
    Options:
    Array
    Display the position of tooltip's floating layer through array, which supports absolute position and relative percentage.
    Example:

    // absolute position, which is 10px to the left side and 10px to the top side of the container
    position: [10, 10]
    // relative position, in the exact center of the container
    position: ['50%', '50%']
    Function

    Callback function in the following form:

    (point: Array, params: Object|Array.<Object>, dom: HTMLDomElement, rect: Object, size: Object) => Array
    Parameters:
    point: Mouse position.
    param: The same as formatter.
    dom: The DOM object of tooltip.
    rect: It is valid only when mouse is on graphic elements, which stands for a bounding box with x, y, width, and height.
    size: The size of dom echarts container. For example: {contentSize: [width, height], viewSize: [width, height]}.

    Return:
    Return value is an array standing for tooltip position, which can be absolute pixels, or relative percentage.
    Or can be an object, like {left: 10, top: 30}, or {right: '20%', bottom: 40}.

    For example:

      position: function (point, params, dom, rect, size) {
          // fixed at top
          return [point[0], '10%'];
      }
    Or:

      position: function (pos, params, dom, rect, size) {
          // tooltip will be fixed on the right if mouse hovering on the left,
          // and on the left if hovering on the right.
          var obj = {top: 60};
          obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 5;
          return obj;
      }
    'inside'

    Center position of the graphic element where the mouse is in, which is only valid when trigger is 'item'.

    'top'

    Top position of the graphic element where the mouse is in, which is only valid when trigger is 'item'.

    'left'

    Left position of the graphic element where the mouse is in, which is only valid when trigger is 'item'.

    'right'

    Right position of the graphic element where the mouse is in, which is only valid when trigger is 'item'.

    'bottom'

    Bottom position of the graphic element where the mouse is in, which is only valid when trigger is 'item'.
  */
  position: any | any[];
  // https://ecomfe.github.io/echarts-doc/public/en/option.html#tooltip.formatter
  formatter: any;
  backgroundColor: string;
  borderColor: string;
  borderWidth: number;
  padding: number;
  textStyle: WidgetStyleOptions;
  /*
    Extra CSS style for floating layer. The following is an example for adding shadow.
    extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);'
  */
  extraCssText: string;
}

export class WidgetTitle {
  id: string;
  show = true;
  text: string;
  link: string;
  target: string;
  subtext: string;
  sublink: string;
  subtarget: string;
  textStyle: WidgetStyleOptions = new WidgetStyleOptions();
  subTextStyle: WidgetStyleOptions = new WidgetStyleOptions();
  padding: number | number[];
  itemGap: number;
  left: any;
  top: any;
  right: any;
  botttom: any;
  backgroundColor: string;
  borderColor: string;
  borderWidth: number;
  borderRadius: number | number[];
  shadowBlur: number;
  shadowColor: string;
  shadowOffsetX: number;
  shadowOffsetY: number;
}

export class WidgetStyleOptions {
  color: string;
  backgroundColor: string;
  fontStyle = 'normal';
  fontWeight = 'normal';
  fontFamily = 'sans-serif';
  fontSize: number;
  // should take values [left, center, right]
  align: string;
  // should take values [top, middle, bottom]
  verticalAlign: string;
  lineHeight: string;
  width: string;
  height: string;
  borderColor: string;
  borderWidth: number;
  shadowColor: string;
  shadowBlur: number;
  shadowOffsetX: string;
  shadowOffsetY: string;
}

export class WidgetLegend {
  // two types [plain, scroll]
  id: string;
  type: string;
  show: boolean;
  zlevel: number;
  left: string;
  top: string;
  right: string;
  bottom: string;
  width: string;
  height: string;
  // orientation [horizontal, vertical]
  orient: string;
  align: string;
  padding: number;
  itemGap: number;
  itemWidth: number;
  itemHeight: number;
  formatter: any;
  // Selected mode of legend, which controls whether series can be toggled displaying by clicking legends
  // It is enabled by default, and you may set it to be false to disabled it.
  // It can be set to 'single' or 'multiple', for single selection and multiple selection.
  selectedMode: string | boolean = true;
  inactiveColor: string;
  selected: any;
  textStyle: WidgetStyleOptions;
  backgroundColor: string;
  borderColor: string;
  borderWidth: number;
  borderRadius: number;
  shadowBlur: number;
  shadowColor: string;
  shadowOffsetX: number;
  shadowOffsetY: number;
  scrollDataIndex: number;
  // It works when legend.type is 'scroll'.
  // The gap between page buttons and page info text.
  pageButtonItemGap: number;
  // It works when legend.type is 'scroll'.
  // The gap between page buttons and legend items.
  pageButtonGap: number;
  // It works when legend.type is 'scroll'.
  // The position of page buttons and page info
  // start: positions buttons left or top
  // end: positions buttons right or bottom
  pageButtonPosition: string;
  // It works when legend.type is 'scroll'.
  // default is '{current}/{total}'
  pageFormatter: string;
  // Whether to use animation when page scroll
  animation: boolean;
  // Duration of page animation
  animationDurationUpdate: number;
}

export class WidgetGrid {
  id: string;
  show: boolean;
  zlevel: 0;
  left: string;
  top: string;
  right: string;
  bottom: string | number;
  width: string;
  height: string;
  containLabel: boolean;
  backgroundColor: string;
  borderWidth: number;
  shadowBlur: number;
  shadowColor: string;
  shadowOffsetX: number;
  shadowOffsetY: number;
}

export class WidgetAxis {
  id: string;
  show: boolean;
  gridIndex: number;
  // position of x axis options top, bottom in case of X axis
  position: string;
  // for xAxis: Offset of x axis relative to default position. Useful when multiple x axis has same position value.
  offset: number;
  // type of axis options [value, category, time, log]
  // 'value' Numerical axis, suitable for continuous data.
  // 'category' Category axis, suitable for discrete category data.
  //            Data should only be set via data for this type.
  //  'time'    Time axis, suitable for continuous time series data.
  //            As compared to value axis, it has a better formatting for time and a different tick calculation method.
  //            For example, it decides to use month, week, day or hour for tick based on the range of span.
  // 'log' Log axis, suitable for log data.
  type: string;
  // Name of axis.
  name: string;
  // location of axis name options [start, middle, center, end]
  nameLocation: string;
  nameTextStyle: WidgetStyleOptions;
  // Gap between axis name and axis line.
  nameGap: number;
  // Rotation of axis name.
  nameRotate: number;
  // Whether axis is inversed.
  inverse: boolean;
  /*
  The boundary gap on both sides of a coordinate axis.
  The setting and behavior of category axes and non-category axes are different.
  The boundaryGap of category axis can be set to either true or false.
  Default value is set to be true, in which case axisTick is served only as a separation line,
  and labels and data appear only in the center part of two axis ticks, which is called band.
  For non-category axis, including time, numerical value, and log axes, boundaryGap is an array of two values,
  representing the spanning range between minimum and maximum value.
  The value can be set in numeric value or relative percentage, which becomes invalid after setting min and max.
  Example:
  boundaryGap: ['20%', '20%']
  */
  boundaryGap: any[] | boolean;
  /*
  [ default: null ]
  The minimun value of axis.
  It can be set to a special value 'dataMin' so that the minimum value on this axis is set to be the minimum label.
  It will be automatically computed to make sure axis tick is equally distributed when not set.
  In category axis, it can also be set as the ordinal number.
  For example, if a catergory axis has data: ['categoryA', 'categoryB', 'categoryC'],
  and the ordinal 2 represents 'categoryC'. Moreover, it can be set as negative number, like -3.
  */
  min: number | string;
  /*[ default: null ]
    The maximum value of axis.
    It can be set to a special value 'dataMax' so that the minimum value on this axis is set to be the maximum
    label.
    It will be automatically computed to make sure axis tick is equally distributed when not set.
    In category axis, it can also be set as the ordinal number.
    For example, if a catergory axis has data: ['categoryA', 'categoryB', 'categoryC'],
    and the ordinal 2 represents 'categoryC'. Moreover, it can be set as negative number, like -3.
  */
  max: number | string;
  /*
    [ default: false ]
    It is available only in numerical axis, i.e., type: 'value'.
    It specifies whether not to contain zero position of axis compulsively.
    When it is set to be true, the axis may not contain zero position,
    which is useful in the scatter chart for both value axes.
    This configuration item is unavailable when the min and max are set.
  */
  scale: boolean;
  /*
    [ default: 5 ]
    Number of segments that the axis is split into.
    Note that this number serves only as a recommendation,
    and the true segments may be adjusted based on readability.
    This is unavailable for category axis.
  */
  splitNumber: number;
  /*
    Maximum gap between split lines.
    For example, in time axis (type is 'time'), it can be set to be 3600 * 24 * 1000
    to make sure that the gap between axis labels is less than or equal to one day.
    {
      maxInterval: 3600 * 1000 * 24
    }
    It is available only for axis of type 'value' or 'time'.
  */
  minInterval: number;
  /*
    [ default: 10 ]
    Base of logarithm, which is valid only for numeric axes with type: 'log'.
  */
  logBase: number;
  /*
  [ default: false ]
  Whether the labels of axis triggers and reacts to mouse events.
  Parameters of event includes:
  {
      // Component type: xAxis, yAxis, radiusAxis, angleAxis
      // Each of which has an attribute for index, e.g., xAxisIndex for xAxis
      componentType: string,
      // Value on axis before being formatted.
      // Click on value label to trigger event.
      value: '',
      // Name of axis.
      // Click on laben name to trigger event.
      name: ''
  }
  */
  triggerEvent: boolean;
  axisLine: WidgetAxisLine = new WidgetAxisLine();
  axisTick: WidgetAxisTick;
  axisLabel: WidgetAxisLabel = new WidgetAxisLabel();
  splitLine: WidgetSplitLine;
  splitArea: WidgetSplitArea;
  data: WidgetDataItem[];
  axisPointer: WidgetAxisPointer;
  // zlevel is used to make layers with Canvas. Graphical elements with different zlevel values
  // will be placed in different Canvases, which is a common optimization technique.
  // We can put those frequently changed elements (like those with animations)
  // to a seperate zlevel. Notice that too many Canvases will increase memory cost,
  // and should be used carefully on mobile phones to avoid crash.
  zlevel: number;
  // z value of all graghical elements in x axis, which controls order of drawing graphical components.
  // Components with smaller z values may be overwritten by those with larger z values.
  // z has a lower priority to zlevel, and will not create new Canvas.
  z: number;
}

export class WidgetAxisLine {
  show: boolean;
  // [ default: true ]
  // Specifies whether X or Y axis lies on the other's origin position,
  // where value is 0 on axis. Valid only if the other axis is of value type, and contains 0 value.
  onZero: boolean;
  // When mutiple axes exists, this option can be used to specify which axis can be "onZero" to.
  onZeroAxisIndex: boolean;
  /*
    [ default: 'none' ]
    Symbol of the two ends of the axis. It could be a string,
    representing the same symbol for two ends; or an array with two string elements,
    representing the two ends separately. It's set to be 'none' by default, meaning no arrow for either end.
    If it is set to be 'arrow', there shall be two arrows.
    If there should only one arrow at the end, it should set to be ['none', 'arrow'].
  */
  symbol: 'none';
  /*
    [ default: [10, 15] ]
    Size of the arrows at two ends. The first is the width perpendicular to the axis,
    the next is the width parallel to the axis.
  */
  symbolSize: any[];
  /*
    [ default: [0, 0] ]
    Arrow offset of axis. If is array, the first number is the offset of the arrow at the beginning,
    and the second number is the offset of the arrow at the end. If is number, it means the arrows have
    the same offset.
  */
  symbolOffset: any[] | number;
  lineStyle: WidgetLineStyle = new WidgetLineStyle();
}

export class WidgetLineStyle {
  color: string;
  width: number;
  // default 'solid' options [solid, dashed, dotted]
  type: string;
  /*
    Size of shadow blur. This attribute should be used along with shadowColor,shadowOffsetX, shadowOffsetY to set shadow to component.
    For example:
    {
        shadowColor: 'rgba(0, 0, 0, 0.5)',
        shadowBlur: 10
    }
  */
  shadowBlur: number;
  shadowColor: string;
  shadowOffsetX: number;
  shadowOffsetY: number;
  // Opacity of the component. Supports value from 0 to 1, and the component will not be drawn when set to 0.
  opacity: number;
}

export class WidgetAxisTick {
  show: boolean;
  alignWithLabel: boolean;
  interval: string;
  // Specifies whether the axis label faces Inside. False by default.
  inside: boolean;
  // The length of the axis tick.
  length: number;
  lineStyle: WidgetLineStyle;
}

export class WidgetAxisLabel {
  show: boolean;
  interval: number | string;
  // Specifies whether the axis label faces Inside. False by default.
  inside: boolean;
  /*
    [ default: 0 ]
    Rotation degree of axis label, which is especially useful when there is no enough space for category axis.
    Rotation degree is from -90 to 90.
  */
  rotate: number;
  // [ default: 8 ]
  // The margin between the axis label and the axis line.
  margin: number;
  /*
    [ default: null ]
    Formatter of axis label, which supports string template and callback function.
    Example:
    // Use string template; template variable is the default label of axis {value}
    formatter: '{value} kg'
    // Use callback function; function parameters are axis index
    formatter: function (value, index) {
      // Formatted to be month/day; display year only in the first label
      var date = new Date(value);
      var texts = [(date.getMonth() + 1), date.getDate()];
      if (idx === 0) {
          texts.unshift(date.getYear());
      }
      return texts.join('/');
    }
  */
  formatter: any;
  // Whether to show the label of the min tick. Optional values: true, false, null.
  // It is auto determined by default, that is, if labels are overlapped, the label of the min tick will not be displayed.
  showMinLabel: boolean;
  // Whether to show the label of the max tick. Optional values: true, false, null.
  // It is auto determined by default, that is, if labels are overlapped,
  // the label of the max tick will not be displayed.
  showMaxLabel: boolean;
  /*
    Color of axis label is set to be axisLine.lineStyle.color by default. Callback function is supported, in the following format:
    (val: string) => Color
    Parameter is the text of label, and return value is the color. See the following example:
    textStyle: {
      color: function (value, index) {
        return value >= 0 ? 'green' : 'red';
      }
    }
  */
  color: any;
  // options are [normal, italic, oblique]
  fontStyle: string;
  fontWeight: string;
  fontFamily: string;
  fontSize: number;
  // Horizontal alignment of text options are [left, center, right]
  align: string;
  // Vertical alignment of text options [top, middle, bottom]
  verticalAlign: string;
  lineHeight: number;
  backgroundColor: string;
  borderColor: string;
  borderWidth: number;
  borderRadius: number | string;
  padding: number;
  shadowColor: string;
  shadowBlur: number;
  shadowOffsetX: number;
  shadowOffsetY: number;
  /*
  Width of the text block. It is the width of the text by default.
  In most cases, there is no need to specify it. You may want to use it in some cases like make simple table
  or using background image (see backgroundColor).
  Notice, width and height specifies the width and height of the content, without padding.
  width can also be percent string, like '100%',
  which represents the percent of contentWidth (that is, the width without padding) of its container box.
  It is based on contentWidth because that each text fregment is layout based on the content box,
  where it makes no sense that calculating width based on outerWith in prectice.
  Notice, width and height only work when rich specified.
  */
  width: number | string;
  /*
    Height of the text block. It is the width of the text by default.
    You may want to use it in some cases like using background image (see backgroundColor).
    Notice, width and height specifies the width and height of the content, without padding.
    Notice, width and height only work when rich specified.
  */
  height: number | string;
  textBorderColor: string;
  textBorderWidth: number;
  textShadowColor: string;
  textShadowBlur: number;
  textShadowOffsetX: number;
  textShadowOffsetY: number;
}

export class WidgetSplitLine {
  show: boolean;
  interval: string;
  lineStyle: WidgetLineStyle;
}

export class WidgetSplitArea {
  interval: string;
  show: boolean;
  areaStyle: WidgetAreaStyle;
}

export class WidgetAreaStyle {
  /*
    [ default: ['rgba(250,250,250,0.3)','rgba(200,200,200,0.3)'] ]
    Color of split area. SplitArea color could also be set in color array,
    which the split lines would take as their colors in turns. Dark and light colors in turns are used by default.
  */
  color: string[];
  shadowBlur: number;
  shadowColor: string;
  shadowOffsetX: number;
  shadowOffsetY: number;
  // Opacity of the component. Supports value from 0 to 1, and the component will not be drawn when set to 0.
  opacity: number;
}

export class WidgetDataItem {
  // Name of a category
  value: string;
  textStyle: WidgetStyleOptions;
}

export class WidgetAxisPointer {
  // axisPointer will not be displayed by default. But iftooltip.trigger is set as 'axis' or
  // tooltip.axisPointer.type is set as 'cross', axisPointer will be displayed automatically.
  // Each coordinate system will automatically chose the axes whose will display its axisPointer.
  // tooltip.axisPointer.axis can be used to change the choice.
  show: boolean;
  // indicator type options [line, shadow]
  type: string;
  // Whether snap to point automatically. The default value is auto determined.
  // This feature usually makes sense in value axis and time axis, where tiny points can be seeked automatically.
  snap: boolean;
  // z value, which controls order of drawing graphical components.
  // Components with smaller z values may be overwritten by those with larger z values.
  z: number;
  label: WidgetLabel;
  lineStyle: WidgetLineStyle;
  shadowStyle: WidgetShadowStyle;
  // Whether to trigger tooltip.
  triggerTooltip: boolean;
  // current value. When using axisPointer.handle, value can be set to define the initail position of axisPointer.
  value: number;
  // options [show, hide]
  status: boolean | string;
  handle: WidgetHandle;
}

export class WidgetLabel {
  show: boolean;
  precision: string;
  /*
    [ default: null ]
    The formatter of label.
    If set as string, for example it can be: formatter: 'some text {value} some text,
    where {value} will be replaced by axis value automatically.
    If set as function:
    Parameters:
    {Object} params: Including fields as follows:
    {Object} params.value: current value of this axis. If axis.type is 'category',
    it is one of the value in axis.data. If axis.type is 'time', it is a timestamp.
    {Array.<Object>} params.seriesData: An array, containing info of nearest points. Each item is:
    {
      componentType: 'series',
      // Series type
      seriesType: string,
      // Series index in option.series
      seriesIndex: number,
      // Series name
      seriesName: string,
      // Data name, or category name
      name: string,
      // Data index in input data array
      dataIndex: number,
      // Original data as input
      data: Object,
      // Value of data
      value: number|Array,
      // Color of data
      color: string,
    }
    Each item also includes axis infomation:

    {
      axisDim: 'x', // 'x', 'y', 'angle', 'radius', 'single'
      axisId: 'xxx',
      axisName: 'xxx',
      axisIndex: 3,
      axisValue: 121, // The current value of axisPointer
      axisValueLabel: 'text of value'
    }
    Return:
    The string to be displayed.
    For example:
    formatter: function (params) {
      // If axis.type is 'time'
      return 'some text' + echarts.format.formatTime(params.value);
    }
  */
  formatter: any;
  margin: boolean | number;
  color: string;
  // options [normal, italic, oblique]
  fontStyle: string;
  // options [normal, bold bolder, lighter]
  fontWeight: string;
  fontFamily: string;
  fontSize: number;
  lineHeight: number;
  width: number | string;
  height: number | string;
  textBorderColor: string;
  textBorderWidth: number;
  textShadowColor: string;
  textShadowBlur: number;
  textShadowOffsetX: number;
  textShadowOffsetY: number;
  padding: string | string[];
  backgroundColor: string;
  borderColor: string;
  borderWidth: string;
  shadowBlur: number;
  shadowColor: string;
  shadowOffsetX: number;
  shadowOffsetY: number;
}

export class WidgetShadowStyle {
  // fill color
  color: string;
  shadowBlur: number;
  shadowColor: string;
  shadowOffsetX: number;
  shadowOffsetY: number;
  opacity: number;
}

export class WidgetHandle {
  show: boolean;
  /*
    The icon of the handle.
    It can be set to an image with 'image://url' , in which URL is the link to an image, or dataURI of an image.
  */
  icon: any;
  // [ default: 45 ]
  // The size of the handle, which can be set as a single value or an array ([width, height]).
  size: number | number[];
  // [ default: 50 ]
  // Distance from handle center to axis.
  margin: number;
  // Handle Color
  color: string;
  // [ default: 40 ]
  // Throttle rate of trigger view update when dragging handle, in ms.
  // Increase the value to improve performance, but decrease the experience.
  throttle: number;
  shadowBlur: number;
  shadowwColor: string;
  shadowOffsetX: number;
  shadowOffsetY: number;
}

export class WidgetItemStyle {
  color: string;
  borderColor: string;
  borderWidth: number;
  borderType: string;
  shadowBlur: number;
  shadowColor: string;
  shadowOffsetX: number;
  shadowOffsetY: number;
  // Opacity of the component. Supports value from 0 to 1, and the component will not be drawn when set to 0.
  opacity: number;
}


export class WidgetSeries {
  // Component ID, not specified by default. If specified, it can be used to refer the component in option or API.
  id: string;
  type: string;
  // Series name used for displaying in tooltip and filtering with legend, or updaing data and configuration
  name: string;
  // The coordinate used in the series , options [cartesian2d, polar]
  coordinateSystem: string;
  // Index of x axis to combine with, which is useful for multiple x axes in one chart.
  xAxisIndex: number;
  // Index of y axis to combine with, which is useful for multiple y axes in one chart.
  yAxisIndex: number;
  // Whether to enable highlighting chart when legend is being hovered.
  legendHoverLink: boolean;
  label: WidgetLabel;
  itemStyle: WidgetItemStyle;
  emphasis: WidgetEmphasis;
  // If stack the value. On the same category axis,
  // the series with the same stack name would be put on top of each other.
  stack: string;
  // The mouse style when mouse hovers on an element, the same as cursor property in CSS.
  cursor: string;
  /*
   dimensions can be used to define dimension info for series.data or dataset.source.
   Notice: if dataset is used, we can provide dimension names in the first column/row of dataset.source,
   and not need to specify dimensions here. But if dimensions is specified here,
   will not retrieve dimension names from the first row/column of dataset.source any more. e.g.
   dimensions: [
        null,                // If you do not intent to defined this dimension, use null is fine.
        {type: 'ordinal'},   // Specify type of this dimension.
                             // 'ordinal' is always used in string.
                             // If type is not specified, echarts will guess type by data.
        {name: 'good', type: 'number'},
        'bad'                // Equals to {name: 'bad'}.
    ]
  */
  dimensions: any[];
  /*
    Define what is encoded to for each dimension of data. For example: e.g.
    option = {
        dataset: {
            source: [
                // Each column is called a dimension.
                // There are five dimensions: 0, 1, 2, 3, 4。
                [12, 44, 55, 66, 2],
                [23, 6, 16, 23, 1],
                ...
            ]
        },
        series: {
            type: 'xxx',
            encode: {
                x: [3, 1, 5],      // Dimension 3, 1, 5 is mapped to x axis.
                y: 2,              // Dimension 2 is mapped to y axis.
                tooltip: [3, 2, 4] // Dimension 3, 2, 4 will be displayed in tooltip.
            }
        }
    }
    When dimensions is used to defined name for a certain dimension, encode can refer the name directly. e.g.
    series: {
        type: 'xxx',
        dimensions: ['date', 'open', 'close', 'highest', 'lowest'],
        encode: {
            x: 'date',
            y: ['open', 'close', 'highest', 'lowest']
        }
    }
  */
  encode: any;
  // When dataset is used, seriesLayoutBy specifies whether the column or the
  // row of dataset is mapped to the series, namely, the series is "layout" on columns or rows
  // 'column': by default, the columns of dataset are mapped the series.
  //           In this case, each column represents a dimension.
  // 'row'：the rows of dataset are mapped to the series. In this case, each row represents a dimension.
  seriesLayoutBy: string;
  // If series.data is not specified, and dataset exists, the series will use dataset.
  // datasetIndex specifies which dataset will be used.
  datasetIndex: number;
  /*
    https://ecomfe.github.io/echarts-doc/public/en/option.html#series-line.data
    Data array of series, which can be in the following forms:
    Notice, if no data specified in series, and there is dataset in option,
    series will use the first dataset as its datasource.
    If data has been specified, dataset will not used.

    series.datasetIndex can be used to specify other dataset.
    Basically, data is represented by a two-dimension array, like the example below,
    where each colum is named as a "dimension".

    series: [{
        data: [
            // dimX   dimY   other dimensions ...
            [  3.4,    4.5,   15,   43],
            [  4.2,    2.3,   20,   91],
            [  10.8,   9.5,   30,   18],
            [  7.2,    8.8,   18,   57]
        ]
    }]
    - In cartesian (grid), "dimX" and "dimY" correspond to xAxis and yAxis repectively.
    - In polar "dimX" and "dimY" correspond to radiusAxis angleAxis repectively.
    - Other dimensions are optional, which can be used in other place. For example:
      - visualMap can map one or more dimensions to viusal (color, symbol size ...).
      - series.symbolSize can be set as a callback function, where symbol size can be calculated by values of a certain dimension.
      - Values in other dimensions can be shown by tooltip.formatter or series.label.formatter.
    Especially, when there is one and only one category axis (axis.type is 'category'),
    data can be simply be represented by a one-dimension array, like:
    xAxis: {
        data: ['a', 'b', 'm', 'n']
    },
    series: [{
        // Each item corresponds to each item in xAxis.data.
        data: [23,  44,  55,  19]
        // In fact, it is the simplification of the format below:
        // data: [[0, 23], [1, 44], [2, 55], [3, 19]]
    }]
  */
  data: any;
  markPoint: WidgetMarkPoint;
  markLine: WidgetMarkLine;
  markArea: WidgetMarkArea;
  zlevel: number;
  z: number;
  silent: boolean;
  animation: boolean;
  animationThreshold: number;
  animationDuration: number;
  // https://ecomfe.github.io/echarts-doc/public/en/option.html#series-line.markPoint.animationEasing
  // Easing method used for the first animation. Varied easing effects can be found at easing effect example.
  animationEasing: string;
  animationDelay: any;
  animationDurationUpdate: any;
  animationEasingUpdate: string;
  animationDelayUpdate: any;
  tooltip: WidgetTooltip;
}

export class WidgetBarSeries extends WidgetSeries {
    barWidth: number;
    barMaxWidth: number;
    barMinHeight: number;
    /*
      The gap between bars between different series, is a percent value like '30%',
      which means 30% of the bar width.
      Set barGap as '-100%' can overlap bars that belong to different series,
      which is useful when making a series of bar be background.

      In a single coodinate system, this attribute is shared by multiple 'bar' series.
      This attribute should be set on the last 'bar' series in the coodinate system,
      then it will be adopted by all 'bar' series in the coordinate system.

    */
    barGap: string;
    /*
    [ default: '20%' ]
      The bar gap of a single series, defaults to be 20% of the category gap, can be set as a fixed value.
      In a single coodinate system, this attribute is shared by multiple 'bar' series.
      This attribute should be set on the last 'bar' series in the
      coodinate system, then it will be adopted by all 'bar' series in the coordinate system.
    */
    barCategoryGap: string;
    // Whether to enable the optimization of large-scale data.
    // It could be set when large data causes performance problem.
    large: boolean;
    largeThreshold: number;
    progressive: number;
    progressiveThreshold: number;
    progressiveChunkMode: number;
}

export class WidgetLineSeries extends WidgetSeries {
  // Index of polar coordinate to combine with, which is useful for multiple polar axes in one chart.
  polarIndex: number;
   // [ default: 'circle' ]
  // Icon types provided  'circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow'
  // An image url could be specified or a datauri
  symbol: string;
  // symbol size. It can be set to single numbers like 10, or use an array to
  // represent width and height. For example, [20, 10] means symbol width is 20, and height is10.
  // If size of symbols needs to be different, you can set with callback function in the following format:
  // (value: Array|number, params: Object) => number|Array
  symbolSize: any;
  // otate degree of symbol. Note that when symbol is set to be 'arrow' in markLine,
  /// symbolRotate value will be ignored, and compulsively use tangent angle.
  symbolRotate: number;
  // Whether to keep aspect for symbols in the form of path://
  symbolKeepAspect: boolean;
  /*
    Offset of symbol relative to original position. By default,
    symbol will be put in the center position of data. But if symbol is from user-defined vector path or image,
    you may not expect symbol to be in center. In this case, you may use this attribute to set offset to default position.
    It can be in absolute pixel value, or in relative percentage value.
    For example, [0, '50%'] means to move upside side position of symbol height.
    It can be used to make the arrow in the bottom to be at data position when symbol is pin.
  */
  symbolOffset: any[];
  showSymbol: boolean;
  // Only work when main axis is 'category' axis (axis.type is 'category'). Optional values:
  // 'auto': Default value. Show all symbols if there is enough space.
  //         Otherwise follow the interval strategy with with axisLabel.interval.
  // true: Show all symbols.
  // false: Follow the interval strategy with axisLabel.interval.
  showAllSymbol: boolean;
  hoverAnimation: boolean;
  lineStyle: WidgetLineStyle;
  areaStyle: WidgetAreaStyle;
  // Whether to connect the line across null points
  connectNumms: boolean;
  // Whether to clip the overflowing part, which defaults to clip.
  clipOverflow: boolean;
  // Whether to show as a step line. It can be true, false.
  // Or 'start', 'middle', 'end'. Which will configure the turn point of step line.
  step: string | boolean;
  // Whether to show as smooth curve
  // If is typed in boolean, then it means whether to enable smoothing.
  // If is typed in number, valued from 0 to 1, then it means smoothness. A smaller value makes it less smooth.
  smooth: boolean | number;
  smoothMonotone: string;
  // The dowmsampling strategy used when the data size is much larger than pixel size.
  // It will improve the performance when turned on. Defaults to be turned off,
  // indicating that all the data points will be drawn.
  // options [average, max, min, sum]
  sampling: string;
}

export class WidgetPieSeries extends WidgetSeries {
  selectedMode: boolean;
  selectedOffset: 10;
  clockWise: boolean;
  startAngle: number;
  minAngle: 0;
 /* [ default: false ]
  Whether to show as Nightingale chart, which distinguishs data through radius. There are 2 optional modes:

  'radius' Use central angle to show the percentage of data, radius to show data size.
  'area' All the sectors will share the same central angle, the data size is shown only through radiuses.
  */
  roseType: boolean | string;
  avoidLabelOverlap: boolean;
  // [ default: true ]
  // hether to show sector when all data are zero.
  stillShowZeroSum: boolean;
  labelLine: WidgetLabelLine;
  center: any[];
  radius: any[];

}

export class WidgetLinesStyle extends WidgetSeries {
  // Index of geographic coordinate to combine with, which is useful for multiple geographic axes in one chart.
  geoIndex: number;
  polyline: boolean;
  large: boolean;
  largeThreshold: number;
  symbol: any;
  symbolSize: number | any[];
  lineStyle: WidgetLineStyle;
  progressive: number;
  progressiveThreshold: number;
}

export class WidgetGaugeSeries extends WidgetSeries {
  radius: any;
  startAngle: number;
  endAngle: number;
  clockwise: boolean;
  min: number;
  max: number;
  splitNumber: number;
  axisLine: WidgetAxisLine;
  splitLine: WidgetSplitLine;
  axisTick: WidgetAxisTick;
  axisLabel: WidgetAxisLabel;
  pointer: WidgetPointer;
  title: WidgetSeriesTitle;
  detail: WidgetSeriesTitle;
}

export class WidgetFunnelSeries extends WidgetSeries {
  min: number;
  max: number;
  minSize: string;
  maxSize: string;
  sort: string;
  gap: number;
  funnelAlign: string;
  labelLine: WidgetLabelLine;
}

export class WidgetSeriesTitle {
  show: boolean;
  offsetCenter: any[];
  color: string;
  fontStyle: string;
  fontWeight: string;
  fontFamily: string;
  fontSize: number;
  lineHeight: number;
  backgroundColor: string;
  borderColor: string;
  borderWidth: number;
  borderRadius: number;
  padding: any;
  shadowColor: string;
  shadowBlur: number;
  shadowOffsetX: number;
  shadowOffsetY: number;
  width: any;
  height: any;
  textBorderColor: string;
  textBorderWidth: number;
  textShadowColor: string;
  textShadowBlur: number;
  textShadowOffsetX: number;
  textShadowOffsetY: number;
}
export class WidgetPointer {
  show: boolean;
  length: any;
  width: number;
}

export class WidgetLabelLine {
  show: boolean;
  length: number;
  length2: number;
  smooth: boolean;
  lineStyle: WidgetLineStyle;
  emphasis: WidgetEmphasis;
}

export class WidgetEmphasis {
  label: WidgetLabel;
  itemStyle: WidgetItemStyle;
}

// Mark a point in the chart
export class WidgetMarkPoint {
  // Icon types provided by ECharts includes 'circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow'
  // It can be set to an image with 'image://url' , in which URL is the link to an image, or dataURI of an image.
  symbol: string;
  symbolSize: any;
  symbolRotate: number;
  symbolKeepAspect: boolean;
  symbolOffset: any[];
  // Whether to ignore mouse events. Default value is false, for triggering and responding to mouse events.
  silent: boolean;
  label: WidgetLabel;
  itemStyle: WidgetItemStyle;
  data: any;
  animation: boolean;
  animationThreshold: number;
  animationDuration: number;
  // https://ecomfe.github.io/echarts-doc/public/en/option.html#series-line.markPoint.animationEasing
  // Easing method used for the first animation. Varied easing effects can be found at easing effect example.
  animationEasing: string;
  animationDelay: any;
  animationDurationUpdate: any;
  animationEasingUpdate: string;
  animationDelayUpdate: any;
}

export class WidgetMarkLine {
  silent: boolean;
  symbol: any;
  symbolSize: any;
  precision: number;
  label: WidgetLabel;
  lineStyle: WidgetLineStyle;
  data: any;
  animation: boolean;
  animationThreshold: number;
  animationDuration: number;
  // https://ecomfe.github.io/echarts-doc/public/en/option.html#series-line.markPoint.animationEasing
  // Easing method used for the first animation. Varied easing effects can be found at easing effect example.
  animationEasing: string;
  animationDelay: any;
  animationDurationUpdate: any;
  animationEasingUpdate: string;
  animationDelayUpdate: any;
}

export class WidgetMarkArea {
  silent: boolean;
  label: WidgetLabel;
  itemStyle: WidgetItemStyle;
  data: any;
  animation: boolean;
  animationThreshold: number;
  animationDuration: number;
  // https://ecomfe.github.io/echarts-doc/public/en/option.html#series-line.markPoint.animationEasing
  // Easing method used for the first animation. Varied easing effects can be found at easing effect example.
  animationEasing: string;
  animationDelay: any;
  animationDurationUpdate: any;
  animationEasingUpdate: string;
  animationDelayUpdate: any;
}
