import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { environment } from '../../environments/environment';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'http-ext-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {
  error: any;
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      login: this.fb.control('', [Validators.required]),
      password: this.fb.control('', [Validators.required])
    });
  }

  signIn(): void {
    if (!this.form.valid) {
      return;
    }

    this.error = undefined;
    this.http
      .post<{ token: string }>(
        environment.apiBaseUrl + '/token',
        this.form.value
      )
      .subscribe({
        next: response => {
          this.auth.signIn(response.token);
          this.router.navigate(['users']);
        },
        error: response => (this.error = response.error)
      });
  }
}
