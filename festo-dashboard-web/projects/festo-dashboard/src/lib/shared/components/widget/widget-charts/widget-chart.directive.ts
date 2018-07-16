import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[festoWidgetChart]',
})
export class WidgetChartDirective {
  constructor(public viewContainerRef: ViewContainerRef) { }
}
