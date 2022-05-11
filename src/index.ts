import { bootstrap } from '@infrastructure/shared/bootstrap';
import { App } from '@presentation/app';

const start = async (): Promise<void> => {
  await bootstrap();
  new App().start();
};
start();
