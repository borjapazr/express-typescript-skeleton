abstract class DomainError extends Error {
  public errorCode: string;

  public errorMessage: string;

  constructor(errorCode: string, errorMessage: string) {
    super(errorMessage);
    this.name = new.target.name;
    this.errorCode = errorCode;
    this.errorMessage = errorMessage;
  }
}

export { DomainError };
