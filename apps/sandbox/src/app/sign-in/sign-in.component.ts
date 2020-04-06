import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Component({
  selector: 'http-ext-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {
  error: any;
  form: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      login: this.fb.control('', [Validators.required]),
      password: this.fb.control('', [Validators.required])
    });
  }

  signIn() {
    if (!this.form.valid) {
      return;
    }

    this.error = undefined;
    this.http
      .post(environment.apiBaseUrl + '/sign-in', this.form.value)
      .subscribe({ error: response => (this.error = response.error) });
  }
}
