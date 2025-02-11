/* eslint-disable @typescript-eslint/no-unused-expressions */
import { SSE_ERROE_CODE, XaiError } from '../../error';
import { EventStreamContentType, globalFetch } from './index';
import {
  SseMessageChunkData,
  SseMessageType,
  XAI_SSE_MESSAGE_STOP_VALUE,
} from '../../chat';

import {
  calcCostTime,
  createChatMessageId,
  createRequestId,
} from '../../utils';
import { SseFetchError } from './streamable.error';
import type {
  FetchFn,
  FetchMethod,
  IXaiStreamCache,
  SseCallbackFn,
  SseEventType,
  StreamablePrepareCallback,
  XaiStreamableOptions,
  XaiStreamableRequestData,
  XaiStreamCompleteData,
} from './streamable.types';
import { getBytes, getLines, SSEContolChars } from './streamable.parser';

const defaultCloseHandler: SseCallbackFn = (data?: IXaiStreamCache): void => {
  if (data) {
    globalThis.console.log(
      `Xai Request ${data.reqid} ${data.provider} completed.\n${data.result}`,
    );
  }
};

const defaultErrorHandler: SseCallbackFn = (err: any) => {
  globalThis.console.error(`Xai streamable error`, err);
};

const MAX_LISTENERS = 3;
const delayCloseMillionSeconds = 100;
const AUTO_ABORT_REASON = 'completed';

/**
 *
 */
export class XaiStreamFetch {
  private checkAuth = true;
  protected debug: boolean = false;

  private method: FetchMethod | string = 'POST';
  protected controller?: AbortController;
  private apiPrefix = '/api/v3';
  private readonly apiPath: string;
  private readonly fetchFn: FetchFn;

  protected headers: { [k: string]: any } = {
    'Content-type': 'application/json',
    'accept': EventStreamContentType,
  };
  private fetchInprogress: boolean = false;
  private reqCached: IXaiStreamCache = { reqid: '', msgid: '', created: 0 };

  private eventListeners: { [k: SseEventType]: SseCallbackFn[] } = {};

  private sseCaches: {
    messages: SseMessageType[];
    result: string;
    costTime?: string;
    error?: string;
  } = {
    messages: [],
    result: '',
  };

  constructor(apiPath: string, options: XaiStreamableOptions) {
    if (!apiPath?.length) throw new Error(`Xai Streamable apiPath illegal.`);
    this.apiPath = apiPath;
    const {fetch = globalFetch} = options
    this.fetchFn = fetch
    if (!this.fetchFn) throw new Error(`your enviroment no fetch.`);

    this._registListeners(options);
  }

  get url(): string {
    const url = this.apiPrefix?.endsWith('/')
      ? this.apiPrefix.substring(0, this.apiPrefix.length - 2)
      : this.apiPrefix;
    return this.apiPath?.startsWith('/')
      ? `${url}${this.apiPath}`
      : `${url}/${this.apiPath}`;
  }

  /**
   * request id
   */
  get reqid(): string {
    return this.reqCached.reqid;
  }

  get msgid(): string {
    return this.reqCached.msgid;
  }

  get inprogress(): boolean {
    return this.fetchInprogress;
  }

  get error(): string | undefined {
    return this.reqCached?.error;
  }

  get result(): string {
    return this.sseCaches.result;
  }

  protected log(
    data: any,
    type: 'error' | 'warn' | 'log' = 'warn',
    prefix?: string,
  ) {
    switch (type) {
      case 'log':
        this.debug &&
          (prefix
            ? globalThis.console.log(prefix, data)
            : globalThis.console.log(data));
        break;
      case 'warn':
        this.debug &&
          (prefix
            ? globalThis.console.warn(prefix, data)
            : globalThis.console.warn(data));
        break;
      case 'error':
        prefix
          ? globalThis.console.error(prefix, data)
          : globalThis.console.error(data);
        break;
      default:
        break;
    }
  }

  /**
   * @public
   *  launch fetch request
   * @param data request data
   * @param cb prepare request parametes callback
   * @returns XaiStreamFetch instance
   */
  public async connect<
    D extends XaiStreamableRequestData = XaiStreamableRequestData,
  >(data: D, cb?: StreamablePrepareCallback): Promise<XaiStreamFetch> {
    // ignore inprogress
    if (this.inprogress) {
      this.log(`Preovus Requset ${this.reqid} had inprogress.`, 'error');
      return this;
    }
    // initialize request inner cache
    await this.createRequestCache(data);
    await this.setQuestion(data);

    // reset sse response caches
    await this.resetPrepareCaches();

    const { controller, headers, ...others } = data;

    const reqHeaders = await this.prepareHeaders(headers);

    // before luanch sse call
    await cb?.(this.reqCached);

    try {
      this.controller = controller ?? new AbortController();
      // remove first then add event
      this.controller.signal.removeEventListener(
        'abort',
        this.abortEventHandler.bind(this),
      );
      this.controller.signal.addEventListener(
        'abort',
        this.abortEventHandler.bind(this),
      );

      const url = this.url;
      this.log(`Request SSE ${url} with ${this.reqid}`, 'log');

      const response = await this.fetchFn(url, {
        method: this.method,
        body: others ? JSON.stringify({ ...others, stream: true }) : undefined,
        signal: this.controller.signal,
        headers: {
          ...reqHeaders,
        },
      });

      if (!response.ok) {
        throw SseFetchError.newClientError(
          response.status,
          response.statusText,
        );
      }
      this.fetchInprogress = true;
      const contentType = await response.headers.get('Content-Type');
      if (!contentType?.includes(EventStreamContentType)) {
        throw SseFetchError.newClientError(
          SSE_ERROE_CODE,
          'Please check remote api is SSE mode.',
        );
      }

      const stream: ReadableStream<Uint8Array> | null = response.body;

      if (stream) {
        const readChunkMessage = this._parseChunkMessage.bind(this);
        await getBytes(stream, getLines(readChunkMessage()));
      }
      this.fetchInprogress = false;
      return this;
    } catch (e: any) {
      this.log(e, 'error');

      this.updateSomeRequestCache({ error: e?.message });

      if (e?.name === 'AbortError') {
        this.log(`You cancel the request.`);
        return this;
      }

      if (e instanceof SseFetchError || e instanceof XaiError) {
        this.dispatchEvent('error', e);
      } else {
        this.dispatchEvent('error', SseFetchError.createFromError(e));
      }
    } finally {
      this.fetchInprogress = false;
    }

    return this;
  }

  /**
   * disconnect
   */
  disconnect() {
    if (this.controller) {
      const costTime = calcCostTime(this.reqCached.created);
      this.updateSomeSseCahces({ costTime });
      this.controller.abort(AUTO_ABORT_REASON);
    }
  }

  cancel() {
    if (this.controller?.signal && this.controller.signal.aborted === false) {
      this.controller.abort(`Client user canceled this request ${this.reqid}`);
    }
  }

  /**
   *
   * @param eventName
   * @param data
   * @returns void
   */
  protected dispatchEvent<T = any>(eventName: SseEventType, data: T) {
    if (!this.eventListeners[eventName]?.length) {
      this.log(data, 'log', `${eventName} not registed.`);
      return;
    }

    this.eventListeners[eventName].forEach((handler: SseCallbackFn) => {
      handler(data as unknown as T);
    });
  }

  /**
   * when abort on completed will emit close
   * @param _ev
   */
  protected abortEventHandler(_ev: Event) {
    this.fetchInprogress = false;

    if (this.controller?.signal.reason === AUTO_ABORT_REASON) {
      const { reqid, msgid, created, chatid, provider, model } = this.reqCached;
      const { result, costTime } = this.sseCaches;

      const data: XaiStreamCompleteData = {
        reqid,
        msgid,
        created,
        chatid,
        provider,
        model,
        costTime,
        result,
      };
      this.dispatchEvent<XaiStreamCompleteData>('close', data);
    } else if (this.controller?.signal.reason) {
      this.log(this.controller.signal.reason, 'warn');
    }
  }

  /**
   * regist event
   * @param eventName
   * @param handler
   */
  addListener(eventName: SseEventType, handler: SseCallbackFn) {
    if (!this.eventListeners[eventName]) this.eventListeners[eventName] = [];

    if (this.eventListeners[eventName].length >= MAX_LISTENERS) {
      this.log(
        `SSEFetch ${eventName} listeners more than ${MAX_LISTENERS} limit.`,
      );
      return this;
    }

    this.eventListeners[eventName].push(handler);

    return this;
  }

  /**
   *
   * @param eventName
   * @param handler
   * @returns
   */
  removeListener(
    eventName: SseEventType,
    handler: SseCallbackFn,
  ): XaiStreamFetch {
    if (!this.eventListeners[eventName]?.length) return this;

    if (!handler) {
      const size = this.eventListeners[eventName].length;
      this.eventListeners[eventName].splice(0, size);
      return this;
    }

    const idx = this.eventListeners[eventName].findIndex((h) => h === handler);
    if (idx >= 0) {
      this.eventListeners[eventName].splice(idx, 1);
    }

    return this;
  }

  /**
   * @private
   * init request cache & put reqid into header
   *
   * @param data
   * front request Data if reqid or msgid is null
   *  will auto created and fill to data
   */
  private async createRequestCache<
    D extends XaiStreamableRequestData = XaiStreamableRequestData,
  >(data: D) {
    const { uuid, chatid, model, provider } = data;
    let { msgid, reqid } = data;

    if (!msgid?.length) {
      msgid = await createChatMessageId(16, uuid);
      data.msgid = msgid;
    }

    if (!reqid?.length) {
      reqid = await createRequestId();
      data.reqid = reqid;
    }

    this.reqCached = {
      created: Date.now(),
      msgid,
      reqid,
      chatid,
      model,
      provider,
    } as IXaiStreamCache;

    await this.setHeaderReqid(reqid);
  }

  /**
   * before call sse reset repsonse cache
   */
  private resetPrepareCaches() {
    this.sseCaches = {
      messages: [],
      result: '',
    };
  }

  private updateSomeSseCahces(some: { [k: string]: any }) {
    this.sseCaches = {
      ...this.sseCaches,
      ...some,
    };
  }

  /**
   * merge headers and check Authorization token
   * @param requestHeaders
   * @returns headers
   */
  private prepareHeaders(requestHeaders?: Record<string, string>) {
    const Authorization =
      requestHeaders?.Authorization ?? this.headers?.Authorization;
    if (this.checkAuth && !Authorization?.length)
      throw SseFetchError.newClientError(
        401,
        `Required login Authorization token.`,
      );

    return {
      ...this.headers,
      ...requestHeaders,
      Authorization,
    };
  }

  private setHeaderReqid(reqid: string) {
    this.headers['X-Loto-Reqid'] = reqid;
  }

  /**
   *
   * @param some
   */
  private updateSomeRequestCache(some: Record<string, any>) {
    this.reqCached = {
      ...this.reqCached,
      ...some,
    };
  }

  private resetReqCache() {
    this.reqCached = { reqid: '', msgid: '', created: 0 };
  }

  /**
   *
   * @param options
   */
  private _registListeners(options: XaiStreamableOptions) {
    const {
      checkAuth,
      apiBasePrefix,
      method,
      debug,
      bearerHeaders,
      token,
      onmessage,
      oncancel,
      onclose = defaultCloseHandler,
      onerror = defaultErrorHandler,
    } = options;
    this.debug = Boolean(debug);
    this.checkAuth = Boolean(checkAuth);
    if (method?.length) this.method = method;
    if (apiBasePrefix?.length) this.apiPrefix = apiBasePrefix;

    this.headers = {
      ...this.headers,
      ...bearerHeaders,
    };
    if (token?.length) {
      this.headers = {
        ...this.headers,
        Authorization: `Bearer ${token}`,
      };
    }

    if (typeof onmessage !== 'function')
      throw new Error(
        'Parameter onmessage required an function of SseCallbackFn.',
      );

    this.addListener('message', onmessage);
    this.addListener('close', onclose);
    this.addListener('error', onerror);

    if (oncancel) this.addListener('cancel', oncancel);
  }

  private pushMessageCache(message: SseMessageType) {
    if (!this.sseCaches.messages) {
      this.sseCaches.messages = [];
    }
    this.sseCaches.messages.push(message);
  }

  private appendResult(chunk: string) {
    const old = this.sseCaches.result ?? '';
    this.updateSomeSseCahces({ result: `${old}${chunk}` });
  }

  private setQuestion<
    D extends XaiStreamableRequestData = XaiStreamableRequestData,
  >(data: D) {
    const { text, messages } = data;
    let q: string = text ?? '';

    if (messages?.length && messages.slice(-1)[0].role === 'user') {
      if (typeof messages.slice(-1)[0].content === 'string') {
        q = messages.slice(-1)[0].content as string;
      }
    }

    if (q.length) {
      this.reqCached.question = q;
    }
  }

  /**
   * @private
   *
   * @returns function onLine(arr:Uint8Array,fieldLength:number)=>void
   */
  protected _parseChunkMessage<
    C extends SseMessageChunkData = SseMessageChunkData,
  >() {
    let message = newMessage();

    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const that = this;

    const decoder = new TextDecoder();
    return function onLine(line: Uint8Array, fieldLength: number) {
      if (line.length === 0) {
        // message has filled by uint8array
        if (message.event === 'error' && message.data?.length) {
          that.log(message, 'error', `XSse ${that.url} ${that.reqid}`);
          throw SseFetchError.fromSseErrorData(message.data);
        }

        // empty line denotes end of message.
        // Trigger the callback and start a new message:
        if (message.data.length) {

          that.pushMessageCache(message);

          let chunkData: C | undefined;
          if (typeof message.data === 'object') {
            // nestjs not support sse data object
            that.log(message.data, 'log', `SSE data is object`);
            chunkData = message.data as unknown as C;
          } else {
            try {
              chunkData = JSON.parse(message.data) as unknown as C;
            } catch (e: any) {
              that.log(e, 'error', 'parse message.data error');
            }
          }

          if (chunkData?.content) {
            that.appendResult(chunkData.content);
          }

          // TODO message
          if(chunkData){
            that.dispatchEvent('message', message);
            // that.dispatchEvent('message', chunkData)
          }

          if (chunkData?.finish_reason === XAI_SSE_MESSAGE_STOP_VALUE) {
            setTimeout(() => {
              that.disconnect();
            }, delayCloseMillionSeconds);
          }
        }

        // an new message
        message = newMessage();
      } else if (fieldLength > 0) {
        // exclude comments and lines with no values
        // line is of format "<field>:<value>" or "<field>: <value>"
        // https://html.spec.whatwg.org/multipage/server-sent-events.html#event-stream-interpretation

        const field = decoder.decode(line.subarray(0, fieldLength));
        const valueOffset =
          fieldLength +
          (line[fieldLength + 1] === SSEContolChars.Space ? 2 : 1);
        const value = decoder.decode(line.subarray(valueOffset));

        that.log(`Recived ${field} ${value}`, 'log', 'Debug Xai SSE : ');
        switch (field) {
          case 'data':
            // if this message already has data, append the new value to the old.
            // otherwise, just set to the new value:
            message.data = message.data ? `${message.data}\n${value}` : value;
            break;
          case 'event':
            that.log(`Message event type is ${value}`, 'log');
            message.event = value;
            break;
          case 'id':
            that.updateSomeSseCahces({ prevousId: (message.id = value) });
            break;
          case 'retry':
            // eslint-disable-next-line no-case-declarations
            const retry = Number.parseInt(value, 10);
            if (!Number.isNaN(retry)) {
              // per spec, ignore non-integers
              message.retry = retry;
            }
            break;
          default:
            that.log(`Xai SSE unhandle field ${field}`, 'warn');
            break;
        }
      }
      // else if end
    };
  }
}

function newMessage(): SseMessageType {
  return {
    id: '',
    event: '',
    data: '',
    retry: undefined,
  } as SseMessageType;
}
