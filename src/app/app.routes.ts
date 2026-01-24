import { Routes } from '@angular/router';

import { PhotoPage } from './photo-page/photo-page';
import { FavoritesPage } from './favorites-page/favorites-page';
import { PhotoDetailsPage } from './photo-details-page/photo-details-page';

export const routes: Routes = [
  { path: '', component: PhotoPage },
  { path: 'favorites', component: FavoritesPage },
  { path: 'photos/:id', component: PhotoDetailsPage },
  { path: '**', redirectTo: '' },
];
