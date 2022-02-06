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
      this.registerSingletonDependency(AuthenticationMiddleware);
      this.registerSingletonDependency(ErrorHandlerMiddleware);
      this.registerSingletonDependency(MorganMiddleware);
      this.registerSingletonDependency(NotFoundMiddleware);

      // Use cases
      this.registerSingletonDependency(HealthCheckerUseCase);

      // Controllers
      this.registerSingletonDependency(HealthController);

      useContainer(new AwilixAdapter(this.diContainer, camelCaseClassNameMapper));

      return this.diContainer;
    } catch (error) {
      LOGGER.error(error);
      process.exit(1);
    }
  }

  static registerSingletonDependency = (dependency: any): void => {
    this.diContainer.register({
      [camelCaseClassNameMapper(dependency.name)]: asClass(dependency).singleton()
    });
  };
}

export { DiContainer };
