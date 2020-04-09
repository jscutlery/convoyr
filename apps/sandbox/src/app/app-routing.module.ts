import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { IsSignedInGuard } from './auth/is-signed-in.guard';
import { IsUnsignedInGuard } from './auth/is-unsigned-in.guard';
import { BikeDetailComponent } from './bike-detail/bike-detail.component';
import { BikeSearchComponent } from './bike-search/bike-search.component';
import { ErrorComponent } from './error/error.component';
import { SigninComponent } from './signin/signin.component';
import { UsersComponent } from './users/users.component';

const routes: Routes = [
  { path: 'error', component: ErrorComponent },
  { path: '', pathMatch: 'full', redirectTo: 'bikes' },
  {
    path: '',
    canActivate: [IsUnsignedInGuard],
    children: [{ path: 'signin', component: SigninComponent }]
  },
  {
    path: '',
    canActivate: [IsSignedInGuard],
    children: [
      { path: 'bikes', component: BikeSearchComponent },
      { path: 'bikes/:bikeId', component: BikeDetailComponent },
      { path: 'users', component: UsersComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
