import { BaseRepository } from '@shared/infrastructure/persistence';

abstract class PrismaBaseRepository<T> extends BaseRepository<T> {}

export { PrismaBaseRepository };
