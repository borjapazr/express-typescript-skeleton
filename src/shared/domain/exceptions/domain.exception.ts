abstract class DomainException extends Error {
  readonly code: string;

  readonly message: string;

  constructor(code: string, message: string) {
    super(message);
    this.name = new.target.name;
    this.code = code;
    this.message = message;
  }
}

export { DomainException };
