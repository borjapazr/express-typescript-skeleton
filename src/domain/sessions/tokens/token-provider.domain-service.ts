import { Nullable } from '@domain/shared';

import { AccessToken } from './access-token';
import { RefreshToken } from './refresh-token';

abstract class TokenProviderDomainService {
  public abstract createAccessToken(
    uuid: string,
    userUuid: string,
    username: string,
    email: string,
    roles: string[]
  ): AccessToken;

  public abstract createRefreshToken(uuid: string, userUuid: string): RefreshToken;

  public abstract parseAccessToken(token: string): Nullable<AccessToken>;

  public abstract parseRefreshToken(token: string): Nullable<RefreshToken>;
}

export { TokenProviderDomainService };
