import { TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';

import { FavoritesService } from './favorites.service';
import { Photo } from '../models/photo.model';

const STORAGE_KEY = 'app_favorite_photos';
const MOCK_PHOTO = { id: '1', author: 'Author 1', download_url: 'url1' } as Photo;
const MOCK_PHOTO2 = { id: '2', author: 'Author 2', download_url: 'url2' } as Photo;

describe('FavoritesService', () => {
  let service: FavoritesService;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;
  let storage: Record<string, string>;

  const createService = () => {
    const snackBarSpyObj = jasmine.createSpyObj('MatSnackBar', ['open']);

    TestBed.configureTestingModule({
      providers: [FavoritesService, { provide: MatSnackBar, useValue: snackBarSpyObj }],
    });

    service = TestBed.inject(FavoritesService);
    snackBarSpy = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;
  };

  beforeEach(() => {
    storage = {};
    spyOn(localStorage, 'getItem').and.callFake(key => storage[key] || null);
    spyOn(localStorage, 'setItem').and.callFake((key, value) => (storage[key] = value));
  });

  it('should be created', () => {
    createService();
    expect(service).toBeTruthy();
  });

  describe('initial state', () => {
    it('should load an empty array if localStorage is empty', () => {
      createService();
      expect(service.getAll()).toEqual([]);
    });

    it('should load photos from localStorage on initialization', () => {
      storage[STORAGE_KEY] = JSON.stringify([MOCK_PHOTO]);
      createService();

      expect(service.getAll()).toEqual([MOCK_PHOTO]);
    });

    it('should handle invalid JSON in localStorage gracefully', () => {
      storage[STORAGE_KEY] = 'invalid-json';
      createService();

      expect(service.getAll()).toEqual([]);
    });
  });

  describe('service methods', () => {
    beforeEach(() => {
      createService();
    });

    describe('getAll', () => {
      it('should return the current list of favorite photos', () => {
        expect(service.getAll()).toEqual([]);

        service.add(MOCK_PHOTO);

        expect(service.getAll()).toEqual([MOCK_PHOTO]);
      });
    });

    describe('add', () => {
      it('should add a photo to the favorites list', () => {
        service.add(MOCK_PHOTO);

        expect(service.getAll()).toEqual([MOCK_PHOTO]);
      });

      it('should save the updated list to localStorage', () => {
        service.add(MOCK_PHOTO);

        expect(localStorage.setItem).toHaveBeenCalledWith(
          STORAGE_KEY,
          JSON.stringify([MOCK_PHOTO]),
        );
      });

      it('should show a success snackbar message', () => {
        service.add(MOCK_PHOTO);

        expect(snackBarSpy.open).toHaveBeenCalledWith('Favorites updated', 'Close', {
          duration: 1000,
        });
      });

      it('should not add a photo if it already exists in favorites', () => {
        service.add(MOCK_PHOTO);
        expect(service.getAll().length).toBe(1);

        service.add(MOCK_PHOTO);
        expect(service.getAll().length).toBe(1);
      });

      it('should show an "already in favorites" snackbar message for duplicates', () => {
        service.add(MOCK_PHOTO);
        snackBarSpy.open.calls.reset();
        service.add(MOCK_PHOTO);

        expect(snackBarSpy.open).toHaveBeenCalledWith('Photo is already in Favorites', 'Close', {
          duration: 2000,
        });
      });

      it('should handle localStorage write errors', () => {
        (localStorage.setItem as jasmine.Spy).and.throwError('Storage full');
        service.add(MOCK_PHOTO2);

        expect(snackBarSpy.open).toHaveBeenCalledWith('Failed to update Favorites', 'Close', {
          duration: 2000,
        });
      });
    });

    describe('remove', () => {
      beforeEach(() => {
        service.add(MOCK_PHOTO);
        service.add(MOCK_PHOTO2);
        snackBarSpy.open.calls.reset();
      });

      it('should remove a photo from the favorites list by id', () => {
        service.remove(MOCK_PHOTO.id);
        expect(service.getAll()).toEqual([MOCK_PHOTO2]);
      });
    });

    describe('getById', () => {
      beforeEach(() => {
        service.add(MOCK_PHOTO);
      });

      it('should return a photo by id', () => {
        const photo = service.getById(MOCK_PHOTO.id);
        expect(photo).toEqual(MOCK_PHOTO);
      });

      it('should return undefined if photo with given id does not exist', () => {
        const photo = service.getById('non-existent-id');
        expect(photo).toBeUndefined();
      });
    });
  });
});
