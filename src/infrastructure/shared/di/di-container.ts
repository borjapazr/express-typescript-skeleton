import { asClass, AwilixContainer, createContainer, InjectionMode } from 'awilix';
import { useContainer } from 'routing-controllers';

import { HealthCheckerUseCase } from '@application/health/health-checker.usecase';
import { LOGGER } from '@domain/shared';
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
      this.registerSingletonDependencies([
        AuthenticationMiddleware,
        ErrorHandlerMiddleware,
        MorganMiddleware,
        NotFoundMiddleware
      ]);

      // Use cases
      this.registerSingletonDependencies([HealthCheckerUseCase]);

      // Controllers
      this.registerSingletonDependencies([HealthController]);

      useContainer(new AwilixAdapter(this.diContainer, camelCaseClassNameMapper));

      return this.diContainer;
    } catch (error) {
      LOGGER.error(error);
      process.exit(1);
    }
  }

  static registerSingletonDependencies = (dependencies: any[]): void => {
    const dependenciesMap = Object.assign(
      {},
      ...dependencies.map(dependency => ({
        [camelCaseClassNameMapper(dependency.name)]: asClass(dependency).singleton()
      }))
    );

    this.diContainer.register(dependenciesMap);
  };
}

export { DiContainer };
