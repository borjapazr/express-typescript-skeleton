import { DiContainer } from '@infrastructure/shared/di/di-container';
import { App } from '@presentation/app';

const bootstrap = async (): Promise<void> => {
  await DiContainer.initialize();
};
bootstrap();

const app = new App();

export { app };
