import { GridStackModule } from 'ngx-grid-stack';
import { NgxDataSourceModule } from './shared/components/datasources/datasources.module';
import { DataSourceEffects } from './effects/datasource.effect';
import { DataSourceService } from './services/datasource.service';
import { NgxWidgetModule } from './shared/components/widget/widget.module';
import { DashboardService } from './services/dashboard.service';
import { WidgetService } from './services/widget.service';
import { environment } from './../../../../src/environments/environment.prod';
import { BaseApiService } from './services/base-api.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxDashboardComponent } from './ngx-dashboard.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {BrowserModule} from '@angular/platform-browser';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { StoreModule, MetaReducer } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { Observable, from } from 'rxjs';
import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import localeCs from '@angular/common/locales/cs';
import { reducers, AppState, metaReducers } from './reducers';
import { DashboardEffects } from './effects/dashboard.effect';
import { WidgetEffects } from './effects/widget.effect';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ModelService } from './services/model.service';
import {
  MatButtonModule,
  MatCheckboxModule,
  MatSidenavModule,
  MatTabsModule,
  MatIconModule,
  MatExpansionModule,
  MatFormFieldModule
} from '@angular/material';
registerLocaleData(localeDe);
registerLocaleData(localeCs);

export class HashTranslateLoader implements TranslateLoader {
  getTranslation(lang: string): Observable<any> {
    if (lang.indexOf('-')) {
      lang = lang.slice(0, 2);
    }
    return from(`../assets/i18n/${lang}.json`);
  }
}


@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    StoreModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useClass: HashTranslateLoader
      }
    }),
    StoreModule.forRoot(reducers, { metaReducers: metaReducers }),
    EffectsModule.forRoot([
      DashboardEffects,
      WidgetEffects,
      DataSourceEffects
    ]),
    StoreDevtoolsModule.instrument(),
    NgxWidgetModule,
    GridStackModule,
    FontAwesomeModule,
    MatButtonModule,
    MatCheckboxModule,
    MatSidenavModule,
    MatTabsModule,
    MatIconModule,
    MatExpansionModule,
    MatFormFieldModule,
    NgxDataSourceModule
  ],
  declarations: [NgxDashboardComponent],
  exports: [NgxDashboardComponent],
  providers: [BaseApiService, DashboardService, WidgetService, ModelService, DataSourceService]
})
export class NgxDashboardModule { }
