import {
  Component,
  inject,
  signal,
  AfterViewInit,
  ElementRef,
  viewChild,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { MatGridListModule } from '@angular/material/grid-list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { FavoritesService } from '../core/services/favorites.service';
import { PhotoService } from '../core/services/photo.service';
import { Photo } from '../core/models/photo.model';

/**
 * Photo page component.
 */
@Component({
  selector: 'app-photo-page',
  imports: [CommonModule, MatGridListModule, MatTooltipModule, MatProgressSpinnerModule],
  templateUrl: './photo-page.html',
  styleUrl: './photo-page.scss',
})
export class PhotoPage implements OnInit, AfterViewInit, OnDestroy {
  private readonly sentinel = viewChild<ElementRef>('sentinel');

  private readonly photoService = inject(PhotoService);
  private readonly favoritesService = inject(FavoritesService);

  private destroy$ = new Subject<void>();
  private page = 1;
  protected readonly photos = signal<Photo[]>([]);
  protected readonly isLoading = signal(false);
  private observer?: IntersectionObserver;

  ngOnInit() {
    this.loadMorePhotos(15);
  }

  ngAfterViewInit() {
    const sentinelEl = this.sentinel();
    if (sentinelEl) {
      this.observer = new IntersectionObserver(
        entries => {
          if (entries[0].isIntersecting && !this.isLoading()) {
            this.loadMorePhotos();
          }
        },
        { threshold: 1.0 },
      );
      this.observer.observe(sentinelEl.nativeElement);
    }
  }

  private loadMorePhotos(limit: number = 9) {
    if (this.isLoading()) return;

    this.isLoading.set(true);
    this.photoService
      .getPhotos(this.page, limit)
      .pipe(takeUntil(this.destroy$))
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

  ngOnDestroy() {
    this.observer?.disconnect();
    this.destroy$.next();
    this.destroy$.complete();
  }
}
