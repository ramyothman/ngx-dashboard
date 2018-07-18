import { FestoCreateDataSourceComponent } from './create-datasource/create-datasource.component';
import { FestoDataSourceComponent } from './datasources.component';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModelService } from './../../../services/model.service';
import { NgPipesModule } from 'ngx-pipes';
import { NgSelectModule } from '@ng-select/ng-select';
import { ListboxModule } from 'primeng/listbox';
import { TabViewModule } from 'primeng/tabview';
import { SelectButtonModule } from 'primeng/selectbutton';
import { FilterPipe } from './../../pipes/filter.pipe';
import {TreeTableModule} from 'primeng/treetable';
import {TableModule} from 'primeng/table';
import {CheckboxModule} from 'primeng/checkbox';


import {
  MatButtonModule,
  MatCheckboxModule,
  MatSidenavModule,
  MatTabsModule,
  MatIconModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatInputModule,
  MatStepperModule,
  MatCommonModule
} from '@angular/material';
library.add(fas);

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    NgPipesModule,
    MatStepperModule,
    MatCommonModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatTabsModule,
    MatButtonModule,
    MatCheckboxModule,
    NgSelectModule,
    ListboxModule,
    TabViewModule,
    SelectButtonModule,
    TreeTableModule,
    TableModule,
    CheckboxModule
  ],
  declarations: [
    FestoDataSourceComponent,
    FestoCreateDataSourceComponent,
    FilterPipe
  ],
  providers: [ModelService],
  exports: [FestoDataSourceComponent, FestoCreateDataSourceComponent]
})
export class FestoDataSourceModule {}
