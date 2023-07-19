import { useDecorators } from '@tsed/core';
import { registerProvider } from '@tsed/di';
import * as emoji from 'node-emoji';

import { Logger } from '@domain/shared';

const DOMAIN_SERVICES: any[] = [];

type DomainServiceOptions = {
  enabled?: boolean;
  type?: any;
};

/*
 * The definition of this annotation should not depend on Ts.ED,
 * but the added difficulty of not depending on the framework at
 * this point does not outweigh the benefit.
 */
const DomainService = ({ enabled = true, type }: DomainServiceOptions = {}): ClassDecorator => {
  const addDomainServiceToRegistry = (target: any): void => {
    DOMAIN_SERVICES.push(target);
  };

  const registerProviderDecorator = (target: any): void => {
    Logger.debug(
      `${emoji.get('zap')} [@DomainService] ${type?.name || target.name} points to ${target.name}. Status: ${
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

  return useDecorators(addDomainServiceToRegistry, registerProviderDecorator);
};

export { DOMAIN_SERVICES, DomainService };
