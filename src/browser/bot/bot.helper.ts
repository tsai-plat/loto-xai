import { RandomHelper } from '../../utils';
import { XaiModelType } from '../../ai-provider';
import {
  ChatbotAgent,
  ChatbotAttach,
  ChatbotMessage,
  XaiAgentPET,
} from './chatbot-types';

export const defaultChatid = 'xaichat_1000';

/**
 * create first Default chatAgent
 */
export function createDefaultChatbotAgent(
  xaiModel: XaiModelType,
  pet?: Omit<XaiAgentPET, 'modelId' | 'group'>,
): ChatbotAgent {
  const { modelId, model, provider, modelName } = xaiModel;

  const agent: ChatbotAgent = {
    chatid: defaultChatid,
    uuid: pet?.uuid ?? 1000,
    title: pet?.title?.length ? pet.title : modelName,
    created: Date.now(),
    model,
    modelId,
    provider,
    system: pet?.system,
    data: [] as ChatbotMessage[],
  };

  return agent;
}

/**
 *
 * @param xaiModel
 * @param pet
 * @returns agent
 */
export function newChatbotAgent(
  xaiModel: XaiModelType,
  pet: XaiAgentPET,
): ChatbotAgent {
  const { provider, model, modelId, modelName } = xaiModel;
  const { title, uuid, system } = pet;
  const chatid: string = RandomHelper.createChatid();

  const agent: ChatbotAgent = {
    chatid,
    title: title?.length ? title : modelName,
    created: Date.now(),
    uuid,
    model,
    modelId,
    provider,
    system,
    data: [],
  };

  return agent;
}

/**
 *
 * @param chatid string required
 * @param text string
 * @returns ChatbotMessage
 */
export function createNewUserMessage(
  chatid: string,
  text: string,
): ChatbotMessage {
  return {
    msgid: RandomHelper.createMsgid(),
    chatid,
    created: Date.now(),
    text,
    error: false,
    loading: false,
    inversion: true,
    role: 'user',
  } as ChatbotMessage;
}

export function createInitAssistantMessage(
  chatid: string,
  reqid: string = RandomHelper.createReqid(),
): ChatbotMessage {
  return {
    msgid: RandomHelper.createMsgid(),
    chatid,
    reqid,
    created: Date.now(),
    text: '',
    error: false,
    loading: true,
    inversion: false,
    role: 'assistant',
  } as ChatbotMessage;
}

/**
 * when data not contains some.chatid return null
 * @param data
 * @param some
 * @returns data or null
 *
 */
export function updateSomeChatbotMessage(
  data: ChatbotMessage[],
  some: Omit<ChatbotMessage, 'chatid' | 'created' | 'inversion' | 'role'>,
): ChatbotMessage[] | null {
  if (!data?.length) return null;
  const { msgid, ...others } = some;
  const pos = data.findIndex((m) => m.msgid === msgid);

  if (pos < 0) {
    return null;
  }
  data.splice(pos, 1, { ...data[pos], ...others, msgid });

  return data;
}

/**
 *
 * @param attaches
 * @param attach
 * @returns ChatbotAttach[]
 */
export function mergeMessageAttach(
  attaches: ChatbotAttach[],
  attach: ChatbotAttach,
): ChatbotAttach[] {
  const idx = attaches.findIndex((a) => a.id === attach.id);
  if (idx < 0) {
    attaches.push(attach);
  } else {
    attaches.splice(idx, 1, { ...attaches[idx], ...attach });
  }
  return attaches;
}
