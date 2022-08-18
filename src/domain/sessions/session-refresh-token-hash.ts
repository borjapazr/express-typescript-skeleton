import { HasherDomainService } from '@domain/shared/services';
import { StringValueObject } from '@domain/shared/value-object';

class SessionRefreshTokenHash extends StringValueObject {
  public static async createFromPlainRefreshToken(refreshToken: string): Promise<SessionRefreshTokenHash> {
    const hashedRefreshToken = await HasherDomainService.hash(refreshToken);
    return new SessionRefreshTokenHash(hashedRefreshToken);
  }

  public async checkIfMatchesWithPlainRefreshToken(refreshToken: string): Promise<boolean> {
    return HasherDomainService.compare(refreshToken, this.value);
  }
}

export { SessionRefreshTokenHash };
