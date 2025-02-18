/**
 * Front end UI storage types
 */

import { ChatRoleExtendType } from '../../chat/chat-types';
import { ModelProviderType, XaiModelType } from '../../ai-provider';

/**
 * @public remote agent preset model options
 * @param uuid Establish association between front-end and back-end
 * @param system some model can set roles through system message
 * @param modelId provider model unique
 * @param model extend options,mainly used in the backend
 * @param group
 */
export type XaiAgentPET = {
  uuid: number;
  title: string;
  system?: string;
  modelId: string;
  modelOptions?: Record<string, any>;
  group: string;
  [k: string]: any;
};

/**
 * @public Xai front-end chat struct ,
 *  First created prehaps referenced from XaiAgentPET uuid & model
 * @param chatid string random for front agent id
 * @param uuid number reffered remote server PEs uuid
 * @param modelId unique model id string
 * @param provider ai provider string
 * @param model model string
 * @param system some model can set roles through system message
 * @param data message record
 */
export type ChatbotAgent = {
  chatid: string;
  title: string;
  created: number;
  uuid: number;
  modelId: string;
  provider: ModelProviderType;
  model: string;
  data: ChatbotMessage[];
  system?: string;
  usingContext?: boolean;
  [k: string]: any;
};

/**
 * compatible openai
 */
export type ChatAttachType =
  | 'text'
  | 'web_url'
  | 'input_audio'
  | 'image_url'
  | 'document_url'
  | 'video_url'
  | string;
export type ChatAttachDetailType =
  | 'text'
  | 'mp3'
  | 'web_url'
  | 'jpg'
  | 'pcm'
  | string;

/**
 * @public Chatbot Attachment Data
 * @param id string locale unique id
 * @param skey string remote unique id
 * @param url remote url
 * @param data attachment base64 data
 * @param cached boolean remote embedding cached
 * @param status attachment parse status 0:locale, -1:invalid
 */
export type ChatbotAttach = {
  id: string;
  skey?: string;
  type: ChatAttachType;
  detailType?: ChatAttachDetailType;
  filename?: string;
  url?: string;
  data?: string;
  cached?: boolean;
  status?: number;
  [k: string]: any;
};

/**
 * @public Chatbot UI Message storage
 * @param reqid request id
 */
export type ChatbotMessage = {
  msgid: string;
  chatid: string;
  created: number;
  text: string;
  error?: boolean;
  loading?: boolean;
  inversion?: boolean;
  attach?: ChatbotAttach[];
  suggestions?: string[];
  reqid?: string;
  role?: ChatRoleExtendType;
  [k: string]: any;
};

/**
 * @public front chat conversation records
 * @param chatid string unique for front app
 * @param data message list
 */
export type Chatbot = {
  chatid: string;
  data: ChatbotMessage[];
};

/**
 * @public front localstorage struct for xaibot
 * @param activedId current actived agent chatid
 * @param agents all user chatbot agents
 * @param models all xagent-proxy support models
 * @param pets remote XaiAgentPET
 */
export type XaiBotState = {
  activedId: string;
  agents: ChatbotAgent[];
  models: XaiModelType[];
  pets: XaiAgentPET[];
};
