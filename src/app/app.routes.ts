import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/landing/landing').then((m) => m.LandingPage),
  },
  {
    // Shareable link that starts the APK download by itself.
    path: 'download',
    loadComponent: () => import('./pages/download/download').then((m) => m.DownloadPage),
  },
  { path: '**', redirectTo: '' },
];
