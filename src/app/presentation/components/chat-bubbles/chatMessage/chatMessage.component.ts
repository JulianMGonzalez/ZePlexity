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
import { normalizeLatexDelimiters } from '@utils/markdown-latex-normalize';

/** Rough markdown → plain text for speech synthesis (keeps reading natural). */
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

  @Input({ required: true }) text: string = '';

  readonly isSpeaking = signal(false);

  readonly katexOptions: KatexOptions = {
    throwOnError: false,
    strict: 'ignore',
  };

  preparedMarkdown(): string {
    return normalizeLatexDelimiters(this.text);
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

  toggleSpeech(): void {
    if (!isPlatformBrowser(this.platformId) || !this.text) {
      return;
    }
    const synth = globalThis.speechSynthesis;
    if (!synth) {
      return;
    }

    if (this.isSpeaking()) {
      synth.cancel();
      this.isSpeaking.set(false);
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

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId) && globalThis.speechSynthesis) {
      globalThis.speechSynthesis.cancel();
    }
  }
}
