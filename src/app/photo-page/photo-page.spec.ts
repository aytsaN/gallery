import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { HarnessLoader } from '@angular/cdk/testing';
import { of } from 'rxjs';

import { MatGridTileHarness } from '@angular/material/grid-list/testing';

import { PhotoService } from '../core/services/photo.service';
import { FavoritesService } from '../core/services/favorites.service';
import { Photo } from '../core/models/photo.model';
import { PhotoPage } from './photo-page';

describe('PhotoPage', () => {
  let component: PhotoPage;
  let fixture: ComponentFixture<PhotoPage>;
  let photoServiceSpy: jasmine.SpyObj<PhotoService>;
  let favoritesServiceSpy: jasmine.SpyObj<FavoritesService>;
  let loader: HarnessLoader;

  const mockPhotos: Photo[] = [
    { id: '1', author: 'Author 1', download_url: 'https://picsum.photos/id/1/200/300' },
  ];

  beforeEach(async () => {
    photoServiceSpy = jasmine.createSpyObj('PhotoService', ['getPhotos']);
    photoServiceSpy.getPhotos.and.returnValue(of(mockPhotos));
    favoritesServiceSpy = jasmine.createSpyObj('FavoritesService', ['add']);

    await TestBed.configureTestingModule({
      imports: [PhotoPage],
      providers: [
        { provide: PhotoService, useValue: photoServiceSpy },
        { provide: FavoritesService, useValue: favoritesServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PhotoPage);
    component = fixture.componentInstance;
    loader = TestbedHarnessEnvironment.loader(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render a grid tile for each photo', async () => {
    const tiles = await loader.getAllHarnesses(MatGridTileHarness);
    expect(tiles.length).toBe(mockPhotos.length);
  });

  it('should add photo to favorites when tile is clicked', async () => {
    const tile = await loader.getHarness(MatGridTileHarness.with());
    await (await tile.host()).click();

    expect(favoritesServiceSpy.add).toHaveBeenCalledWith(mockPhotos[0]);
  });
});
