import {
  SSE_ERROE_CODE,
  XAI_ERROR_CODE_400,
  XaiError,
  xaiErrorMessages,
  XaiErrorMessageType,
} from '../../error';

/**
 *
 */
export class SseFetchError extends XaiError {
  constructor(
    public code: number,
    message: string,
  ) {
    super(message);
    this.setCode(code);
  }

  /**
   * get error message
   * @param messages if has messages map,will translate code to message with customize.
   * @returns string
   */
  public getErrorMessage<M extends XaiErrorMessageType = XaiErrorMessageType>(
    messages?: M,
  ): string {
    let msg =
      this.code !== undefined
        ? `[${this.code}] ${this.message}`
        : `${this.message}`;
    if (messages && messages[this.code]) {
      msg = messages[this.code];
    }
    return msg;
  }

  public static createFromError<
    M extends XaiErrorMessageType = XaiErrorMessageType,
  >(err: any, messages?: M) {
    if (typeof err === 'string') {
      return new SseFetchError(SSE_ERROE_CODE, err as string);
    } else if (typeof err === 'object') {
      const code = err?.code;
      const msg = err.message;

      return new SseFetchError(code ?? SSE_ERROE_CODE, msg);
    } else if (typeof err === 'number') {
      const errmsg = messages
        ? messages[err as number]
        : xaiErrorMessages[err as number];
      return new SseFetchError(err, errmsg ?? 'Unknow Error');
    } else {
      return new SseFetchError(
        XAI_ERROR_CODE_400,
        'Construct XaiError illegal.',
      );
    }
  }

  /**
   *
   * @param status will reffer api httpStatus Or Response Data code
   * @param message will reffer api statusText Or Response Data message
   * @returns SseFetchError
   */
  public static newClientError(status: number, message?: string) {
    return new SseFetchError(
      status,
      message ?? xaiErrorMessages[status] ?? `Client unknow error[${status}].`,
    );
  }

  public static newSseError(status: number, statusText: string) {
    return new SseFetchError(status, statusText);
  }

  /**
   *
   * @param error api response data
   *   CommonResponse
   * @returns SseFetchError
   */
  public static fromSseErrorData(error: string | { [k: string]: any }) {
    if (typeof error === 'object') {
      const { code, message } = error as unknown as { [k: string]: any };
      if (!code && !message)
        return new SseFetchError(564, JSON.stringify(error));

      return new SseFetchError(code ?? SSE_ERROE_CODE, message ?? code);
    } else if (typeof error === 'string') {
      try {
        const { code, message } = JSON.parse(error as string);
        if (!code && !message)
          return new SseFetchError(SSE_ERROE_CODE, JSON.stringify(error));

        return new SseFetchError(code ?? SSE_ERROE_CODE, message ?? code);
      } catch (_e) {
        return new SseFetchError(SSE_ERROE_CODE, error as string);
      }
    }

    return new SseFetchError(SSE_ERROE_CODE, String(error));
  }
}
