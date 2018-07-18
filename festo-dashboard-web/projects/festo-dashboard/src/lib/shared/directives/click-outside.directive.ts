import {Directive, ElementRef, Output, EventEmitter, HostListener} from '@angular/core';
declare var $: any;
@Directive({
    selector: '[clickOutside]'
})
export class ClickOutsideDirective {
    constructor(private _elementRef: ElementRef) {
    }

    @Output()
    public clickOutside = new EventEmitter<MouseEvent>();

    @HostListener('document:click', ['$event', '$event.target'])
    public onClick(event: MouseEvent, targetElement: HTMLElement): void {
        if (!targetElement) {
            return;
        }

        let clickedInside = this._elementRef.nativeElement.contains(targetElement);
        if (!clickedInside) {
          const element = document.getElementById(this._elementRef.nativeElement.getAttribute('data-widget-settings'));
          if (element) {
            clickedInside = element.contains(targetElement);
          }

          if (!clickedInside) {
            clickedInside = targetElement.classList.contains('ng-option-label') || targetElement.classList.contains('ng-option');
          }
        }
        if (!clickedInside) {
            this.clickOutside.emit(event);

        }
    }
}
