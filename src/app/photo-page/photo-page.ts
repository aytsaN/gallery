import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  OnInit,
  signal,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { MatGridListModule } from '@angular/material/grid-list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';

import { InfiniteScroll } from '../core/directives/infinite-scroll';
import { Photo } from '../core/models/photo.model';
import { FavoritesService } from '../core/services/favorites.service';
import { PhotoService } from '../core/services/photo.service';

/**
 * Photo page component.
 */
@Component({
  selector: 'app-photo-page',
  imports: [
    CommonModule,
    MatGridListModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    InfiniteScroll,
  ],
  templateUrl: './photo-page.html',
  styleUrl: './photo-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhotoPage implements OnInit {
  private readonly sentinel = viewChild<ElementRef>('sentinel');

  private readonly photoService = inject(PhotoService);
  private readonly favoritesService = inject(FavoritesService);
  private readonly destroyRef = inject(DestroyRef);

  private page = 1;
  protected readonly photos = signal<Photo[]>([]);
  protected readonly isLoading = signal(false);

  ngOnInit() {
    this.loadMorePhotos(15);
  }

  protected loadMorePhotos(limit = 9) {
    if (this.isLoading()) return;

    this.isLoading.set(true);
    this.photoService
      .getPhotos(this.page, limit)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: newPhotos => {
          this.photos.update(currentPhotos => [...currentPhotos, ...newPhotos]);
          this.page++;
          this.isLoading.set(false);
        },
        error: () => {
          this.isLoading.set(false);
        },
      });
  }

  protected addPhotoToFavorites(photo: Photo) {
    this.favoritesService.add(photo);
  }
}
