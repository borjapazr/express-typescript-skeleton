import { TriggeredBy } from './triggered-by';

class TriggeredByAnonymous extends TriggeredBy {
  public static IDENTIFIER = 'anonymous';

  constructor() {
    super(TriggeredByAnonymous.IDENTIFIER);
  }

  public isByAnonymous(): boolean {
    return true;
  }

  public isBySystem(): boolean {
    return false;
  }

  public isByUser(): boolean {
    return false;
  }
}

export { TriggeredByAnonymous };
