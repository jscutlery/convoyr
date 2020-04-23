import { Observable } from 'rxjs';

import { ConvoyrRequest } from './request';
import { PluginHandler } from './handler';

export type RequestCondition = ({
  request,
}: {
  request: ConvoyrRequest;
}) => boolean | Promise<boolean> | Observable<boolean>;

export interface ConvoyrPlugin {
  shouldHandleRequest?: RequestCondition;
  handler: PluginHandler;
}
