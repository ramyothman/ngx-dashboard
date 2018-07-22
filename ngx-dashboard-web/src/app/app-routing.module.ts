import { NgxDataSourceComponent } from './../../projects/ngx-dashboard/src/lib/shared/components/datasources/datasources.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NgxDashboardComponent } from 'projects/ngx-dashboard/src/public_api';

const routes: Routes = [
  { path: 'dashboard', component: NgxDashboardComponent },
  { path: 'datasources', component: NgxDataSourceComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
