import { Nullable } from '@domain/shared';

interface RedisSession {
  uuid: string;
  userUuid: string;
  userData: string;
  refreshTokenHash: string;
  expiresAt: string;
  revokedAt: Nullable<string>;
  revokedBy: Nullable<string>;
  revocationReason: Nullable<string>;
}

export { RedisSession };
