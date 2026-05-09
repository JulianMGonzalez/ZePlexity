import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

@Component({
  selector: 'app-init-chat-hero',
  imports: [],
  templateUrl: './init-chat-hero.component.html',
  styleUrl: './init-chat-hero.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InitChatHeroComponent {
  userName = signal<string>('John Doe');
}
