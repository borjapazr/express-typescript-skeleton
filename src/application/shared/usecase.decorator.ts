import { useDecorators } from '@tsed/core';
import { Injectable, ProviderScope, ProviderType } from '@tsed/di';

import { BaseUseCase } from '@application/shared/base-usecase';

const USE_CASES: BaseUseCase<any, any>[] = [];
/*
 * The definition of this annotation should not depend on Ts.ED,
 * but the added difficulty of not depending on the framework at
 * this point does not outweigh the benefit.
 */
const UseCase = (): ClassDecorator => {
  return useDecorators(
    (target: any) => {
      USE_CASES.push(target);
    },
    Injectable({
      type: ProviderType.SERVICE,
      scope: ProviderScope.SINGLETON
    })
  );
};

export { USE_CASES, UseCase };
