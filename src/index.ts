import { bootstrap } from '@infrastructure/shared/bootstrap';
import { App } from '@presentation/app';

async function start() {
  await bootstrap();
  new App().start();
}
start();
