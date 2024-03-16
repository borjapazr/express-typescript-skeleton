import { SessionUuid } from '@modules/sessions/domain/session-uuid';
import { UserEmail, UserRole, UserUsername, UserUuid } from '@modules/users/domain';
import { Nullable } from '@shared/domain';

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
