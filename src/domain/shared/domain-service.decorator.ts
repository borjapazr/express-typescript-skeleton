import { Type, useDecorators } from '@tsed/core';
import { registerProvider } from '@tsed/di';

const DOMAIN_SERVICES: any[] = [];

/*
 * The definition of this annotation should not depend on Ts.ED,
 * but the added difficulty of not depending on the framework at
 * this point does not outweigh the benefit.
 */
const DomainService = (type?: any): ClassDecorator =>
  useDecorators(
    (target: any) => {
      DOMAIN_SERVICES.push(target);
    },
    (target: Type<any>) => {
      registerProvider({
        provide: type ?? target,
        useClass: target
      });
    }
  );

export { DOMAIN_SERVICES, DomainService };
