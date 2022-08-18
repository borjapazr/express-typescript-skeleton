import { Type, useDecorators } from '@tsed/core';
import { registerProvider } from '@tsed/di';

const InfrastructureService = (type?: any): ClassDecorator =>
  useDecorators((target: Type<any>) => {
    registerProvider({
      provide: type ?? target,
      useClass: target
    });
  });

export { InfrastructureService };
