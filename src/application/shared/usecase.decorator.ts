import { useDecorators } from '@tsed/core';
import { registerProvider } from '@tsed/di';
import * as emoji from 'node-emoji';

import { BaseUseCase } from '@application/shared/base-usecase';
import { Logger } from '@domain/shared';

const USE_CASES: BaseUseCase<any, any>[] = [];

type UseCaseOptions = {
  enabled?: boolean;
  type?: any;
};

/*
 * The definition of this annotation should not depend on Ts.ED,
 * but the added difficulty of not depending on the framework at
 * this point does not outweigh the benefit.
 */
const UseCase = ({ enabled = true, type }: UseCaseOptions = {}): ClassDecorator => {
  const addUseCaseToRegistry = (target: any): void => {
    USE_CASES.push(target);
  };

  const registerProviderDecorator = (target: any): void => {
    Logger.debug(
      `${emoji.get('zap')} [@UseCase] ${type?.name || target.name} points to ${target.name}. Status: ${
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

  return useDecorators(addUseCaseToRegistry, registerProviderDecorator);
};

export { USE_CASES, UseCase };
