import { Observable, SubscribableOrPromise } from 'rxjs';

type Request = unknown;
type Response = unknown;

export type NextFn = ({req: Request, res: Response}) => Observable<Response>;
 
export type SyncOrAsync<T> = T | SubscribableOrPromise<T>;

export interface Plugin {
  condition({ req }: { req: Request }): boolean;
  handle({ req, res }: { req: Request; res: Response; next: NextFn }): SyncOrAsync<Response>;
}

export function useCachePlugin(): Plugin {
  return {
    condition: null,
    handle({ req, res }) {
      throw new Error('🚧 Not implemented error!');
    }
  };
}
