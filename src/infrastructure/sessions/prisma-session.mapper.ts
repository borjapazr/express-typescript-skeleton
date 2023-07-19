import { SessionModel } from '@tsed/prisma';

import {
  SessionRefreshTokenHash,
  SessionRevocationReason,
  SessionRevokedAt,
  SessionRevokedBy
} from '@domain/sessions/';
import { Session } from '@domain/sessions/session';
import { SessionExpiresAt } from '@domain/sessions/session-expires-at';
import { SessionId } from '@domain/sessions/session-id';
import { SessionUserData } from '@domain/sessions/session-user-data';
import { SessionUuid } from '@domain/sessions/session-uuid';

class PrismaSessionMapper {
  public static toDomainModel(sessionPersistenceModel: SessionModel): Session {
    const { username, email, roles } = JSON.parse(sessionPersistenceModel.userData);
    return new Session(
      new SessionId(sessionPersistenceModel.id),
      new SessionUuid(sessionPersistenceModel.uuid),
      new SessionUuid(sessionPersistenceModel.userUuid),
      new SessionUserData(username, email, roles),
      new SessionRefreshTokenHash(sessionPersistenceModel.refreshTokenHash),
      new SessionExpiresAt(sessionPersistenceModel.expiresAt),
      sessionPersistenceModel.revokedAt ? new SessionRevokedAt(sessionPersistenceModel.revokedAt) : null,
      sessionPersistenceModel.revokedBy ? new SessionRevokedBy(sessionPersistenceModel.revokedBy) : null,
      sessionPersistenceModel.revocationReason
        ? new SessionRevocationReason(sessionPersistenceModel.revocationReason)
        : null
    );
  }

  public static toPersistenceModel(session: Session): SessionModel {
    const sessionPersistenceModel = new SessionModel();
    if (session.id != null) {
      sessionPersistenceModel.id = session.id.value;
    }
    sessionPersistenceModel.uuid = session.uuid.value;
    sessionPersistenceModel.userUuid = session.userUuid.value;
    sessionPersistenceModel.userData = session.userData.toString();
    sessionPersistenceModel.refreshTokenHash = session.refreshTokenHash.value;
    sessionPersistenceModel.expiresAt = session.expiresAt.value;
    sessionPersistenceModel.revokedAt = session.revokedAt?.value || null;
    sessionPersistenceModel.revokedBy = session.revokedBy?.value || null;
    sessionPersistenceModel.revocationReason = session.revocationReason?.value || null;
    return sessionPersistenceModel;
  }
}

export { PrismaSessionMapper };
