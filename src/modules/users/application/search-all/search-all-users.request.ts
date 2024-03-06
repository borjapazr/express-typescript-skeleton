import { UseCaseRequest } from '@shared/application';
import { TriggeredBy } from '@shared/domain/entities/triggered-by';

class SearchAllUsersRequest extends UseCaseRequest {
  public static create(triggeredBy: TriggeredBy): SearchAllUsersRequest {
    return new SearchAllUsersRequest(triggeredBy);
  }

  protected validatePayload(): void {
    // no validation needed
  }
}

export { SearchAllUsersRequest };
