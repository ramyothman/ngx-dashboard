import { FestoDataSourceComponent } from './../../projects/festo-dashboard/src/lib/shared/components/datasources/datasources.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FestoDashboardComponent } from 'projects/festo-dashboard/src/public_api';

const routes: Routes = [
  { path: 'dashboard', component: FestoDashboardComponent },
  { path: 'datasources', component: FestoDataSourceComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
