import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _token = new BehaviorSubject<string | undefined>(undefined);

  get token$() {
    return this._token.asObservable();
  }

  readonly isAuthenticated$ = this._token.pipe(map(token => token != null));

  signIn(token: string): void {
    this._token.next(token);
  }
}
