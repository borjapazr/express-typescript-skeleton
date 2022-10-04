import { UseCaseRequest } from '@application/shared';
import { Nullable } from '@domain/shared';
import { TriggeredBy } from '@domain/shared/entities/triggered-by';

class ValidateSessionRequest extends UseCaseRequest {
  readonly accessToken: Nullable<string>;

  readonly refreshToken: Nullable<string>;

  constructor(triggeredBy: TriggeredBy, accessToken: Nullable<string>, refreshToken: Nullable<string>) {
    super(triggeredBy);
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }

  public static create(
    triggeredBy: TriggeredBy,
    accessToken: Nullable<string>,
    refreshToken: Nullable<string>
  ): ValidateSessionRequest {
    return new ValidateSessionRequest(triggeredBy, accessToken, refreshToken);
  }

  protected validatePayload(): void {
    // no validation needed
  }
}

export { ValidateSessionRequest };
