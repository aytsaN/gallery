import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { delay } from 'rxjs/operators';

import { Photo } from '../models/photo.model';

interface PicsumPhoto {
  id: string;
  author: string;
  width: number;
  height: number;
  url: string;
  download_url: string;
}

function randomDelay() {
  return 200 + Math.floor(Math.random() * 100); // 200-299ms
}

/**
 * Service to work with photos.
 */
@Injectable({ providedIn: 'root' })
export class PhotoService {
  getPhotos(page: number, limit = 9): Observable<Photo[]> {
    const url = `https://picsum.photos/v2/list?page=${page}&limit=${limit}`;
    const photos = fetch(url)
      .then(response => response.json() as Promise<PicsumPhoto[]>)
      .then(data =>
        data.map(item => ({
          id: item.id,
          author: item.author,
          download_url: item.download_url,
        })),
      );

    return from(photos).pipe(delay(randomDelay()));
  }
}
