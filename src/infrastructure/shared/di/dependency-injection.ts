import { registerProvider } from '@tsed/di';
import * as emoji from 'node-emoji';

import { Logger } from '@domain/shared';

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
      Logger.error(`[@Bootstrap] ${this.constructor.name}.initialize() threw the following error! --- ${error}`);
      process.exit(1);
    }
  };

  private static initializeProvider = (providerConfiguration: { type: any; targetClass: any }): void => {
    registerProvider({
      provide: providerConfiguration.type,
      useClass: providerConfiguration.targetClass,
      type: providerConfiguration.type
    });
    Logger.debug(
      `${emoji.get('zap')} ${providerConfiguration.type?.name || providerConfiguration.targetClass.name} points to ${
        providerConfiguration.targetClass.name
      }. Status: REGISTERED.`
    );
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
