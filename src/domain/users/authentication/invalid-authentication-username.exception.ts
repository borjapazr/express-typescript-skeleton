import { DomainException } from '@domain/shared/exceptions';

class InvalidAuthenticationUsernameException extends DomainException {
  constructor(username: string) {
    super('invalid_authentication_username', `The user with username <${username}> does not exist`);
  }
}

export { InvalidAuthenticationUsernameException };
