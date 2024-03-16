import {
  SessionRefreshTokenHash,
  SessionRevocationReason,
  SessionRevokedAt,
  SessionRevokedBy
} from '@modules/sessions/domain/';
import { Session } from '@modules/sessions/domain/session';
import { SessionExpiresAt } from '@modules/sessions/domain/session-expires-at';
import { SessionUserData } from '@modules/sessions/domain/session-user-data';
import { SessionUuid } from '@modules/sessions/domain/session-uuid';

import { RedisSession } from './redis-session';

class RedisSessionMapper {
  public static toDomainModel(sessionPersistenceModel: RedisSession | Record<string, string>): Session {
    const { username, email, roles } = JSON.parse(sessionPersistenceModel.userData);
    return new Session(
      null,
      new SessionUuid(sessionPersistenceModel.uuid),
      new SessionUuid(sessionPersistenceModel.userUuid),
      new SessionUserData(username, email, roles),
      new SessionRefreshTokenHash(sessionPersistenceModel.refreshTokenHash),
      SessionExpiresAt.fromISOString(sessionPersistenceModel.expiresAt),
      sessionPersistenceModel.revokedAt ? SessionRevokedAt.fromISOString(sessionPersistenceModel.revokedAt) : null,
      sessionPersistenceModel.revokedBy ? new SessionRevokedBy(sessionPersistenceModel.revokedBy) : null,
      sessionPersistenceModel.revocationReason
        ? new SessionRevocationReason(sessionPersistenceModel.revocationReason)
        : null
    );
  }

  public static toPersistenceModel(session: Session): RedisSession {
    return {
      uuid: session.uuid.value,
      userUuid: session.userUuid.value,
      userData: session.userData.toString(),
      refreshTokenHash: session.refreshTokenHash.value,
      expiresAt: session.expiresAt.toString(),
      revokedAt: session.revokedAt?.toString() || null,
      revokedBy: session.revokedBy?.value || null,
      revocationReason: session.revocationReason?.value || null
    };
  }
}

export { RedisSessionMapper };
