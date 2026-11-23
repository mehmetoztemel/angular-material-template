import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  let previous: string | null;
  beforeEach(() => {
    previous = localStorage.getItem('app.theme');
  });
  afterEach(() => {
    if (previous === null) localStorage.removeItem('app.theme');
    else localStorage.setItem('app.theme', previous);
    document.body.classList.remove('dark-theme');
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
});
