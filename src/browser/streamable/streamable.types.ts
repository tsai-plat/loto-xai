import { XaiChatRequestBody } from '../../chat';
export type FetchFn = typeof fetch;
export type FetchMethod =
  | 'GET'
  | 'POST'
  | 'PUT'
  | 'PATCH'
  | 'DELETE'
  | 'HEAD'
  | 'OPTIONS'
  | 'CONNECT';

export type SseEventType = 'message' | 'error' | 'close' | 'cancel' | string;
export type SseCallbackFn<T = any> = (data?: T) => void;

export type XaiBearerHeaders = {
  Authorization: string;
  'X-Loto-Key'?: string;
  'X-Loto-Reqid'?: string;
  [k: string]: any;
};

/**
 * @public
 * @property checkAuth is check Authorization in header
 * @property apiBasePrefix :/api/v1
 * @property token priority over bearerHeaders,use bearer potocol
 * @property bearerHeaders contains  Authorization & clientid
 * @property onmessage,onclose,oncancel,onerror callback function
 */
export type XaiStreamableOptions = {
  checkAuth?: boolean;
  apiBasePrefix?: string;
  debug?: boolean;
  method?: FetchMethod | string;
  token?: string;
  bearerHeaders?: XaiBearerHeaders;
  fetch?: FetchFn;
  onmessage: SseCallbackFn;
  onclose?: SseCallbackFn;
  oncancel?: SseCallbackFn;
  onerror?: SseCallbackFn;
};

export interface XaiStreamableRequestData extends XaiChatRequestBody {
  msgid?: string;
  reqid?: string;
  controller?: AbortController;
  headers?: Record<string, string>;
}

export interface IXaiStreamCache {
  chatid?: string;
  reqid: string;
  msgid: string;
  created: number;
  provider?: string;
  model?: string;
  question?: string;
  [k: string]: any;
}

export interface XaiStreamCompleteData extends IXaiStreamCache {
  costTime?: string;
  result: string;
}
