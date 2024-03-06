import { deepEqual } from 'fast-equals';

abstract class DomainEntity {
  public equalsTo(other: DomainEntity): boolean {
    return deepEqual(this, other);
  }

  public toString(): string {
    return JSON.stringify(this);
  }
}

export { DomainEntity };
