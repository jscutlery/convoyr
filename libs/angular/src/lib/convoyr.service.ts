import { Inject, Injectable, InjectionToken } from '@angular/core';
import { Convoyr, ConvoyrConfig } from '@convoyr/core';

/**
 * @internal Global Convoyr configuration
 */
export const _CONVOYR_CONFIG = new InjectionToken<ConvoyrConfig>(
  'Convoyr Config'
);

@Injectable()
export class ConvoyrService extends Convoyr {
  constructor(
    @Inject(_CONVOYR_CONFIG)
    config: ConvoyrConfig
  ) {
    super(config);
  }
}
