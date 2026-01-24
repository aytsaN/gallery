import { Injectable, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { MatSnackBar } from '@angular/material/snack-bar';

import { Photo } from '../models/photo.model';

const STORAGE_KEY = 'app_favorite_photos';

/**
 * Service to work with favorite photos.
 */
@Injectable({ providedIn: 'root' })
export class FavoritesService {
  private readonly snackBar = inject(MatSnackBar);
  private readonly photos$ = new BehaviorSubject<Photo[]>(this.load());

  private load(): Photo[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as Photo[]) : [];
    } catch {
      return [];
    }
  }

  private save(list: Photo[]) {
    this.photos$.next(list);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
      this.snackBar.open('Favorites updated', 'Close', { duration: 1000 });
    } catch {
      this.snackBar.open('Failed to update Favorites', 'Close', { duration: 2000 });
    }
  }

  getAll(): Photo[] {
    return this.photos$.getValue();
  }

  add(photo: Photo) {
    const list = this.getAll();
    if (!list.find(p => p.id === photo.id)) {
      this.save([...list, photo]);
    } else {
      this.snackBar.open('Photo is already in Favorites', 'Close', { duration: 2000 });
    }
  }

  remove(id: string) {
    const list = this.getAll().filter(p => p.id !== id);
    this.save(list);
  }

  getById(id: string): Photo | undefined {
    return this.getAll().find(p => p.id === id);
  }
}
