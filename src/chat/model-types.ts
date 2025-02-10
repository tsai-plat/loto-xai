import {
  ResponseFormatJSONObject,
  ResponseFormatJSONSchema,
  ResponseFormatText,
} from 'openai/resources/shared';

export type SharedMetadata = {
  [k: string]: string;
};

/**
 * @public
 * Compatible with openai
 * @see more documents : https://platform.openai.com/docs/api-reference/introduction
 */
export type XaiModelBaseOption = {
  /**
   * Number between -2.0 and 2.0. Positive values penalize new tokens based on their
   * existing frequency in the text so far, decreasing the model's likelihood to
   * repeat the same line verbatim.
   */
  frequency_penalty?: number | null;
  max_tokens?: number | null;
  max_completion_tokens?: number | null;
  /**
   * Set of 16 key-value pairs that can be attached to an object. This can be useful
   * for storing additional information about the object in a structured format, and
   * querying for objects via API or the dashboard.
   *
   * Keys are strings with a maximum length of 64 characters. Values are strings with
   * a maximum length of 512 characters.
   */
  metadata?: SharedMetadata | null;

  response_format?:
    | ResponseFormatText
    | ResponseFormatJSONObject
    | ResponseFormatJSONSchema;

  stop?: string | null | Array<string>;

  /**
   * What sampling temperature to use, between 0 and 2. Higher values like 0.8 will
   * make the output more random, while lower values like 0.2 will make it more
   * focused and deterministic. We generally recommend altering this or `top_p` but
   * not both.
   */
  temperature?: number | null;
  /**
   * A unique identifier representing your end-user, which can help OpenAI to monitor
   * and detect abuse.
   */
  user?: string;

  [k: string]: any;
};
