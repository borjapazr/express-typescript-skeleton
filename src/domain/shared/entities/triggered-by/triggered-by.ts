import { InvalidParameterException } from '@domain/shared/exceptions/invalid-parameter.exception';

abstract class TriggeredBy {
  who: string;

  protected constructor(who: string) {
    if (who == null) {
      throw new InvalidParameterException('Who identifier must be provided');
    }

    this.who = who;
  }

  public abstract isByAnonymous(): boolean;

  public abstract isBySystem(): boolean;

  public abstract isByUser(): boolean;
}

export { TriggeredBy };
