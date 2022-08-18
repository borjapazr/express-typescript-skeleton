import { DomainException } from './domain.exception';

class InvalidParameterException extends DomainException {
  constructor(message: string) {
    super('invalid_parameter', message);
  }
}

export { InvalidParameterException };
