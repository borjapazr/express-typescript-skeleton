import { Nullable } from '@shared/domain';

import { Authentication } from './authentication';

class AuthenticationUtils {
  private static authentication: Nullable<Authentication>;

  public static getAuthentication(): Nullable<Authentication> {
    return this.authentication;
  }

  public static setAuthentication(authentication: Authentication): void {
    this.authentication = authentication;
  }

  public static clearAuthentication(): void {
    this.authentication = null;
  }
}

export { AuthenticationUtils };
