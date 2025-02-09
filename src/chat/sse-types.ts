/**
 * xai SSE message data struct
 * id is ai provider return chunk id
 * content is ai chunk content,like openai choices[0].delta.content
 * error: maybe after call ai chat.completion but does't connecting ai provider
 *
 */
export type SseMessageChunkData = {
  id?: string;
  content: string;
  error?: string;
  [k: string]: any;
};
