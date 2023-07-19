type Nullable<T> = T | null | undefined;

type Primitive = bigint | boolean | null | number | string | symbol | undefined;

type PlainObject = Record<string, Primitive>;

export { Nullable, PlainObject, Primitive };
