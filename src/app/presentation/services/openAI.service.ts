import { Injectable } from '@angular/core';
import { assistantGeneralUseCase } from '@use-cases/general/assistant-general.use-case';
import { from } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class OpenAIService {
  consultPrompt(prompt: string, chatId?: string) {
    return from(assistantGeneralUseCase(prompt, chatId));
  }
}
