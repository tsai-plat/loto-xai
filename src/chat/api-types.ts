/**
 * @public
 *
 */
export interface CommonResponse<T = any> {
  code?: number;
  message?: string;
  result: T | undefined;
  error?: string | string[] | undefined | null;
}
