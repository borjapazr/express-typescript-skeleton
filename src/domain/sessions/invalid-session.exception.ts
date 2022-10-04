import { DomainException } from '@domain/shared/exceptions';

class InvalidSessionException extends DomainException {
  constructor() {
    super('invalid_session', `Invalid session`);
  }
}

export { InvalidSessionException };
