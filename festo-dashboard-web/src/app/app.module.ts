import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FestoDashboardModule } from './../../projects/festo-dashboard/src/lib/festo-dashboard.module';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    BrowserAnimationsModule,
    FestoDashboardModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
