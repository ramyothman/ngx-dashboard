import { WidgetChartDirective } from './widget-charts/widget-chart.directive';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxWidgetComponent } from './widget.component';
import { NgxWidgetCardComponent } from './widget-card/widget-card.component';
import { WidgetChartsComponent } from './widget-charts/widget-charts.component';
import { NgxWidgetToggleDirective } from './widget-toggle.directive';
import {BrowserModule} from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgxEchartsModule } from 'ngx-echarts';
import { WidgetEChartsComponent } from './widget-charts/widget-echarts/widget-echarts.component';
import { ClickOutsideDirective } from '../../directives/click-outside.directive';
import { NgxWidgetSettingsComponent } from '../../components/widget/widget-settings/widget-settings.component';
import {
  NgxWidgetSettingDetailsComponent
} from '../../components/widget/widget-settings/widget-setting-details/widget-setting-details.component';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModelService } from './../../../services/model.service';
import {NgPipesModule} from 'ngx-pipes';
import {
  MatButtonModule,
  MatCheckboxModule,
  MatSidenavModule,
  MatTabsModule,
  MatIconModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatInputModule
} from '@angular/material';
import { WidgetSettingBindingComponent } from './widget-settings/widget-setting-binding/widget-setting-binding.component';
import { NgSelectModule } from '@ng-select/ng-select';
library.add(fas);

@NgModule({
    imports: [
      CommonModule,
      BrowserModule,
      BrowserAnimationsModule,
      FormsModule,
      ReactiveFormsModule,
      FontAwesomeModule,
      NgxEchartsModule,
      MatButtonModule,
      MatCheckboxModule,
      MatSidenavModule,
      MatTabsModule,
      MatIconModule,
      MatExpansionModule,
      MatFormFieldModule,
      MatInputModule,
      NgPipesModule,
      NgSelectModule
    ],
    declarations: [
      NgxWidgetComponent,
      NgxWidgetCardComponent,
      WidgetChartsComponent,
      WidgetEChartsComponent,
      NgxWidgetToggleDirective,
      WidgetChartDirective,
      ClickOutsideDirective,
      NgxWidgetSettingsComponent,
      NgxWidgetSettingDetailsComponent,
      WidgetSettingBindingComponent
    ],
    entryComponents: [ WidgetEChartsComponent ],
    providers: [ModelService],
    exports     : [
      NgxWidgetComponent,
      NgxWidgetCardComponent,
      WidgetChartsComponent,
      WidgetEChartsComponent,
      NgxWidgetToggleDirective,
      WidgetChartDirective,
      ClickOutsideDirective,
      NgxWidgetSettingsComponent
    ],
})

export class NgxWidgetModule {
}
