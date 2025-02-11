export * from './xai-error.types';
export * from './xai-error.codes';
export { XaiError } from './xai-error';
export const XAI_SUCCESS_CODE = 200;
export const XAI_SUCCESS_CODES = [0, XAI_SUCCESS_CODE, 201, 203];

/**
 *
 * @param code
 * @returns boolean
 */
export const assertSuccess = (code?: number): boolean => {
  if (!code) return true;
  return XAI_SUCCESS_CODES.includes(code);
};
