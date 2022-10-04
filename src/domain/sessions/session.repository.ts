import { Nullable } from '@domain/shared';

import { Session } from './session';
import { SessionUuid } from './session-uuid';

abstract class SessionRepository {
  public abstract findByUuid(uuid: SessionUuid): Promise<Nullable<Session>>;

  public abstract create(refreshToken: Session): Promise<Session>;

  public abstract update(refreshToken: Session): Promise<Session>;

  public abstract delete(uuid: SessionUuid): Promise<void>;
}

export { SessionRepository };
