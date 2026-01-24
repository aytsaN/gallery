import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { HarnessLoader } from '@angular/cdk/testing';

import { MatGridTileHarness } from '@angular/material/grid-list/testing';

import { FavoritesPage } from './favorites-page';
import { FavoritesService } from '../core/services/favorites.service';
import { Photo } from '../core/models/photo.model';

describe('FavoritesPage', () => {
  let component: FavoritesPage;
  let fixture: ComponentFixture<FavoritesPage>;
  let favoritesServiceSpy: jasmine.SpyObj<FavoritesService>;
  let loader: HarnessLoader;

  const mockPhotos: Photo[] = [
    { id: '1', author: 'Author 1', download_url: 'https://picsum.photos/id/1/200/300' },
    { id: '2', author: 'Author 2', download_url: 'https://picsum.photos/id/2/200/300' },
  ];

  beforeEach(async () => {
    favoritesServiceSpy = jasmine.createSpyObj('FavoritesService', ['getAll']);
    favoritesServiceSpy.getAll.and.returnValue(mockPhotos);

    await TestBed.configureTestingModule({
      imports: [FavoritesPage],
      providers: [{ provide: FavoritesService, useValue: favoritesServiceSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(FavoritesPage);
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
});
