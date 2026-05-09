export interface IAssistantGeneralInterface {
  status: number;
  data: Data;
}

export interface Data {
  text: string;
  chatId: string;
}

/** One SSE `data:` payload parsed from the stream (e.g. `{"text":"..."}`). */
export interface AssistantStreamChunk {
  textDelta?: string;
  chatId?: string;
}
