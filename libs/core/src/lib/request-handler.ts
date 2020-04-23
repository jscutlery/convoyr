import { Observable } from 'rxjs';

import { ConvoyResponse } from './response';

export type NextFn = ({ request: ConvoyRequest }) => Observable<ConvoyResponse>;
