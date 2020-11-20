import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConvoyrConfig, createRequest } from '@convoyr/core';
import { Observable } from 'rxjs';

import { ConvoyrService } from './convoyr.service';

@Injectable({ providedIn: 'root' })
export class Convoyr {
  constructor(private _convoyr: ConvoyrService, private _http: HttpClient) {}

  get<TBody = unknown>(
    url: string,
    options: any,
    config: ConvoyrConfig = { plugins: [] }
  ) {
    const httpHandler$ = this._http.get<TBody>(url, options);
    return this._buildRequest(url, config, httpHandler$);
  }

  private _buildRequest(
    url: string,
    config: ConvoyrConfig,
    httpHandler$
  ): Observable<any> {
    return this._convoyr.handle({
      request: createRequest({ url }),
      plugins: config.plugins,
      httpHandler: {
        handle() {
          return httpHandler$;
        },
      },
    });
  }
}
