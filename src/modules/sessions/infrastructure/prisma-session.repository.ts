import { SessionModel, SessionsRepository } from '@tsed/prisma';

import { Session } from '@modules/sessions/domain/session';
import { SessionRepository } from '@modules/sessions/domain/session.repository';
import { SessionUuid } from '@modules/sessions/domain/session-uuid';
import { Nullable } from '@shared/domain';
import { GlobalConfig } from '@shared/infrastructure/config';
import { Repository } from '@shared/infrastructure/persistence';
import { RepositoryAction } from '@shared/infrastructure/persistence/base-repository';
import { PrismaBaseRepository } from '@shared/infrastructure/persistence/prisma/prisma-base-repository';

import { PrismaSessionMapper } from './prisma-session.mapper';

@Repository({ enabled: GlobalConfig.STORE_SESSIONS_IN_DB, type: SessionRepository })
class PrismaSessionRepository extends PrismaBaseRepository<SessionModel> implements SessionRepository {
  private sessionRepository: SessionsRepository;

  constructor(sessionRepository: SessionsRepository) {
    super();
    this.sessionRepository = sessionRepository;
  }

  public async findByUuid(uuid: SessionUuid): Promise<Nullable<Session>> {
    const session = await this.sessionRepository.findFirst({
      where: { uuid: uuid.value, deletedAt: null, revokedAt: null }
    });

    return session ? PrismaSessionMapper.toDomainModel(session) : null;
  }

  public async create(session: Session): Promise<Session> {
    const createdSession = await this.sessionRepository.create({
      data: this.getAuditablePersitenceModel(RepositoryAction.CREATE, PrismaSessionMapper.toPersistenceModel(session))
    });
    return PrismaSessionMapper.toDomainModel(createdSession);
  }

  public async update(session: Session): Promise<Session> {
    const updatedSession = await this.sessionRepository.update({
      where: { uuid: session.uuid.value },
      data: this.getAuditablePersitenceModel(RepositoryAction.UPDATE, PrismaSessionMapper.toPersistenceModel(session))
    });
    return PrismaSessionMapper.toDomainModel(updatedSession);
  }

  public async delete(uuid: SessionUuid): Promise<void> {
    await this.sessionRepository.update({
      where: { uuid: uuid.value },
      data: this.getAuditablePersitenceModel(RepositoryAction.DELETE)
    });
  }
}

export { PrismaSessionRepository };
