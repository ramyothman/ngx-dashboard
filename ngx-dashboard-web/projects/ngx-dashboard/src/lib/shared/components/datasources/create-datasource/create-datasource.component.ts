
import { DataSourceConnection } from './../../../../models/datasources/data-source-connection';
import { DataSource } from './../../../../models/datasources/data-source';
import { DATASOURCE_ACTIONS } from './../../../../actions/datasource.action';
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
  OnInit,
  EventEmitter} from '@angular/core';
import * as datasourceActions from './../../../../actions/datasource.action';

import * as fromDataSource from './../../../../reducers/datasource';


import { Observable, BehaviorSubject } from 'rxjs';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
declare var $: any;
@Component({
  selector     : 'ngx-create-data-sources',
  templateUrl  : './create-datasource.component.html',
  styleUrls    : ['./create-datasource.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class NgxCreateDataSourceComponent implements OnInit {
  connectionFormGroup: FormGroup;
  dataSourceFormGroup: FormGroup;
  connections$: Observable<DataSourceConnection[]>;
  selectedConnection: DataSourceConnection;
  selectedSources: DataSource[] = [];
  @Output()
  closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  sourceTypes = [
    {label: 'Table', value: 'table'},
    {label: 'View', value: 'view'},
    {label: 'Procedure', value: 'procedure'}
  ];

  sourceType = 'table';
  DATASOURCE_ACTIONS = DATASOURCE_ACTIONS;
  ngOnInit() {
    this.connectionFormGroup = this._formBuilder.group({

    });
    this.dataSourceFormGroup = this._formBuilder.group({

    });
    this.store.dispatch(new datasourceActions.LoadConnectionsAction());
    this.connections$ = this.store.pipe(select(fromDataSource.getConnections));
    this.connections$.subscribe((conn: DataSourceConnection[]) => {
      if (this.selectedConnection) {
        const index = conn.findIndex(w => w.id === this.selectedConnection.id);
        this.selectedConnection = conn[index];
        this.selectedSources.length = 0;
        for (const source of this.selectedConnection.dataSources) {
          if (source.selected) {
            this.selectedSources.push(source);
          }
        }
      }
    });
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
      private _formBuilder: FormBuilder,
      private store: Store<fromDataSource.DataSourceConnectionState>
  ) {

  }

  next(stepper: any, action: string) {
    switch (action) {
      case this.DATASOURCE_ACTIONS.LOAD_DATASOURCES:
        this.store.dispatch(new datasourceActions.LoadDataSourcesAction(this.selectedConnection.id));
        break;
      case 'finalize':
        const selectedIds: string[] = [];
        for (const source of this.selectedSources) {
          selectedIds.push(source.id);
        }
        this.store.dispatch(new datasourceActions.SelectDataSourceAction(
          {connectionId: this.selectedConnection.id, dataSourceId: selectedIds, selected: true}
        ));
        this.store.dispatch(new datasourceActions.LoadDataSourceColumnsAction(
          {id: this.selectedConnection.id, sources: this.selectedSources}
        ));
        this.closeModal.emit(true);
        break;
      default:
      break;
    }

    stepper.next();
  }

}
