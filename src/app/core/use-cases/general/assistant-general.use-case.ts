import type { IAssistantGeneralInterface } from '@interfaces/assistant-general.interface';
import { environment } from 'environments/environment';

export const assistantGeneralUseCase = async (
  prompt: string,
  chatId?: string,
): Promise<IAssistantGeneralInterface> => {
  try {
    const responseFetch = await fetch(`${environment.backendApi}/gpt`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt, id: chatId }),
    });

    if (!responseFetch.ok) {
      throw new Error(`Error: ${responseFetch.status} ${responseFetch.statusText}`);
    }

    const response = (await responseFetch.json()) as IAssistantGeneralInterface;

    return response;
  } catch (error) {
    console.error(error);
    return {
      status: 500,
      data: {
        text: `An error occurred while processing your request: ${error instanceof Error ? error.message : 'Unknown error'}`,
        chatId: chatId || '',
      },
    };
  }
};
