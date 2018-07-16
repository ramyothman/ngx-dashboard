import { Directive, ElementRef } from '@angular/core';

@Directive({
    selector: '[festoWidgetToggle]'
})
export class FestoWidgetToggleDirective {
    /**
     * Constructor
     *
     * @param {ElementRef} elementRef
     */
    constructor(public elementRef: ElementRef) { }
}
