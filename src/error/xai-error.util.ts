/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-function-type */
/**
 *
 * @param target
 * @param prototype
 */
export function fixProto(target: Error, prototype: {}) {
  const setPrototypeOf: Function = (Object as any).setPrototypeOf;
  setPrototypeOf
    ? setPrototypeOf(target, prototype)
    : ((target as any).__proto__ = prototype);
}

export function fixStack(target: Error, fn: Function = target.constructor) {
  const captureStackTrace: Function = (Error as any).captureStackTrace;

  captureStackTrace && captureStackTrace(target, fn);
}
