import { IXaiError } from './xai-error.types';
import { fixProto, fixStack } from './xai-error.util';

export class XaiError extends Error implements IXaiError {
  readonly name: string = 'XaiError';
  code: number = 400;

  setCode(code: number) {
    this.code = code;
  }

  constructor(message?: string, options?: ErrorOptions) {
    super(message, options);
    Object.defineProperty(this, 'name', {
      value: new.target.name,
      enumerable: false,
      configurable: true,
    });

    fixProto(this, new.target.prototype);

    fixStack(this);
  }
}
