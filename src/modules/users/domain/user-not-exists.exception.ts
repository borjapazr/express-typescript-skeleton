import { DomainException } from '@shared/domain/exceptions';

class UserNotExistsException extends DomainException {
  constructor(uuid: string) {
    super('user_not_exists', `User with UUID <${uuid}> does not exists`);
  }
}

export { UserNotExistsException };
