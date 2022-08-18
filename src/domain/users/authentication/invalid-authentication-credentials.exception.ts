import { DomainException } from '@domain/shared/exceptions';

class InvalidAuthenticationCredentialsException extends DomainException {
  constructor(username: string) {
    super('invalid_authentication_password', `The credentials for user <${username}> are invalid`);
  }
}

export { InvalidAuthenticationCredentialsException };
