import { UserUsername } from '@modules/users/domain/user-username';
import { Nullable } from '@shared/domain';

import { User } from './user';
import { UserEmail } from './user-email';
import { UserUuid } from './user-uuid';

abstract class UserRepository {
  public abstract findByUuid(uuid: UserUuid): Promise<Nullable<User>>;

  public abstract findByUsername(username: UserUsername): Promise<Nullable<User>>;

  public abstract findByEmail(email: UserEmail): Promise<Nullable<User>>;

  public abstract findAll(): Promise<User[]>;

  public abstract create(user: User): Promise<User>;

  public abstract update(user: User): Promise<User>;

  public abstract delete(uuid: UserUuid): Promise<void>;
}

export { UserRepository };
