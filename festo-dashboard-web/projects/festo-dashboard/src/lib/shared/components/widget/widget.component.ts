import { getWidgetState } from './../../../reducers/index';
import { Widget } from './../../../models/widget';
import { AfterContentInit,
  Component,
  ContentChildren,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ElementRef,
  HostBinding,
  QueryList,
  Renderer2,
  Input,
  Output,
  OnChanges,
  ViewEncapsulation } from '@angular/core';
import { FestoWidgetToggleDirective } from './widget-toggle.directive';
import * as widgetActions from './../../../actions/widget.action';
import * as fromWidget from './../../../reducers/widget';
import { Store, select } from '@ngrx/store';

import { Observable, BehaviorSubject } from 'rxjs';
@Component({
  selector     : 'festo-widget',
  templateUrl  : './widget.component.html',
  styleUrls    : ['./widget.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class FestoWidgetComponent implements AfterContentInit, OnChanges {

  @HostBinding('class.flipped')
  public get flipped(): boolean {
    if (!this.widget) {
      return false;
    }
    return this.widget.flipped;
  }

  @ContentChildren(FestoWidgetToggleDirective, {descendants: true})
  toggleButtons: QueryList<FestoWidgetToggleDirective>;

  _widget: BehaviorSubject<Widget> = new BehaviorSubject<Widget>(null);
  @Input()
  set widget(value: Widget) {
    this._widget.next(value);
  }

  get widget(): Widget {
    return this._widget.value;
  }

  isInitializedForGridStack = false;

  ngOnChanges(e) {

  }

  /**
     * Constructor
     *
     * @param {ElementRef} _elementRef
     * @param {Renderer2} _renderer
     * @param {ChangeDetectorRef} cd
     * @param {Store<fromWidget.WidgetState>} store
     */
    constructor(
      private _elementRef: ElementRef,
      private _renderer: Renderer2,
      private cd: ChangeDetectorRef,
      private store: Store<fromWidget.WidgetState>
  ) {

  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * After content init
   */
  ngAfterContentInit(): void {
      // Listen for the flip button click
      setTimeout(() => {
          this.toggleButtons.forEach(flipButton => {
              this._renderer.listen(flipButton.elementRef.nativeElement, 'click', (event) => {
                // event.preventDefault();
                  // event.stopPropagation();
                  this.toggle();
              });
          });
      });
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Toggle the flipped status
   */
  toggle(): void {
      // this.flipped = !this.flipped;
      this.store.dispatch(new widgetActions.FlipWidgetAction({id: this.widget.id, flipped: !this.widget.flipped}));
      this.cd.markForCheck();
  }

}
