import {
  ChatCompletionDeveloperMessageParam,
  ChatCompletionSystemMessageParam,
  ChatCompletionToolMessageParam,
  ChatCompletionUserMessageParam,
} from 'openai/resources/chat/completions';
import { ModelProviderType } from 'src/ai-provider';
import { XaiModelBaseOption } from './model-types';

export type ChatRoleType = 'user' | 'assistant' | 'system';
export type ChatRoleExtendType = ChatRoleType | 'tool' | 'developer' | string;

/**
 * front user request body messages
 */
export type XaiChatRequestMessage =
  | ChatCompletionDeveloperMessageParam
  | ChatCompletionSystemMessageParam
  | ChatCompletionUserMessageParam
  | ChatCompletionToolMessageParam;

/**
 *
 */
export type OpenaiChatBody = {
  model?: string;
  messages?: Array<XaiChatRequestMessage>;
  aiopts?: XaiModelBaseOption;
  [k: string]: any;
};

export type XaiChatExtraData = {
  reqid: string;
  uno?: string;
  username?: string;
  ip?: string;
  cliid?: string | string[];
  msgid?: string;
  [k: string]: any;
};

/**
 * @public
 *  xai streaming request body properties
 * @property chatid front conversation id,if simle can set with user name.
 * @property uuid refer backend prompt template uuid
 * @property text front user input text
 * @property compatible openai beta like systemMessage
 * @property extra is request header and extra data
 */
export type XaiChatRequestBody = {
  chatid: string;
  provider: ModelProviderType | string;
  uuid?: number;
  text?: string;
  instructions?: string;
  extra?: XaiChatExtraData;
} & OpenaiChatBody;
