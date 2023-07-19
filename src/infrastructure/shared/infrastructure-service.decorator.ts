import { useDecorators } from '@tsed/core';
import { registerProvider } from '@tsed/di';
import * as emoji from 'node-emoji';

import { Logger } from '@domain/shared';

type InfrastructureServiceOptions = {
  enabled?: boolean;
  type?: any;
};

const InfrastructureService = ({ enabled = true, type }: InfrastructureServiceOptions = {}): ClassDecorator => {
  const registerProviderDecorator = (target: any): void => {
    Logger.debug(
      `${emoji.get('zap')} [@InfrastructureService] ${type?.name || target.name} points to ${target.name}. Status: ${
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

export { InfrastructureService };
