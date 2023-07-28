import { deepEqual } from 'fast-equals';

import { TriggeredBy } from '@domain/shared/entities/triggered-by';
import { InvalidParameterException } from '@domain/shared/exceptions';

abstract class UseCaseRequest {
  readonly triggeredBy: TriggeredBy;

  constructor(triggeredBy: TriggeredBy) {
    this.triggeredBy = triggeredBy;
  }

  public validate(): void {
    if (this.triggeredBy == null) {
      throw new InvalidParameterException('Triggered By must be provided');
    }

    this.validatePayload();
  }

  public equalsTo(other: UseCaseRequest): boolean {
    return deepEqual(this, other);
  }

  public toString(): string {
    return JSON.stringify(this);
  }

  protected abstract validatePayload(): void;
}

export { UseCaseRequest };
