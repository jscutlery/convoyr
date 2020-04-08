import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BikeDetailComponent } from './bike-detail/bike-detail.component';
import { BikeSearchComponent } from './bike-search/bike-search.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { ErrorComponent } from './error/error.component';
import { UsersComponent } from './users/users.component';

const routes: Routes = [
  { path: 'bikes', component: BikeSearchComponent },
  { path: 'bikes/:bikeId', component: BikeDetailComponent },
  { path: 'users', component: UsersComponent },
  { path: 'sign-in', component: SignInComponent },
  { path: 'error', component: ErrorComponent },
  { path: '**', redirectTo: 'bikes' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
