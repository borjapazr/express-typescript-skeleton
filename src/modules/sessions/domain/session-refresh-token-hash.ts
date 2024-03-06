import { HasherDomainService } from '@shared/domain/services';
import { StringValueObject } from '@shared/domain/value-object';

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
