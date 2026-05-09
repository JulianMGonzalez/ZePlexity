import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * Contenedor de layout del chat:
 * - `empty`: hero + compositor + sugerencias apilados (centrables vía CSS global `.chat-shell--empty`).
 * - conversación: oculta hero/trail, área de mensajes con scroll y compositor fijo abajo (`.chat-shell--active`).
 *
 * Proyección de contenido (atributos en el nodo host):
 * - `chatHero` — bloque inicial (saludo, gráfico).
 * - `chatComposer` — caja de texto (siempre el mismo componente; solo cambia la posición por CSS).
 * - `chatTrail` — sugerencias / ejemplos bajo el compositor en estado vacío.
 * - `chatThread` — lista de mensajes.
 * - `chatAux` — loader u otros elementos dentro del área scroll (opcional).
 */
@Component({
  selector: 'app-chat-shell',
  imports: [],
  templateUrl: './chat-shell.component.html',
  styleUrl: './chat-shell.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatShellComponent {
  readonly empty = input(false);
}
