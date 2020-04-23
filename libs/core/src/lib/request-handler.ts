import { Observable } from 'rxjs';

import { ConvoyrResponse } from './response';

export type NextFn = ({
  request: ConvoyRequest,
}) => Observable<ConvoyrResponse>;
