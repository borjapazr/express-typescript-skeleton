import { UseCaseRequest } from '@application/shared';
import { TriggeredBy } from '@domain/shared/entities/triggered-by';
import { InvalidParameterException } from '@domain/shared/exceptions';

class FindUserRequest extends UseCaseRequest {
  readonly uuid: string;

  constructor(triggeredBy: TriggeredBy, uuid: string) {
    super(triggeredBy);
    this.uuid = uuid;
  }

  public static create(triggeredBy: TriggeredBy, uuid: string): FindUserRequest {
    return new FindUserRequest(triggeredBy, uuid);
  }

  protected validatePayload(): void {
    if (this.uuid == null) {
      throw new InvalidParameterException('User UUID must be provided');
    }
  }
}

export { FindUserRequest };
