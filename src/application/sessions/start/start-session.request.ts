import { UseCaseRequest } from '@application/shared';
import { TriggeredBy } from '@domain/shared/entities/triggered-by';
import { InvalidParameterException } from '@domain/shared/exceptions';

class StartSessionRequest extends UseCaseRequest {
  readonly userUuid: string;

  constructor(triggeredBy: TriggeredBy, userUuid: string) {
    super(triggeredBy);
    this.userUuid = userUuid;
  }

  public static create(triggeredBy: TriggeredBy, userUuid: string): StartSessionRequest {
    return new StartSessionRequest(triggeredBy, userUuid);
  }

  protected validatePayload(): void {
    if (this.userUuid == null) {
      throw new InvalidParameterException('User UUID must be provided');
    }
  }
}

export { StartSessionRequest };
