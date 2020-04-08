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

  isSignedIn$ = this.token$.pipe(map(token => token != null));

  readonly isAuthenticated$ = this._token.pipe(map(token => token != null));

  setToken(token: string): void {
    this._token.next(token);
  }

  signOut(): void {
    this._token.next(undefined);
  }
}
