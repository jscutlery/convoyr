import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { environment } from '../../environments/environment';

export interface User {
  id: string;
  name: string;
}

@Component({
  selector: 'http-ext-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit, OnDestroy {
  users: User[] = [];

  private _subscription: Subscription;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this._subscription = this.http
      .get<{ users: User[] }>(environment.apiBaseUrl + '/users')
      .subscribe(({ users }) => (this.users = users));
  }

  ngOnDestroy() {
    this._subscription?.unsubscribe();
  }
}
