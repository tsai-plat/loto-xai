export type InputValues<K extends string = string> = Record<K, any>;

export interface ChatInputType {
  question: string;
  injectValues?: InputValues;
}
