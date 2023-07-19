import { SessionUuid } from '@domain/sessions/session-uuid';
import { Nullable } from '@domain/shared';
import { UserEmail, UserRole, UserUsername, UserUuid } from '@domain/users';

import { AccessToken } from './access-token';
import { RefreshToken } from './refresh-token';

abstract class TokenProviderDomainService {
  public abstract createAccessToken(
    sessionUuid: SessionUuid,
    userUuid: UserUuid,
    username: UserUsername,
    email: UserEmail,
    roles: UserRole[]
  ): AccessToken;

  public abstract createRefreshToken(
    sessionUuid: SessionUuid,
    userUuid: UserUuid,
    username: UserUsername,
    email: UserEmail,
    roles: UserRole[]
  ): RefreshToken;

  public abstract parseAccessToken(token: string): Nullable<AccessToken>;

  public abstract parseRefreshToken(token: string): Nullable<RefreshToken>;
}

export { TokenProviderDomainService };
