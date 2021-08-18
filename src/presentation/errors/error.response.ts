class ErrorResponse {
  public status: number;

  public code: string;

  public message: string;

  constructor(status: number, code: string, message: string) {
    this.status = status;
    this.code = code;
    this.message = message;
  }
}

export { ErrorResponse };
