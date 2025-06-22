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
      isGpt: true,
      text: `Aquí tienes un ejemplo de CSS puro que replica el estilo de scrollbar de ChatGPT. Puedes aplicarlo a cualquier contenedor dándole la clase \`.chatgpt-scroll\` (o ajustarlo a \`body\`, \`html\`, \`div\`, etc.).

\`\`\`css
/* Contenedor con scroll personalizado */
.chatgpt-scroll {
  overflow: auto;          /* Activa el scroll */
  scrollbar-width: thin;   /* Firefox: scroll estrecho */
  scrollbar-color: rgba(100,100,100,0.5) transparent;
}

/* WebKit (Chrome, Edge, Safari): */
.chatgpt-scroll::-webkit-scrollbar {
  width: 6px;              /* Grosor vertical */
  height: 6px;             /* Grosor horizontal */
  background: transparent; /* Fondo invisible */
}

.chatgpt-scroll::-webkit-scrollbar-track {
  background: transparent; /* Pista totalmente transparente */
}

.chatgpt-scroll::-webkit-scrollbar-thumb {
  background-color: rgba(100,100,100,0.5);
  border-radius: 3px;
  border: 1px solid transparent; /* Para quitar artefactos */
}

.chatgpt-scroll::-webkit-scrollbar-thumb:hover {
  background-color: rgba(100,100,100,0.7);
}
\`\`\`

Y un ejemplo de uso en HTML:

\`\`\`html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Scroll al estilo ChatGPT</title>
  <link rel="stylesheet" href="estilos.css">
</head>
<body>
  <div class="chatgpt-scroll" style="height: 300px; padding: 1rem; border: 1px solid #ccc;">
    <!-- Contenido largo para forzar el scroll -->
    <p>Lorem ipsum dolor sit amet...</p>
    <!-- … -->
  </div>
</body>
</html>
\`\`\`

Cómo funciona:

• En WebKit (Blink/AppleWebKit) usamos los pseudo-elementos
  \`::-webkit-scrollbar\`, \`::-webkit-scrollbar-track\` y \`::-webkit-scrollbar-thumb\`.
• En Firefox configuramos \`scrollbar-width: thin;\` y \`scrollbar-color\`.

Puedes afinar los colores y radios a tu gusto (modo claro/oscuro, grosor, etc.).
`,
    },
    {
      isGpt: false,
      text: `Hola, ¿cómo estás?`,
    },
    {
      isGpt: true,
      text: `No. Según todas las agencias de inteligencia abiertas y los informes del Organismo Internacional de Energía Atómica (OIEA), Irán no posee armas nucleares ni ha realizado una prueba nuclear.

Puntos clave:
1. Irán es parte del Tratado de No Proliferación Nuclear (TNP), que le prohíbe desarrollar armas nucleares.
2. Su programa de enriquecimiento de uranio está bajo supervisión del OIEA y, aunque ha aumentado el nivel de enriquecimiento (hasta alrededor de 60 % para usos civiles e investigación), no ha llegado al grado de pureza (≈90 %) necesario para un arma.
3. En 2003 Irán interrumpió cualquier posible investigación orientada a un arma nuclear, según informes de inteligencia de EE. UU. y aliados.
4. Tras diversos acuerdos (el Plan de Acción Conjunto de 2015, conocido como JCPOA), se acordaron límites y mecanismos de inspección para garantizar que solo se use el uranio con fines pacíficos. Aunque desde 2018 Irán ha vuelto a enriquecer más allá de esos límites, sigue sin haber evidencia de que disponga de una “bomba” nuclear.

En resumen, Irán tiene capacidad técnica nuclear avanzada y material fisible, pero no arma nuclear fabricada ni probada.`,
    },
  ]);
  @Input() isLoading = signal<boolean>(false);

  public openAIService = inject(OpenAIService);

  public chatId: string | undefined = undefined;

  handleMessage(bodyForm: TextMessageBoxInterface): void {
    // Handle the message input from the user
    this.isLoading.set(true);
    this.messages.update((prev) => [...prev, { isGpt: false, text: bodyForm.prompt }]);
    this.openAIService.consultPrompt(bodyForm.prompt, this.chatId).subscribe({
      next: (response) => {
        this.isLoading.set(false);
        if (response.status === 200) {
          this.chatId = response.data.chatId;
          this.messages.update((prev) => [...prev, { isGpt: true, text: response.data.text }]);
        } else {
          this.messages.update((prev) => [
            ...prev,
            { isGpt: true, text: `Error: ${response.status} - ${response.data.text}` },
          ]);
        }
      },
    });
  }
}
