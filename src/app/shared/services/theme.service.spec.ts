import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  let previous: string | null;
  let previousPalette: string | null;
  let previousAttribute: string | null;
  beforeEach(() => {
    previous = localStorage.getItem('app.theme');
    previousPalette = localStorage.getItem('app.palette');
    previousAttribute = document.body.getAttribute('data-palette');
  });
  afterEach(() => {
    if (previous === null) localStorage.removeItem('app.theme');
    else localStorage.setItem('app.theme', previous);
    document.body.classList.remove('dark-theme');
    if (previousPalette === null) localStorage.removeItem('app.palette');
    else localStorage.setItem('app.palette', previousPalette);
    if (previousAttribute === null)
      document.body.removeAttribute('data-palette');
    else document.body.setAttribute('data-palette', previousAttribute);
  });
  it('restores the preference and updates overlay theme on toggle', () => {
    localStorage.setItem('app.theme', 'dark');
    const theme = TestBed.inject(ThemeService);
    theme.init();
    expect(document.body.classList.contains('dark-theme')).toBeTrue();
    theme.toggle();
    expect(theme.mode()).toBe('light');
    expect(document.body.classList.contains('dark-theme')).toBeFalse();
    expect(localStorage.getItem('app.theme')).toBe('light');
  });
  it('restores a saved palette independently from dark mode', () => {
    localStorage.setItem('app.theme', 'dark');
    localStorage.setItem('app.palette', 'emerald');
    const theme = TestBed.inject(ThemeService);
    theme.init();
    expect(theme.palette()).toBe('emerald');
    expect(document.body.getAttribute('data-palette')).toBe('emerald');
    theme.toggle();
    expect(theme.palette()).toBe('emerald');
    theme.selectPalette('amethyst');
    expect(theme.mode()).toBe('light');
    expect(localStorage.getItem('app.palette')).toBe('amethyst');
    theme.init();
    expect(theme.palette()).toBe('amethyst');
  });
  it('recovers an unknown saved palette with the default blue pack', () => {
    localStorage.setItem('app.palette', 'removed-palette');
    const theme = TestBed.inject(ThemeService);
    theme.init();
    expect(theme.palette()).toBe('blue');
    expect(document.body.getAttribute('data-palette')).toBe('blue');
    expect(localStorage.getItem('app.palette')).toBe('blue');
  });
});
