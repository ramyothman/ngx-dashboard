
import { DataSourceConnection } from './../../../models/datasources/data-source-connection';
import { LoadConnectionsAction } from './../../../actions/datasource.action';
import { Store, select } from '@ngrx/store';
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
  ViewEncapsulation,
  EventEmitter,
  OnInit} from '@angular/core';
import * as widgetActions from './../../../actions/widget.action';
import * as fromWidget from './../../../reducers/widget';
import * as datasourceActions from './../../../actions/datasource.action';
import * as fromDataSource from './../../../reducers/datasource';

import { Observable, BehaviorSubject } from 'rxjs';
import { DataSource } from '../../../models/datasources/data-source';
@Component({
  selector     : 'festo-data-sources',
  templateUrl  : './datasources.component.html',
  styleUrls    : ['./datasources.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class FestoDataSourceComponent implements OnInit {
  connections$: Observable<DataSourceConnection[]>;
  selectedConnection: DataSourceConnection;
  selectedSource: DataSource;
  @Output()
  closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  ngOnInit(): void {
    this.connections$ = this.store.pipe(select(fromDataSource.getConnections));
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

}
