import { XaiModelType } from '../../../src/ai-provider';
import {
  ChatbotAgent,
  createDefaultChatbotAgent,
  defaultChatid,
  newChatbotAgent,
  XaiAgentPET,
} from '../../../src/browser';

describe(`Xai [bot] helper tests`, () => {
    const testModel :XaiModelType = {
        provider:'qianwen',
        model:'qianw-vl',
        modelId:'qianwen@qianw-vl_1.5',
        modelName: 'Qianwen VL 1.5'
    }

    const pet: XaiAgentPET= {
        uuid:1000,
        title:'Test Agent',
        modelId:'qianwen@qianw-vl_1.5',
        group:'test'
    }
  it(`should return an default message with chatid ${defaultChatid}`, () => {
    const agent: ChatbotAgent = createDefaultChatbotAgent(
      {
        provider: 'deepseek',
        model: 'deepseek-caht',
        modelName: 'Deepseek V3',
        modelId: 'deepseek@deepseek-chat_v3',
      },
      {
        uuid: 1000,
        tilte: 'xai test agent',
      },
    );

    expect(agent.chatid).toStrictEqual(defaultChatid);
  });

  it(`Create new agent should no chat message`,()=>{
    const newAgent = newChatbotAgent(testModel,pet)

    expect(newAgent.data.length).toBe(0)
  })
});
