import { Directive, ElementRef } from '@angular/core';

@Directive({
    selector: '[ngxWidgetToggle]'
})
export class NgxWidgetToggleDirective {
    /**
     * Constructor
     *
     * @param {ElementRef} elementRef
     */
    constructor(public elementRef: ElementRef) { }
}
