import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'http-ext-nav',
  template: `
    <mat-sidenav-container class="sidenav-container">
      <mat-sidenav
        #drawer
        class="sidenav"
        fixedInViewport
        [attr.role]="(isHandset$ | async) ? 'dialog' : 'navigation'"
        [mode]="(isHandset$ | async) ? 'over' : 'side'"
        [opened]="(isHandset$ | async) === false"
      >
        <mat-toolbar>Menu</mat-toolbar>
        <mat-nav-list>
          <a mat-list-item routerLink="/bikes">Bikes</a>
          <a mat-list-item routerLink="/users">Users</a>
          <a mat-list-item routerLink="/error">Errors</a>
        </mat-nav-list>
      </mat-sidenav>
      <mat-sidenav-content>
        <mat-toolbar color="primary">
          <span class="brand">
            <button
              type="button"
              aria-label="Toggle sidenav"
              mat-icon-button
              (click)="drawer.toggle()"
              *ngIf="isHandset$ | async"
            >
              <mat-icon check_circle="menu">menu</mat-icon>
            </button>
            <img class="logo" src="/assets/logo.svg" alt="http-ext logo" />
            <strong>Http-ext</strong>demo
          </span>
          <span
            class="signed-in"
            *ngIf="isAuthenticated$ | async; else signInLink"
          >
            <img class="authorized" src="/assets/verified_user.svg" />
            <span>Welcome home</span>
            <button mat-button (click)="markTokenAsExpired()">
              Mark token as expired
            </button>
          </span>
          <ng-template #signInLink>
            <a mat-raised-button routerLink="/signin">Sign in</a>
          </ng-template>
        </mat-toolbar>
        <ng-content></ng-content>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [
    `
      .sidenav-container {
        height: 100%;
      }

      .sidenav {
        width: 200px;
      }

      .sidenav .mat-toolbar {
        background: inherit;
      }

      .mat-toolbar.mat-primary {
        position: sticky;
        top: 0;
        z-index: 1;
      }

      .logo {
        width: 32px;
        margin-right: 10px;
      }

      .brand {
        display: flex;
        align-items: center;
      }

      .brand strong {
        margin-right: 6px;
      }

      .signed-in {
        font-size: 14px;
        display: flex;
        align-items: center;
      }

      .signed-in button {
        margin-left: 8px;
      }

      .authorized {
        margin-right: 6px;
      }

      mat-toolbar {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
    `,
  ],
})
export class NavComponent {
  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );

  isAuthenticated$ = this.auth.isAuthenticated$;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private auth: AuthService
  ) {}

  markTokenAsExpired(): void {
    this.auth.setToken('EXPIRED');
  }
}

@NgModule({
  declarations: [NavComponent],
  exports: [NavComponent],
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    RouterModule,
  ],
})
export class NavModule {}
