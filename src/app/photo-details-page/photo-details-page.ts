import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { Router } from '@angular/router';

import { MatAnchor } from '@angular/material/button';
import { FavoritesService } from '../core/services/favorites.service';

@Component({
  selector: 'app-photo-details-page',
  imports: [CommonModule, MatAnchor],
  templateUrl: './photo-details-page.html',
  styleUrl: './photo-details-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhotoDetailsPage {
  id = input.required<string>();

  private readonly favoritesService = inject(FavoritesService);
  private readonly route = inject(Router);

  protected readonly photo = computed(() => {
    const photoId = this.id();
    return this.favoritesService.getById(photoId);
  });

  protected removePhotoFromFavorites() {
    if (!this.id()) return;

    this.favoritesService.remove(this.id()!);
    this.route.navigateByUrl('/favorites');
  }
}
