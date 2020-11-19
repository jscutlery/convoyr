import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { IsAuthenticatedGuard } from './auth/is-authenticated.guard';
import { IsNotAuthenticatedGuard } from './auth/is-not-authenticated.guard';
import { BikeDetailComponent } from './bike-detail/bike-detail.component';
import { BikeSearchComponent } from './bike-search/bike-search.component';
import { RetryComponent } from './retry/retry.component';
import { SigninComponent } from './signin/signin.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'bikes' },
  {
    path: '',
    canActivate: [IsNotAuthenticatedGuard],
    children: [{ path: 'signin', component: SigninComponent }],
  },
  {
    path: '',
    canActivate: [IsAuthenticatedGuard],
    children: [
      { path: 'bikes', component: BikeSearchComponent },
      { path: 'bikes/:bikeId', component: BikeDetailComponent },
      { path: 'retry', component: RetryComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
