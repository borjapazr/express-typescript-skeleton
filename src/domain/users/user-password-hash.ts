import { HasherDomainService } from '@domain/shared/services';
import { StringValueObject } from '@domain/shared/value-object';

class UserPasswordHash extends StringValueObject {
  public static async createFromPlainPassword(userPassword: string): Promise<UserPasswordHash> {
    const hashedUserPassword = await HasherDomainService.hash(userPassword);
    return new UserPasswordHash(hashedUserPassword);
  }

  public async checkIfMatchesWithPlainPassword(password: string): Promise<boolean> {
    return HasherDomainService.compare(password, this.value);
  }
}

export { UserPasswordHash };
