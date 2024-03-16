import { BaseRepository } from '@shared/infrastructure/persistence';

abstract class RedisBaseRepository<T> extends BaseRepository<T> {
  protected abstract readonly repositoryKey: string;

  protected getKeyPrefix(value: string): string {
    return `${this.repositoryKey}:${value}`;
  }
}

export { RedisBaseRepository };
