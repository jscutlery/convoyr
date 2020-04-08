import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IsSignedInGuard } from './auth/is-signed-in.guard';

import { BikeDetailComponent } from './bike-detail/bike-detail.component';
import { BikeSearchComponent } from './bike-search/bike-search.component';
import { ErrorComponent } from './error/error.component';
<<<<<<< HEAD
import { SignInComponent } from './sign-in/sign-in.component';
import { UsersComponent } from './users/users.component';
=======
import { SigninComponent } from './signin/signin.component';
>>>>>>> feat(sandbox): ✅ redirect to bikes after signin

const routes: Routes = [
  { path: 'signin', component: SigninComponent },
  { path: 'error', component: ErrorComponent },
<<<<<<< HEAD
  { path: '', redirectTo: 'bikes' },
=======
  { path: '', pathMatch: 'full', redirectTo: 'bikes' },
>>>>>>> feat(sandbox): ✅ redirect to bikes after signin
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
