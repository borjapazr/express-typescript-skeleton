import { Type, useDecorators } from '@tsed/core';
import { registerProvider } from '@tsed/di';

const Repository = (type: any): ClassDecorator =>
  useDecorators((target: Type<any>) => {
    registerProvider({
      provide: type ?? target,
      useClass: target
    });
  });

export { Repository };
