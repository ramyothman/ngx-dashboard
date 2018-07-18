import { WidgetChartDirective } from './widget-charts/widget-chart.directive';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FestoWidgetComponent } from './widget.component';
import { FestoWidgetCardComponent } from './widget-card/widget-card.component';
import { WidgetChartsComponent } from './widget-charts/widget-charts.component';
import { FestoWidgetToggleDirective } from './widget-toggle.directive';
import {BrowserModule} from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgxEchartsModule } from 'ngx-echarts';
import { WidgetEChartsComponent } from './widget-charts/widget-echarts/widget-echarts.component';
import { ClickOutsideDirective } from '../../directives/click-outside.directive';
import { FestoWidgetSettingsComponent } from '../../components/widget/widget-settings/widget-settings.component';
import {
  FestoWidgetSettingDetailsComponent
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
      FestoWidgetComponent,
      FestoWidgetCardComponent,
      WidgetChartsComponent,
      WidgetEChartsComponent,
      FestoWidgetToggleDirective,
      WidgetChartDirective,
      ClickOutsideDirective,
      FestoWidgetSettingsComponent,
      FestoWidgetSettingDetailsComponent,
      WidgetSettingBindingComponent
    ],
    entryComponents: [ WidgetEChartsComponent ],
    providers: [ModelService],
    exports     : [
      FestoWidgetComponent,
      FestoWidgetCardComponent,
      WidgetChartsComponent,
      WidgetEChartsComponent,
      FestoWidgetToggleDirective,
      WidgetChartDirective,
      ClickOutsideDirective,
      FestoWidgetSettingsComponent
    ],
})

export class FestoWidgetModule {
}
