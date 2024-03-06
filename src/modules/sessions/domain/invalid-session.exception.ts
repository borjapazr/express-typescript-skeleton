import { DomainException } from '@shared/domain/exceptions';

class InvalidSessionException extends DomainException {
  constructor() {
    super('invalid_session', `Invalid session`);
  }
}

export { InvalidSessionException };
