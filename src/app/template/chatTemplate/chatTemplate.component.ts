import { ChangeDetectionStrategy, Component, inject, Input, signal } from '@angular/core';

import { ChatMessageComponent } from '@components/chat-bubbles/chatMessage/chatMessage.component';
import { MyMessageComponent } from '@components/chat-bubbles/myMessage/myMessage.component';
import { TextMessageBoxComponent } from '@components/text-boxes/textMessageBox/textMessageBox.component';
import { TextMessageBoxInterface } from '@interfaces/textMessageBox.interface';
import { TypingLoaderComponent } from '@components/typingLoader/typingLoader.component';
import { Message } from '@interfaces/message.interface';
import { OpenAIService } from 'app/presentation/services/openAI.service';

@Component({
  selector: 'app-chat-template',
  imports: [
    ChatMessageComponent,
    MyMessageComponent,
    TypingLoaderComponent,
    TextMessageBoxComponent,
  ],
  templateUrl: './chatTemplate.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatTemplateComponent {
  @Input() messages = signal<Message[]>([]);
  @Input() isLoading = signal<boolean>(false);

  public openAIService = inject(OpenAIService);

  handleMessage(bodyForm: TextMessageBoxInterface): void {
    // Handle the message input from the user
    console.log('Message received:', bodyForm);
  }
}
