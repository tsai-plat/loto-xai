export type ModelProviderType =
  | 'customization'
  | 'chatgpt'
  | 'deepseek'
  | 'huggingface'
  | 'metaai'
  | 'midjourney'
  | 'moonshot'
  | 'qianfan'
  | 'qianwen'
  | 'stabilityai'
  | 'tecent'
  | 'siliconflow'
  | 'vidu'
  | string;

/**
 * @public XaiModelType define all Xai support model
 *  Ensuring uniqueness under the XAI system
 * @param modelId unique id in xai
 * @param provider unique string in xai
 * @param model the unique model string in provider
 *
 */
export type XaiModelType = {
  modelId: string;
  provider: ModelProviderType;
  model: string;
  modelName: string;
  disabled?: boolean;
  link?: string;
  description?: string;
  icon?: string;
  [k: string]: any;
};

export type XaiBaseConfigSchema = {
  cfgid: string;
  name: string;
  provider: ModelProviderType;
  baseUrl: string;
  apiKey: string;
  model?: string;
};
