import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <app-nav>
      <router-outlet></router-outlet>
    </app-nav>
  `,
})
export class AppComponent {}
