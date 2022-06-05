import { asClass, AwilixContainer, createContainer, InjectionMode } from 'awilix';
import { useContainer } from 'routing-controllers';

import { HealthCheckerUseCase } from '@application/health/health-checker.usecase';
import { LOGGER } from '@domain/shared';
import { AuthenticationController } from '@presentation/controllers/authentication';
import { HealthController } from '@presentation/controllers/health/health.controller';
import {
  AuthenticationMiddleware,
  ErrorHandlerMiddleware,
  MorganMiddleware,
  NotFoundMiddleware
} from '@presentation/middlewares';

import { AwilixAdapter } from './awilix.adapter';

const camelCaseClassNameMapper = (className: string): string =>
  className.charAt(0).toLocaleLowerCase() + className.slice(1);

class DiContainer {
  static readonly diContainer: AwilixContainer = createContainer({
    injectionMode: InjectionMode.CLASSIC
  });

  static async initialize(): Promise<AwilixContainer> {
    try {
      // Core dependencies
      this.registerSingletonClass([
        AuthenticationMiddleware,
        ErrorHandlerMiddleware,
        MorganMiddleware,
        NotFoundMiddleware
      ]);

      // Use cases
      this.registerSingletonClassWithCustomName([
        {
          name: 'healthCheckerUseCase',
          class: HealthCheckerUseCase
        }
      ]);

      // Controllers
      this.registerSingletonClass([HealthController, AuthenticationController]);

      useContainer(new AwilixAdapter(this.diContainer, camelCaseClassNameMapper));

      return this.diContainer;
    } catch (error) {
      LOGGER.error(error);
      process.exit(1);
    }
  }

  static registerSingletonClass = (dependencies: any[]): void => {
    const dependenciesMap = Object.assign(
      {},
      ...dependencies.map(dependency => ({
        [camelCaseClassNameMapper(dependency.name)]: asClass(dependency).singleton()
      }))
    );

    this.diContainer.register(dependenciesMap);
  };

  static registerSingletonClassWithCustomName = (dependencies: { name: string; class: any }[]): void => {
    const dependenciesMap = Object.assign(
      {},
      ...dependencies.map(dependency => ({
        [dependency.name]: asClass(dependency.class).singleton()
      }))
    );

    this.diContainer.register(dependenciesMap);
  };
}

export { DiContainer };
