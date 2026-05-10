import { Injectable } from '@angular/core';
import type { AssistantStreamChunk } from '@interfaces/assistant-general.interface';
import { assistantGeneralConsult$ } from '@use-cases/general/assistant-general.use-case';
import { fetchGptAudioBlob, type GptAudioVoice } from '@use-cases/general/gpt-audio.use-case';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class OpenAIService {
  consultPrompt(
    prompt: string,
    chatId?: string,
    abortSignal?: AbortSignal,
  ): Observable<AssistantStreamChunk> {
    return assistantGeneralConsult$(prompt, chatId, abortSignal);
  }

  fetchGptAudio(text: string, voice: GptAudioVoice, abortSignal?: AbortSignal): Promise<Blob> {
    return fetchGptAudioBlob(text, voice, abortSignal);
  }
}
