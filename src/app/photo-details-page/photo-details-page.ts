import { Component, input, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FavoritesService } from '../core/services/favorites.service';
import { MatAnchor } from '@angular/material/button';

@Component({
  selector: 'app-photo-details-page',
  imports: [CommonModule, MatAnchor],
  templateUrl: './photo-details-page.html',
  styleUrl: './photo-details-page.scss',
})
export class PhotoDetailsPage {
  id = input.required<string>();

  private readonly favoritesService = inject(FavoritesService);

  protected readonly photo = computed(() => {
    const photoId = this.id();
    return this.favoritesService.getById(photoId);
  });

  protected removePhotoFromFavorites() {
    if (!this.id()) return;

    this.favoritesService.remove(this.id()!);
  }
}
