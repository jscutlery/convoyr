import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, NgModule } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'http-ext-sign-in',
  template: `
    <form [formGroup]="form" class="form">
      <mat-form-field class="field">
        <mat-label>Login</mat-label>
        <input data-role="login" matInput formControlName="login" type="text" />
      </mat-form-field>
      <mat-form-field class="field">
        <mat-label>Password</mat-label>
        <input
          data-role="password"
          matInput
          formControlName="password"
          type="password"
        />
      </mat-form-field>
      <button
        data-role="signin-submit-button"
        mat-button
        color="primary"
        type="submit"
        (click)="signIn()"
      >
        Sign In
      </button>
      <div class="info">
        <div>Valid login: <code>demo</code></div>
        <div>Valid password: <code>demo</code></div>
      </div>
      <div *ngIf="error" class="error">
        Error:
        <pre><code>{{ error | json }}</code></pre>
      </div>
    </form>
  `,
  styles: [
    `
      .form {
        width: 300px;
        margin: 100px auto;
      }

      .form .field {
        width: 100%;
        display: block;
      }

      button {
        margin-top: 20px;
      }

      .info,
      .error {
        margin-top: 45px;
      }
    `
  ]
})
export class SigninComponent {
  error: any;
  form = new FormGroup({
    login: new FormControl('demo', [Validators.required]),
    password: new FormControl('demo', [Validators.required])
  });

  constructor(
    private auth: AuthService,
    private http: HttpClient,
    private router: Router
  ) {}

  signIn(): void {
    if (!this.form.valid) {
      return;
    }

    this.error = undefined;
    this.http
      .post<{ token: string }>(
        `${environment.apiBaseUrl}/tokens`,
        this.form.value
      )
      .subscribe({
        next: response => {
          this.auth.setToken(response.token);
          this.router.navigate(['/']);
        },
        error: response => (this.error = response.error)
      });
  }
}

@NgModule({
  declarations: [SigninComponent],
  exports: [SigninComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ]
})
export class SigninModule {}
