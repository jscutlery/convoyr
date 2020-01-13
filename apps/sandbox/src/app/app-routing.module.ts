import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BikeDetailComponent } from './bike-detail/bike-detail.component';
import { BikeSearchComponent } from './bike-search/bike-search.component';
import { ErrorComponent } from './error/error.component';

const routes: Routes = [
  { path: 'bikes', component: BikeSearchComponent },
  { path: 'bikes/:bikeId', component: BikeDetailComponent },
  { path: 'error', component: ErrorComponent },
  { path: '**', redirectTo: 'bikes' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
