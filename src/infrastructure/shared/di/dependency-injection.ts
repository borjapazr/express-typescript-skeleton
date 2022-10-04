import { registerProvider } from '@tsed/di';

import { LOGGER } from '@domain/shared';

class DependencyInjection {
  public static initialize = async (): Promise<void> => {
    try {
      // This is just an example of how to register a provider manually
      this.initializeProviders([
        {
          type: DependencyInjection,
          targetClass: DependencyInjection
        }
      ]);
    } catch (error) {
      LOGGER.error(`[@Bootstrap] ${this.constructor.name}.initialize() threw the following error! --- ${error}`);
      process.exit(1);
    }
  };

  private static initializeProvider = (providerConfiguration: { type: any; targetClass: any }): void => {
    registerProvider({
      provide: providerConfiguration.type,
      useClass: providerConfiguration.targetClass
    });
  };

  private static initializeProviders = (
    providersConfiguration: {
      type: any;
      targetClass: any;
    }[]
  ): void => {
    providersConfiguration.forEach(providerConfiguration =>
      this.initializeProvider({
        type: providerConfiguration.type,
        targetClass: providerConfiguration.targetClass
      })
    );
  };
}

export { DependencyInjection };
