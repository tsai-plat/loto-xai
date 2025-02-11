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
 *  SSE contructor options
 * @property eventDataParsed if true onMessage will return
 *  messageEvent.data as Object,otherwise
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
  eventDataParsed?: boolean;
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

/**
 * @public
 * @param prepareRequestData
 *  Before the SSE launch request,prepare request body or header parameters
 *  like reqid,msgid,pick user question and return by callback
 */
export type StreamablePrepareCallback = (
  prepareRequestData: IXaiStreamCache,
) => void;
