import { Observable } from 'rxjs';

import { ConvoyRequest } from './request';
import { PluginHandler } from './handler';

export type RequestCondition = ({
  request,
}: {
  request: ConvoyRequest;
}) => boolean | Promise<boolean> | Observable<boolean>;

export interface ConvoyPlugin {
  shouldHandleRequest?: RequestCondition;
  handler: PluginHandler;
}
