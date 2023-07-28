import { DateTime } from 'luxon';

import { ValueObject } from './value-object';

abstract class DateValueObject extends ValueObject<Date> {
  public static fromISOString<T extends DateValueObject>(this: new (value: Date) => T, dateISOString: string): T {
    const dateObject = DateTime.fromISO(dateISOString).toJSDate();
    return new this(dateObject);
  }

  public toString(): string {
    return this.value.toISOString();
  }
}

export { DateValueObject };
