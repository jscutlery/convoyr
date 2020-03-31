import { Observable } from 'rxjs';

import { HttpExtRequest } from './request';
import { PluginHandler } from './handler';

export type RequestCondition = ({
  request
}: {
  request: HttpExtRequest;
}) => boolean | Promise<boolean> | Observable<boolean>;

export interface HttpExtPlugin {
  shouldHandleRequest?: RequestCondition;
  handler: PluginHandler;
}
