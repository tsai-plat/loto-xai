/**
 * @public
 * @property code reffer backend ErrorCode
 *  see @tsai-platform/common ErrorCodeEnum
 */
export interface IXaiError extends Error {
  code?: number;
}

export interface ErrorOptions {
  cause?: unknown;
}

export interface XaiErrorProperties {
  [property: string]: any;
}

export interface XaiErrorContructor<P extends XaiErrorProperties>
  extends ErrorConstructor {
  readonly prototype: IXaiError;
  new (...args: any[]): IXaiError & P;
  (...args: any): IXaiError & P;
}

export interface XaiErrorDataType {
  code?: number;
}
