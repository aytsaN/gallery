import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { HarnessLoader } from '@angular/cdk/testing';

import { MatButtonHarness } from '@angular/material/button/testing';

import { Header } from './header';

@Component({ template: '' })
class DummyComponent {}

describe('Header', () => {
  let component: Header;
  let fixture: ComponentFixture<Header>;
  let loader: HarnessLoader;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Header],
      providers: [
        provideRouter([
          { path: '', component: DummyComponent },
          { path: 'favorites', component: DummyComponent },
        ]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Header);
    component = fixture.componentInstance;
    loader = TestbedHarnessEnvironment.loader(fixture);
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should have two buttons', async () => {
    const buttons = await loader.getAllHarnesses(MatButtonHarness);
    expect(buttons.length).toBe(2);
  });

  it('should have button with text "Photos"', async () => {
    const photosButton = await loader.getHarness(MatButtonHarness.with({ text: 'Photos' }));
    expect(photosButton).toBeTruthy();
  });

  it('should have button with text "Favorites"', async () => {
    const favoritesButton = await loader.getHarness(MatButtonHarness.with({ text: 'Favorites' }));
    expect(favoritesButton).toBeTruthy();
  });

  it('should set buttons appearance based on active route', async () => {
    const photosButton = await loader.getHarness(MatButtonHarness.with({ text: 'Photos' }));
    const favoritesButton = await loader.getHarness(MatButtonHarness.with({ text: 'Favorites' }));

    await photosButton.click();

    expect(await photosButton.getAppearance()).toBe('filled');
    expect(await favoritesButton.getAppearance()).toBe('elevated');

    await favoritesButton.click();

    expect(await photosButton.getAppearance()).toBe('elevated');
    expect(await favoritesButton.getAppearance()).toBe('filled');
  });
});
