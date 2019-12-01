import { Observable } from 'rxjs';

import { HttpExtResponse } from './response';

export type NextFn = ({
  request: HttpExtRequest
}) => Observable<HttpExtResponse>;
