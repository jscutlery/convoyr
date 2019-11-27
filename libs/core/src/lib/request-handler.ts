import { Observable } from 'rxjs';

import { HttpExtResponse } from './response';

export type RequestHandlerFn = ({
  request: HttpExtRequest
}) => Observable<HttpExtResponse>;
