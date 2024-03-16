import { UseCaseRequest } from '@shared/application';
import { TriggeredBy } from '@shared/domain/entities/triggered-by';
import { InvalidParameterException } from '@shared/domain/exceptions';

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
