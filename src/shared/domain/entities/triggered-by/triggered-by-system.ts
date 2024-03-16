import { TriggeredBy } from './triggered-by';

class TriggeredBySystem extends TriggeredBy {
  public static IDENTIFIER = 'system';

  constructor() {
    super(TriggeredBySystem.IDENTIFIER);
  }

  public isByAnonymous(): boolean {
    return false;
  }

  public isBySystem(): boolean {
    return true;
  }

  public isByUser(): boolean {
    return false;
  }
}

export { TriggeredBySystem };
