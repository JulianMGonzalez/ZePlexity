import { Routes } from '@angular/router';
import { DashboardLayoutComponent } from './presentation/layouts/dashboardLayout/dashboardLayout.component';

export const routes: Routes = [
  {
    path: '',
    component: DashboardLayoutComponent,
    children: [
      {
        path: 'orthography',
        loadComponent: () =>
          import('./presentation/pages/orthographyPage/orthographyPage.component'),
        data: {
          icon: 'fa-solid fa-spell-check',
          title: 'General',
        },
      },
      {
        path: 'text-to-audio',
        loadComponent: () =>
          import('./presentation/pages/textToAudioPage/textToAudioPage.component'),
        data: {
          icon: 'fa-solid fa-podcast',
          title: 'Texto a audio',
        },
      },
      {
        path: 'image-generation',
        loadComponent: () =>
          import('./presentation/pages/imageGenerationPage/imageGenerationPage.component'),
        data: {
          icon: 'fa-solid fa-image',
          title: 'Imágenes',
        },
      },
      {
        path: 'assistant',
        loadComponent: () => import('./presentation/pages/assistantPage/assistantPage.component'),
        data: {
          icon: 'fa-solid fa-user',
          title: 'Asistente',
        },
      },
      {
        path: '**',
        redirectTo: 'orthography',
        pathMatch: 'full',
      },
    ],
  },
];
