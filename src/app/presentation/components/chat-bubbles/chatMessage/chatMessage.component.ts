import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import type { KatexOptions } from 'ngx-markdown';
import { MarkdownModule } from 'ngx-markdown';
import { normalizeLatexDelimiters } from '@utils/markdown-latex-normalize';

@Component({
  selector: 'app-chat-message',
  imports: [MarkdownModule, CommonModule],
  templateUrl: './chatMessage.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatMessageComponent {
  @Input({ required: true }) text: string = '';

  readonly katexOptions: KatexOptions = {
    throwOnError: false,
    strict: 'ignore',
  };

  preparedMarkdown(): string {
    return normalizeLatexDelimiters(this.text);
  }
}
