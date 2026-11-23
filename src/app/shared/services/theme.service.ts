import { Injectable, signal } from '@angular/core';

type ThemeMode = 'light' | 'dark';
const STORAGE_KEY = 'app.theme';
const DARK_CLASS = 'dark-theme';

/** Toggles the `.dark-theme` class on <body> and persists the choice. */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly mode = signal<ThemeMode>('light');

  init(): void {
    const stored = localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
    const prefersDark =
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches;
    this.apply(stored ?? (prefersDark ? 'dark' : 'light'));
  }

  toggle(): void {
    this.apply(this.mode() === 'dark' ? 'light' : 'dark');
  }

  private apply(mode: ThemeMode): void {
    this.mode.set(mode);
    document.body.classList.toggle(DARK_CLASS, mode === 'dark');
    localStorage.setItem(STORAGE_KEY, mode);
  }
}
