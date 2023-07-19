import { DateTime } from 'luxon';

import { Nullable } from '@domain/shared';
import { DomainEntity } from '@domain/shared/entities/domain-entity';

import { SessionExpiresAt } from './session-expires-at';
import { SessionId } from './session-id';
import { SessionRefreshTokenHash } from './session-refresh-token-hash';
import { SessionRevokedAt } from './session-revoked-at';
import { SessionRevokedBy } from './session-revoked-by';
import { SessionRevocationReason } from './session-revoked-reason';
import { SessionUserData } from './session-user-data';
import { SessionUserUuid } from './session-user-uuid';
import { SessionUuid } from './session-uuid';

interface SessionFlattened {
  id: Nullable<number>;
  uuid: string;
  userUuid: string;
  username: string;
  email: string;
  roles: string[];
  refreshTokenHash: string;
  expiresAt: Date;
  revokedAt: Nullable<Date>;
  revokedBy: Nullable<string>;
  revocationReason: Nullable<string>;
}

class Session extends DomainEntity {
  id: Nullable<SessionId>;

  uuid: SessionUuid;

  userUuid: SessionUserUuid;

  userData: SessionUserData;

  refreshTokenHash: SessionRefreshTokenHash;

  expiresAt: SessionExpiresAt;

  revokedAt: Nullable<SessionRevokedAt>;

  revokedBy: Nullable<SessionRevokedBy>;

  revocationReason: Nullable<SessionRevocationReason>;

  constructor(
    id: Nullable<SessionId>,
    uuid: SessionUuid,
    userUuid: SessionUserUuid,
    userData: SessionUserData,
    refreshTokenHash: SessionRefreshTokenHash,
    expiresAt: SessionExpiresAt,
    revokedAt: Nullable<SessionRevokedAt>,
    revokedBy: Nullable<SessionRevokedBy>,
    revocationReason: Nullable<SessionRevocationReason>
  ) {
    super();
    this.id = id;
    this.uuid = uuid;
    this.userUuid = userUuid;
    this.userData = userData;
    this.refreshTokenHash = refreshTokenHash;
    this.expiresAt = expiresAt;
    this.revokedAt = revokedAt;
    this.revokedBy = revokedBy;
    this.revocationReason = revocationReason;
  }

  public static create(
    uuid: SessionUuid,
    userUuid: SessionUserUuid,
    refreshTokenHash: SessionRefreshTokenHash,
    userData: SessionUserData,
    expiresAt: SessionExpiresAt
  ): Session {
    return new Session(
      undefined,
      uuid,
      userUuid,
      userData,
      refreshTokenHash,
      expiresAt,
      undefined,
      undefined,
      undefined
    );
  }

  public revoke(revocationAuthor: SessionRevokedBy, revocationReason: SessionRevocationReason): void {
    this.revokedAt = new SessionRevokedAt(DateTime.utc().toJSDate());
    this.revokedBy = revocationAuthor;
    this.revocationReason = revocationReason;
  }

  public flat(): SessionFlattened {
    return {
      id: this.id?.value,
      uuid: this.uuid.value,
      userUuid: this.userUuid.value,
      username: this.userData.username,
      email: this.userData.email,
      roles: this.userData.roles,
      refreshTokenHash: this.refreshTokenHash.value,
      expiresAt: this.expiresAt.value,
      revokedAt: this.revokedAt?.value,
      revokedBy: this.revokedBy?.value,
      revocationReason: this.revocationReason?.value
    };
  }

  public isActive(): boolean {
    const currentDate = DateTime.utc().toJSDate();
    return this.expiresAt.value > currentDate && (this.revokedAt == null || this.revokedAt.value > currentDate);
  }

  public async refreshTokenMatches(plainRefreshToken: string): Promise<boolean> {
    return this.refreshTokenHash.checkIfMatchesWithPlainRefreshToken(plainRefreshToken);
  }
}

export { Session, SessionFlattened };
