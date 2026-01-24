import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { MatGridListModule } from '@angular/material/grid-list';
import { MatTooltipModule } from '@angular/material/tooltip';

import { FavoritesService } from '../core/services/favorites.service';

/**
 * Favorites page component.
 */
@Component({
  selector: 'app-favorites-page',
  imports: [CommonModule, MatGridListModule, MatTooltipModule],
  templateUrl: './favorites-page.html',
  styleUrl: './favorites-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FavoritesPage {
  private readonly favoritesService = inject(FavoritesService);
  private readonly router = inject(Router);

  protected readonly photos = this.favoritesService.getAll();

  protected openPhoto(id: string) {
    this.router.navigate(['/photos', id]);
  }
}
