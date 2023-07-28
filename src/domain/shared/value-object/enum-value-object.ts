abstract class EnumValueObject<T> {
  readonly value: T;

  constructor(
    value: T,
    public readonly validValues: T[]
  ) {
    this.value = value;
    this.checkIfValueIsValid(value);
  }

  public checkIfValueIsValid(value: T): void {
    if (!this.validValues.includes(value)) {
      this.throwErrorForInvalidValue(value);
    }
  }

  protected abstract throwErrorForInvalidValue(value: T): void;
}

export { EnumValueObject };
