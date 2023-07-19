import {
  SessionRefreshTokenHash,
  SessionRevocationReason,
  SessionRevokedAt,
  SessionRevokedBy
} from '@domain/sessions/';
import { Session } from '@domain/sessions/session';
import { SessionExpiresAt } from '@domain/sessions/session-expires-at';
import { SessionUserData } from '@domain/sessions/session-user-data';
import { SessionUuid } from '@domain/sessions/session-uuid';

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
