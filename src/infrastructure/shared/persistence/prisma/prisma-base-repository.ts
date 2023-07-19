import { BaseRepository } from '@infrastructure/shared/persistence';

abstract class PrismaBaseRepository<T> extends BaseRepository<T> {}

export { PrismaBaseRepository };
