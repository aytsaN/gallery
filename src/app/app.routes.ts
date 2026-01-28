import { Routes } from '@angular/router';

import { PhotoPage } from './photo-page/photo-page';

export const routes: Routes = [
  { path: '', component: PhotoPage },
  {
    path: 'favorites',
    loadComponent: () => import('./favorites-page/favorites-page').then(m => m.FavoritesPage),
  },
  {
    path: 'photos/:id',
    loadComponent: () =>
      import('./photo-details-page/photo-details-page').then(m => m.PhotoDetailsPage),
  },
  { path: '**', redirectTo: '' },
];
