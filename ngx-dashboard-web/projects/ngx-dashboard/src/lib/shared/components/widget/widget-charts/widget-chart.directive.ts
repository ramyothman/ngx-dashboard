import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[ngxWidgetChart]',
})
export class WidgetChartDirective {
  constructor(public viewContainerRef: ViewContainerRef) { }
}
