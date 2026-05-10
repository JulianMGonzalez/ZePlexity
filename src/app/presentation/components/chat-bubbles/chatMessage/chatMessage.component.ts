import { isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnDestroy,
  PLATFORM_ID,
  inject,
  signal,
} from '@angular/core';
import type { KatexOptions } from 'ngx-markdown';
import { MarkdownModule } from 'ngx-markdown';
import { OpenAIService } from 'app/presentation/services/openAI.service';
import {
  CHAT_TTS_NATIVE_OPTION,
  GPT_AUDIO_VOICES,
  type ChatTtsVoiceOption,
  type GptAudioVoice,
} from '@use-cases/general/gpt-audio.use-case';
import { normalizeLatexDelimiters } from '@utils/markdown-latex-normalize';

function textForSpeech(markdown: string): string {
  return (
    markdown
      .replace(/```[\s\S]*?```/g, ' ')
      .replace(/`[^`]*`/g, ' ')
      .replace(/\[([^\]]*)]\([^)]*\)/g, '$1')
      .replace(/#{1,6}\s+/g, '')
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      .replace(/\*([^*]+)\*/g, '$1')
      .replace(/_{1,2}([^_]+)_{1,2}/g, '$1')
      .replace(/\s+/g, ' ')
      .trim() || markdown
  );
}

@Component({
  selector: 'app-chat-message',
  imports: [MarkdownModule],
  templateUrl: './chatMessage.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatMessageComponent implements OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly openAI = inject(OpenAIService);

  @Input({ required: true }) text: string = '';

  readonly nativeOption = CHAT_TTS_NATIVE_OPTION;
  readonly apiVoices = GPT_AUDIO_VOICES;
  readonly selectedVoiceOption = signal<ChatTtsVoiceOption>(CHAT_TTS_NATIVE_OPTION);
  readonly isSpeaking = signal(false);
  readonly isAudioLoading = signal(false);

  private fetchAbort: AbortController | null = null;
  private currentObjectUrl: string | null = null;
  private currentAudio: HTMLAudioElement | null = null;

  readonly katexOptions: KatexOptions = {
    throwOnError: false,
    strict: 'ignore',
  };

  preparedMarkdown(): string {
    return normalizeLatexDelimiters(this.text);
  }

  readonly voiceSelectId = `gpt-voice-${Math.random().toString(36).slice(2, 11)}`;

  apiVoiceLabel(v: GptAudioVoice): string {
    return v.charAt(0).toUpperCase() + v.slice(1);
  }

  onVoiceSelect(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    if (value === CHAT_TTS_NATIVE_OPTION) {
      this.selectedVoiceOption.set(CHAT_TTS_NATIVE_OPTION);
      return;
    }
    if ((GPT_AUDIO_VOICES as readonly string[]).includes(value)) {
      this.selectedVoiceOption.set(value as GptAudioVoice);
    }
  }

  async share(): Promise<void> {
    if (!isPlatformBrowser(this.platformId) || !this.text) {
      return;
    }
    const payload = { text: this.text };

    if (typeof navigator !== 'undefined' && 'share' in navigator && navigator.share) {
      try {
        await navigator.share(payload);
        return;
      } catch (err) {
        const name = err instanceof DOMException ? err.name : (err as Error)?.name;
        if (name === 'AbortError') {
          return;
        }
      }
    }

    await this.copy();
  }

  async copy(): Promise<void> {
    if (!isPlatformBrowser(this.platformId) || !this.text) {
      return;
    }
    try {
      await navigator.clipboard.writeText(this.text);
    } catch {
      /* clipboard may be denied */
    }
  }

  async toggleAudio(): Promise<void> {
    if (!isPlatformBrowser(this.platformId) || !this.text) {
      return;
    }

    if (this.isSpeaking() || this.isAudioLoading()) {
      this.stopPlayback();
      return;
    }

    if (this.selectedVoiceOption() === CHAT_TTS_NATIVE_OPTION) {
      this.startNativeTts();
      return;
    }

    this.fetchAbort = new AbortController();
    const signal = this.fetchAbort.signal;
    this.isAudioLoading.set(true);

    try {
      const plain = textForSpeech(this.text);
      const voice = this.selectedVoiceOption() as GptAudioVoice;
      const blob = await this.openAI.fetchGptAudio(plain, voice, signal);
      if (blob.size === 0) {
        throw new Error('Audio vacío');
      }

      this.revokeObjectUrl();
      this.currentObjectUrl = URL.createObjectURL(blob);
      const audio = new Audio(this.currentObjectUrl);
      this.currentAudio = audio;

      audio.onended = () => {
        this.isSpeaking.set(false);
        this.teardownAudioElement();
        this.revokeObjectUrl();
      };
      audio.onerror = () => {
        this.isSpeaking.set(false);
        this.teardownAudioElement();
        this.revokeObjectUrl();
      };

      await audio.play();
      this.isSpeaking.set(true);
    } catch (e) {
      if (e instanceof DOMException && e.name === 'AbortError') {
        return;
      }
      this.teardownAudioElement();
      this.revokeObjectUrl();
    } finally {
      this.isAudioLoading.set(false);
      this.fetchAbort = null;
    }
  }

  private startNativeTts(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    const synth = globalThis.speechSynthesis;
    if (!synth) {
      return;
    }

    synth.cancel();
    const utterance = new SpeechSynthesisUtterance(textForSpeech(this.text));
    utterance.lang = 'es-ES';
    utterance.onend = () => this.isSpeaking.set(false);
    utterance.onerror = () => this.isSpeaking.set(false);
    this.isSpeaking.set(true);
    synth.speak(utterance);
  }

  private stopPlayback(): void {
    if (isPlatformBrowser(this.platformId) && globalThis.speechSynthesis) {
      globalThis.speechSynthesis.cancel();
    }
    this.fetchAbort?.abort();
    this.fetchAbort = null;
    this.teardownAudioElement();
    this.revokeObjectUrl();
    this.isSpeaking.set(false);
    this.isAudioLoading.set(false);
  }

  private teardownAudioElement(): void {
    const audio = this.currentAudio;
    this.currentAudio = null;
    if (audio) {
      audio.pause();
      audio.removeAttribute('src');
      audio.load();
    }
  }

  private revokeObjectUrl(): void {
    if (this.currentObjectUrl) {
      URL.revokeObjectURL(this.currentObjectUrl);
      this.currentObjectUrl = null;
    }
  }

  ngOnDestroy(): void {
    this.stopPlayback();
  }
}
