export interface IAssistantGeneralInterface {
  status: number;
  data: Data;
}

export interface Data {
  text: string;
  chatId: string;
}
