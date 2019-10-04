import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { from, isObservable, Observable, of } from 'rxjs';
import { NextFn, Plugin, Request, SyncOrAsync } from './cache-plugin';


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

  constructor({plugins}: {plugins: Plugin[]}) {
    this._plugins = plugins;
  }

  handle({req, handler}) {
    return this._handle({req, plugins: this._plugins, handler});
  }

  _handle({req, plugins, handler}: {req: Request, plugins: Plugin[], handler}) {

    if (plugins.length === 0) {
      return handler(req);
    }

    const next: NextFn = (args) => {
      const res = this._handle({req: args.req, plugins: plugins.slice(1), handler})
      return fromSyncOrAsync(res);
    }

    return plugins[0].handle({req, next});

  }

}

export class HttpExtInterceptor implements HttpInterceptor {
  private _httpExt: HttpExt;

  constructor({ httpExt }: { httpExt: HttpExt }) {
    this._httpExt = httpExt;
  }

  intercept(
    ngReq: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // (Request) => Observable<Response>
    // const handler = req => {
    //   return next(toNgRequest(req))
    //     .pipe(map(fromNgResponse));      
    // }
    // return this._httpExt.handle({req: fromNgRequest(ngReq), handler})

    return this._httpExt.handle({req: ngReq, handler: next});

    // return this._httpExt.handle(fromNgRequest(req)).pipe(
    //   concatMap(ngReq => next(ngReq)),
    //   concatMap(ngRes => this._httpExt.processResponse(fromNgResponse(ngRes))),
    //   map(res => toNgRes(res))
    // );
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
          useValue: httpExtInterceptor
        }
      ]
    };
  }
}
