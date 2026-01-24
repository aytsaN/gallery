import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { By } from '@angular/platform-browser';

import { MatButtonHarness } from '@angular/material/button/testing';

import { PhotoDetailsPage } from './photo-details-page';
import { FavoritesService } from '../core/services/favorites.service';
import { Photo } from '../core/models/photo.model';

describe('PhotoDetailsPage', () => {
  let component: PhotoDetailsPage;
  let fixture: ComponentFixture<PhotoDetailsPage>;
  let favoritesServiceSpy: jasmine.SpyObj<FavoritesService>;
  let loader: HarnessLoader;

  const mockPhoto: Photo = {
    id: '123',
    author: 'John Doe',
    download_url: 'https://picsum.photos/123',
  };

  beforeEach(async () => {
    favoritesServiceSpy = jasmine.createSpyObj('FavoritesService', ['getById', 'remove']);

    await TestBed.configureTestingModule({
      imports: [PhotoDetailsPage],
      providers: [{ provide: FavoritesService, useValue: favoritesServiceSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(PhotoDetailsPage);
    component = fixture.componentInstance;
    loader = TestbedHarnessEnvironment.loader(fixture);

    // Set the required signal input before first change detection
    fixture.componentRef.setInput('id', '123');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show "Photo not found" when service returns null', () => {
    favoritesServiceSpy.getById.and.returnValue(undefined);
    fixture.detectChanges();

    const emptyMessage = fixture.debugElement.query(By.css('.empty-message'));
    expect(emptyMessage.nativeElement.textContent).toContain('Photo not found in Favorites');
  });

  it('should render photo details when photo is found', () => {
    favoritesServiceSpy.getById.and.returnValue(mockPhoto);
    fixture.detectChanges();

    const img = fixture.debugElement.query(By.css('.image')).nativeElement;
    const figcaption = fixture.debugElement.query(
      By.css('.image-container figcaption'),
    ).nativeElement;

    expect(img.src).toBe(mockPhoto.download_url);
    expect(img.alt).toBe(`Photo by ${mockPhoto.author}`);
    expect(figcaption.textContent).toContain(mockPhoto.author);
  });

  it('should call remove from favorites when button is clicked', async () => {
    favoritesServiceSpy.getById.and.returnValue(mockPhoto);
    fixture.detectChanges();

    const removeButton = await loader.getHarness(
      MatButtonHarness.with({ text: 'Remove from Favorites' }),
    );
    await removeButton.click();

    expect(favoritesServiceSpy.remove).toHaveBeenCalledWith('123');
  });
});
