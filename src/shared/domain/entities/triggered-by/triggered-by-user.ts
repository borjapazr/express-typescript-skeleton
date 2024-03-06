import { TriggeredBy } from './triggered-by';

class TriggeredByUser extends TriggeredBy {
  readonly roles: string[];

  constructor(user: string, roles: string[]) {
    super(user);
    this.roles = roles;
  }

  public isByAnonymous(): boolean {
    return false;
  }

  public isBySystem(): boolean {
    return false;
  }

  public isByUser(): boolean {
    return true;
  }
}

export { TriggeredByUser };
