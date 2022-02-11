import { DiContainer } from '@infrastructure/shared/di/di-container';
import { App } from '@presentation/app';

async function bootstrap() {
  await DiContainer.initialize();
}
bootstrap();

const app = new App();

export { app };
