import { environment } from 'environments/environment';

export const CHAT_TTS_NATIVE_OPTION = 'default' as const;

export const GPT_AUDIO_VOICES = [
  'nova',
  'onyx',
  'alloy',
  'ash',
  'coral',
  'echo',
  'fable',
  'sage',
  'shimmer',
] as const;

export type GptAudioVoice = (typeof GPT_AUDIO_VOICES)[number];

export type ChatTtsVoiceOption = typeof CHAT_TTS_NATIVE_OPTION | GptAudioVoice;

export async function fetchGptAudioBlob(
  text: string,
  voice: GptAudioVoice,
  abortSignal?: AbortSignal,
): Promise<Blob> {
  const response = await fetch(`${environment.backendApi}/gpt/audio`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text, voice }),
    signal: abortSignal,
  });

  if (!response.ok) {
    const errBody = await response.text().catch(() => '');
    throw new Error(errBody || `HTTP ${response.status} ${response.statusText}`);
  }

  return response.blob();
}
