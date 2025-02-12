export const XAI_SSE_MESSAGE_STOP_VALUE = 'stop';

/**
 * @public
 *  xai SSE message data struct
 * @property id is ai provider return chunk id
 * @property content  is ai chunk content,like openai choices[0].delta.content
 * @property finish_reason chunk choice finish_reason
 *  with openai,deepseek will stop or null
 * @property errcode: proxy logic transform error sign witch provider
 *  maybe after call ai chat.completion but does't connecting ai provider
 *
 */
export type SseMessageChunkData = {
  id?: string;
  content: string;
  errcode?: string;
  finish_reason?: string | null;
  is_end?:boolean
  [k: string]: any;
};

/**
 * @public
 *  xai SSE ERROR message data struct
 * @property id is ai provider return chunk id
 * @property errcode: proxy logic transform error sign witch provider
 *  maybe after call ai chat.completion but does't connecting ai provider
 */
export type SseErrorData = {
  id?: string;
  errcode?: string;
  errmsg: string;
  [k: string]: any;
};

/**
 * SSE
 */
export type SseMessageType = {
  id: string;
  event: string;
  data: string;
  retry?: number;
};
