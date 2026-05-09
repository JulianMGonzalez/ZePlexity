import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-init-chat-suggestions',
  imports: [],
  templateUrl: './init-chat-suggestions.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InitChatSuggestionsComponent {
  suggestions = [
    {
      title: 'Write a to-do list for a personal project',
      icon: 'fa-solid fa-list-ul',
    },
    {
      title: 'Write a report on the latest trends in technology',
      icon: 'fa-solid fa-microchip',
    },
    {
      title: 'Write a poem about the sea',
      icon: 'fa-solid fa-water',
    },
    {
      title: 'Write a story about a cat',
      icon: 'fa-solid fa-paw',
    },
  ];
}
