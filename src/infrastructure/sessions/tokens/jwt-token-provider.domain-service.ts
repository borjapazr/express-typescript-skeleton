import jwt from 'jsonwebtoken';
import { DateTime } from 'luxon';

import { AccessToken, RefreshToken, TokenProviderDomainService } from '@domain/sessions/tokens';
import { TokenType } from '@domain/sessions/tokens/token';
import { DomainService, Nullable } from '@domain/shared';
import { AppConfig } from '@presentation/config/app.config';

@DomainService(TokenProviderDomainService)
class JwtTokenProvider extends TokenProviderDomainService {
  private readonly jwtAlgorithm: any = 'HS512';

  private readonly jwtSecret: string = AppConfig.JWT_SECRET;

  private readonly jwtExpiration: number = AppConfig.JWT_EXPIRATION;

  private readonly jwtRefreshExpiration: number = AppConfig.JWT_REFRESH_EXPIRATION;

  public createAccessToken(
    uuid: string,
    userUuid: string,
    username: string,
    email: string,
    roles: string[]
  ): AccessToken {
    const expiration = this.getAccessTokenExpiration();
    const jwtToken = jwt.sign(
      { type: TokenType.ACCESS_TOKEN, uuid, userUuid, username, email, roles, exp: expiration },
      this.jwtSecret,
      {
        algorithm: this.jwtAlgorithm
      }
    );
    return new AccessToken(uuid, jwtToken, expiration, userUuid, username, email, roles);
  }

  public createRefreshToken(uuid: string, userUuid: string): RefreshToken {
    const expiration = this.getRefreshTokenExpiration();
    const jwtToken = jwt.sign({ type: TokenType.REFRESH_TOKEN, uuid, userUuid, exp: expiration }, this.jwtSecret, {
      algorithm: this.jwtAlgorithm
    });

    return new RefreshToken(uuid, jwtToken, expiration, userUuid);
  }

  public parseAccessToken(token: string): Nullable<AccessToken> {
    try {
      const { type, uuid, userUuid, username, email, roles, exp } = <any>jwt.verify(token, this.jwtSecret, {
        algorithms: [this.jwtAlgorithm]
      });
      return type === TokenType.ACCESS_TOKEN
        ? new AccessToken(uuid, token, exp, userUuid, username, email, roles)
        : null;
    } catch {
      return null;
    }
  }

  public parseRefreshToken(token: string): Nullable<RefreshToken> {
    try {
      const { type, uuid, userUuid, exp } = <any>jwt.verify(token, this.jwtSecret, {
        algorithms: [this.jwtAlgorithm]
      });
      return type === TokenType.REFRESH_TOKEN ? new RefreshToken(uuid, token, exp, userUuid) : null;
    } catch {
      return null;
    }
  }

  private getAccessTokenExpiration(): number {
    return Math.floor(
      DateTime.utc()
        .plus({ millisecond: this.jwtExpiration * 3_600_000 })
        .toSeconds()
    );
  }

  private getRefreshTokenExpiration(): number {
    return Math.floor(
      DateTime.utc()
        .plus({ millisecond: this.jwtRefreshExpiration * 3_600_000 })
        .toSeconds()
    );
  }
}

export { JwtTokenProvider };
