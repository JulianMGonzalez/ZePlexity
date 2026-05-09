import type { AssistantStreamChunk } from '@interfaces/assistant-general.interface';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

type SseDataPayload = { text?: string; chatId?: string };

/** POST /gpt — respuesta SSE (`data:` con JSON `{ text?, chatId? }`). */
export const assistantGeneralConsult$ = (
  prompt: string,
  chatId?: string,
  abortSignal?: AbortSignal,
): Observable<AssistantStreamChunk> => {
  return new Observable<AssistantStreamChunk>((subscriber) => {
    let closed = false;

    (async () => {
      try {
        const responseFetch = await fetch(`${environment.backendApi}/gpt`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ prompt, id: chatId }),
          signal: abortSignal,
        });

        if (!responseFetch.ok) {
          const errBody = await responseFetch.text().catch(() => '');
          subscriber.error(
            new Error(errBody || `HTTP ${responseFetch.status} ${responseFetch.statusText}`),
          );
          return;
        }

        const streamBody = responseFetch.body;
        if (!streamBody) {
          subscriber.error(new Error('No response body'));
          return;
        }

        const reader = streamBody.getReader();
        const decoder = new TextDecoder();
        let lineBuffer = '';

        while (!closed) {
          const { done, value } = await reader.read();
          if (done) {
            break;
          }
          lineBuffer += decoder.decode(value, { stream: true });

          while (true) {
            const nl = lineBuffer.indexOf('\n');
            if (nl === -1) {
              break;
            }
            const rawLine = lineBuffer.slice(0, nl);
            lineBuffer = lineBuffer.slice(nl + 1);
            const line = rawLine.replace(/\r$/, '').trimEnd();

            if (!line || line.startsWith(':')) {
              continue;
            }

            if (line.startsWith('data:')) {
              const payload = line.slice(5).trim();
              if (!payload || payload === '[DONE]') {
                continue;
              }
              try {
                const parsed = JSON.parse(payload) as SseDataPayload;
                if (parsed.chatId) {
                  subscriber.next({ chatId: parsed.chatId });
                }
                if (parsed.text != null && parsed.text !== '') {
                  subscriber.next({ textDelta: parsed.text });
                }
              } catch {
                // ignore non-JSON lines
              }
            }
          }
        }

        subscriber.complete();
      } catch (e) {
        if (!subscriber.closed) {
          subscriber.error(e);
        }
      }
    })();

    return () => {
      closed = true;
    };
  });
};
