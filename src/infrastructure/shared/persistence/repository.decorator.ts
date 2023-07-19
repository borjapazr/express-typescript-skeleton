import { useDecorators } from '@tsed/core';
import { registerProvider } from '@tsed/di';
import * as emoji from 'node-emoji';

import { Logger } from '@domain/shared';

type RepositoryOptions = {
  enabled?: boolean;
  type?: any;
};

const Repository = ({ enabled = true, type }: RepositoryOptions = {}): ClassDecorator => {
  const registerProviderDecorator = (target: any): void => {
    Logger.debug(
      `${emoji.get('zap')} [@Repository] ${type?.name || target.name} points to ${target.name}. Status: ${
        enabled ? 'REGISTERED' : 'NOT REGISTERED'
      }.`
    );

    if (enabled) {
      registerProvider({
        provide: type ?? target,
        useClass: target,
        type
      });
    }
  };

  return useDecorators(registerProviderDecorator);
};

export { Repository };
