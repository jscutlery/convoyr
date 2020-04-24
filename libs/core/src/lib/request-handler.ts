import { Observable } from 'rxjs';

import { ConvoyrResponse } from './response';
import { ConvoyrRequest } from './request';

export interface NextHandler {
  handle({ request }: { request: ConvoyrRequest }): Observable<ConvoyrResponse>;
}
