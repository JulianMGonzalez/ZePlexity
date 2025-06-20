import { ChangeDetectionStrategy, Component, inject, Input, signal } from '@angular/core';

import { ChatMessageComponent } from '@components/chat-bubbles/chatMessage/chatMessage.component';
import { MyMessageComponent } from '@components/chat-bubbles/myMessage/myMessage.component';
import { TextMessageBoxComponent } from '@components/text-boxes/textMessageBox/textMessageBox.component';
import { TextMessageBoxInterface } from '@interfaces/textMessageBox.interface';
import { TypingLoaderComponent } from '@components/typingLoader/typingLoader.component';
import { Message } from '@interfaces/message.interface';
import { OpenAIService } from 'app/presentation/services/openAI.service';

@Component({
  selector: 'app-orthography-page',
  imports: [
    ChatMessageComponent,
    MyMessageComponent,
    TypingLoaderComponent,
    TextMessageBoxComponent,
  ],
  templateUrl: './orthographyPage.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class OrthographyPageComponent {
  @Input() messages = signal<Message[]>([
    {
      text: 'Hello, how can I assist you today?',
      isGpt: false,
    },
  ]);
  @Input() isLoading = signal<boolean>(false);

  public openAIService = inject(OpenAIService);

  handleMessage(bodyForm: TextMessageBoxInterface): void {
    // Handle the message input from the user
    console.log('Message received:', bodyForm);
  }
}
