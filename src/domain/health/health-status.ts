class HealthStatus {
  readonly status: string;

  readonly message: string;

  constructor(status: string, message: string) {
    this.status = status;
    this.message = message;
  }
}

export { HealthStatus };
