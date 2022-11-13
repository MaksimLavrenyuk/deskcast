const has = Object.prototype.hasOwnProperty;

/**
 * Type Guard for checking if the object corresponds to a type.
 *
 * @param obj - Object to be checked.
 * @param prop - Property contained in the object.
 */
export default function isType<T>(
  obj: unknown,
  prop: string,
): obj is T {
  return typeof obj === 'object' && obj !== null && has.call(obj, prop);
}
