import { once } from '../once';

export type LazyValue<T> = () => Readonly<T>;
type LazyFn = <T>(cb: () => T) => LazyValue<T>;

export const lazy = once as LazyFn;

export function defineLazyProperty<
  ObjectType extends Record<string, any>,
  PropertyNameType extends string,
  PropertyValueType
>(
  object: ObjectType,
  propertyName: PropertyNameType,
  valueGetter: () => PropertyValueType
): ObjectType & { [K in PropertyNameType]: PropertyValueType } {
  const define = (value: PropertyValueType) => Object.defineProperty(object, propertyName, { value, enumerable: true, writable: true });

  Object.defineProperty(object, propertyName, {
    configurable: true,
    enumerable: true,
    get() {
      const result = valueGetter();
      define(result);
      return result;
    },
    set(value) {
      define(value);
    }
  });

  return object;
}
