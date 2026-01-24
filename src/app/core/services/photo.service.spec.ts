import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { PhotoService } from './photo.service';
import { Photo } from '../models/photo.model';

describe('PhotoService', () => {
  let service: PhotoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PhotoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch photos with correct URL and parameters', fakeAsync(() => {
    const mockPhotos: Photo[] = [
      { id: '1', author: 'Test Author', download_url: 'http://test.com/1.jpg' },
    ];

    const fetchSpy = spyOn(window, 'fetch').and.returnValue(
      Promise.resolve({
        json: () => Promise.resolve(mockPhotos),
      } as Response),
    );

    let result: Photo[] | undefined;
    service.getPhotos(1, 10).subscribe(data => (result = data));

    // Advance time to cover the random delay (200-299ms)
    tick(300);

    expect(fetchSpy).toHaveBeenCalledWith('https://picsum.photos/v2/list?page=1&limit=10');
    expect(result).toEqual(mockPhotos);
  }));
});
