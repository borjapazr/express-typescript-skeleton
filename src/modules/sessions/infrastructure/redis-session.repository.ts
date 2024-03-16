import { Inject } from '@tsed/di';
import isEmpty from 'just-is-empty';

import { Session } from '@modules/sessions/domain/session';
import { SessionRepository } from '@modules/sessions/domain/session.repository';
import { SessionUuid } from '@modules/sessions/domain/session-uuid';
import { Nullable } from '@shared/domain';
import { REDIS_CONNECTION, RedisConnection } from '@shared/infrastructure/cache/cache';
import { GlobalConfig } from '@shared/infrastructure/config';
import { Repository } from '@shared/infrastructure/persistence';
import { RepositoryAction } from '@shared/infrastructure/persistence/base-repository';
import { RedisBaseRepository } from '@shared/infrastructure/persistence/redis/redis-base-repository';

import { RedisSession } from './redis-session';
import { RedisSessionMapper } from './redis-session.mapper';

@Repository({ enabled: GlobalConfig.STORE_SESSIONS_IN_CACHE, type: SessionRepository })
class RedisSessionRepository extends RedisBaseRepository<RedisSession> implements SessionRepository {
  protected readonly repositoryKey = 'sessions';

  private connection: RedisConnection;

  constructor(@Inject(REDIS_CONNECTION) connection: RedisConnection) {
    super();
    this.connection = connection;
  }

  public async findByUuid(uuid: SessionUuid): Promise<Nullable<Session>> {
    const cachedSession = await this.connection.hgetall(this.getKeyPrefix(uuid.value));

    return isEmpty(cachedSession) || cachedSession.deletedAt ? null : RedisSessionMapper.toDomainModel(cachedSession);
  }

  public async create(session: Session): Promise<Session> {
    await this.connection.hset(
      this.getKeyPrefix(session.uuid.value),
      this.getAuditablePersitenceModel(RepositoryAction.CREATE, RedisSessionMapper.toPersistenceModel(session))
    );
    return session;
  }

  public async update(session: Session): Promise<Session> {
    await this.connection.hset(
      this.getKeyPrefix(session.uuid.value),
      this.getAuditablePersitenceModel(RepositoryAction.UPDATE, RedisSessionMapper.toPersistenceModel(session))
    );
    return session;
  }

  public async delete(uuid: SessionUuid): Promise<void> {
    await this.connection.hset(
      this.getKeyPrefix(uuid.value),
      this.getAuditablePersitenceModel(RepositoryAction.DELETE)
    );
  }
}

export { RedisSessionRepository };
