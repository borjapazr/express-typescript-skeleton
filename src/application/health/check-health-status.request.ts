import { UseCaseRequest } from '@application/shared';
import { TriggeredBy } from '@domain/shared/entities/triggered-by';

class CheckHealthStatusRequest extends UseCaseRequest {
  readonly appVersion: string;

  constructor(triggeredBy: TriggeredBy, appVersion: string) {
    super(triggeredBy);
    this.appVersion = appVersion;
  }

  public static create(triggeredBy: TriggeredBy, appVersion: string): CheckHealthStatusRequest {
    return new CheckHealthStatusRequest(triggeredBy, appVersion);
  }

  protected validatePayload(): void {
    // no validation needed
  }
}

export { CheckHealthStatusRequest };
