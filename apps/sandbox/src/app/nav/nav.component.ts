import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

import { AuthService } from '../auth/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

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
        [opened]="(isHandset$ | async) === false && (isAuthenticated$ | async)"
      >
        <mat-toolbar>Menu</mat-toolbar>
        <mat-nav-list *ngIf="isAuthenticated$ | async">
          <a mat-list-item routerLink="/bikes">Bikes</a>
          <a mat-list-item routerLink="/retry">Retry</a>
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
              Menu
            </button>
            <img class="logo" src="/assets/logo.svg" alt="http-ext logo" />
            <strong>Http-ext</strong>demo
          </span>
          <span class="signed-in" *ngIf="isAuthenticated$ | async">
            <img class="authorized" src="/assets/verified_user.svg" />
            <span>Welcome home</span>
            <button mat-raised-button (click)="markTokenAsExpired()">
              Mark token as expired
            </button>
          </span>
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
    private auth: AuthService,
    private snackbar: MatSnackBar,
    private router: Router
  ) {}

  markTokenAsExpired(): void {
    this.auth.setToken('EXPIRED');
    const snackbar = this.snackbar.open(
      'The next HTTP request will trigger an Unauthorized error response.',
      'Navigate',
      { duration: 12000 }
    );

    snackbar
      .onAction()
      .subscribe(() =>
        this.router.navigate(['bikes/', 'e802ccda-db66-4ac9-ae16-ae1eee9e0ee0'])
      );
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
    MatListModule,
    RouterModule,
  ],
})
export class NavModule {}
