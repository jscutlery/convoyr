import { NgModule, ModuleWithProviders } from '@angular/core';
import { Plugin, Request, NextFn, SyncOrAsync } from './cache-plugin';
import {
  HTTP_INTERCEPTORS,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpEvent,
  HttpClientModule
} from '@angular/common/http';
import { Observable, isObservable, , of, from } from 'rxjs';


export function isPromise<T>(value: any): value is Promise<T> {
  return typeof value.then === 'function';
}

export function fromSyncOrAsync<T>(value: SyncOrAsync<T>): Observable<T> {
  if (isObservable<T>(value)) {
    return value;
  }
  if (isPromise<T>(value)) {
    return from(value);
  }
  return of(value as T);
}

export class HttpExt {

  private _plugins: Plugin[];

  processRequest(req) {
    this._processRequest(req, this._plugins);
  }

  _processRequest(req: Request, plugins: Plugin[]) {

    const next: NextFn = (args) => {
      const res = this._processRequest(args.req, plugins.slice(1))
      return fromSyncOrAsync(res);
    }

    return plugins[0].handle({req, next});

  }

}

export class HttpExtInterceptor implements HttpInterceptor {
  private httpExt: Plugin[];

  constructor({ httpExt }: { httpExt: HttpExt }) {
    this._httpExt = httpExt;
  }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return this._httpExt.processRequest(fromNgRequest(req)).pipe(
      concatMap(ngReq => next(ngReq)),
      concatMap(ngRes => this._httpExt.processResponse(fromNgResponse(ngRes))),
      map(res => toNgRes(res))
    );
  }
}

@NgModule({})
export class HttpExtModule {
  static forRoot({ plugins }: { plugins: Plugin[] }): ModuleWithProviders {
    const httpExt = new HttpExt({ plugins });
    const httpExtInterceptor = new HttpExtInterceptor({ httpExt });

    return {
      ngModule: HttpExtModule,
      providers: [
        {
          provide: HTTP_INTERCEPTORS,
          multi: true,
          useValue: httpExt
        }
      ]
    };
  }
}
<