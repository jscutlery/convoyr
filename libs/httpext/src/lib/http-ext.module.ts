import { NgModule } from '@angular/core';

@NgModule({})
export class HttpExtModule {
  static forRoot(config: { plugins: unknown[]; }): any {
    throw new Error("Method not implemented.");
  }
}