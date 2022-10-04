import { SessionModel, SessionsRepository } from '@tsed/prisma';

import { Session } from '@domain/sessions/session';
import { SessionRepository } from '@domain/sessions/session.repository';
import { SessionUuid } from '@domain/sessions/session-uuid';
import { Nullable } from '@domain/shared';
import { BasePrismaRepository, RepositoryAction } from '@infrastructure/shared/persistence/base-prisma-repository';
import { Repository } from '@infrastructure/shared/persistence/repository.decorator';

import { SessionMapper } from './session.mapper';

@Repository(SessionRepository)
class PrismaSessionRepository extends BasePrismaRepository<SessionModel> implements SessionRepository {
  private sessionRepository: SessionsRepository;

  constructor(sessionRepository: SessionsRepository) {
    super();
    this.sessionRepository = sessionRepository;
  }

  public async findByUuid(uuid: SessionUuid): Promise<Nullable<Session>> {
    const session = await this.sessionRepository.findFirst({
      where: { uuid: uuid.value, deletedAt: null, revokedAt: null }
    });

    return session ? SessionMapper.toDomainModel(session) : null;
  }

  public async create(session: Session): Promise<Session> {
    const createdSession = await this.sessionRepository.create({
      data: this.getAuditablePersitenceModel(RepositoryAction.CREATE, SessionMapper.toPersistenceModel(session))
    });
    return SessionMapper.toDomainModel(createdSession);
  }

  public async update(session: Session): Promise<Session> {
    const updatedSession = await this.sessionRepository.update({
      where: { uuid: session.uuid.value },
      data: this.getAuditablePersitenceModel(RepositoryAction.UPDATE, SessionMapper.toPersistenceModel(session))
    });
    return SessionMapper.toDomainModel(updatedSession);
  }

  public async delete(uuid: SessionUuid): Promise<void> {
    await this.sessionRepository.update({
      where: { uuid: uuid.value },
      data: this.getAuditablePersitenceModel(RepositoryAction.DELETE)
    });
  }
}

export { PrismaSessionRepository };
