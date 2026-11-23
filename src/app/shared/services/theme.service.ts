import { Injectable, signal } from '@angular/core';

type ThemeMode = 'light' | 'dark';
const STORAGE_KEY = 'app.theme';
const DARK_CLASS = 'dark-theme';
const PALETTE_KEY = 'app.palette';
export const THEME_PALETTES = [
  {
    id: 'blue',
    name: 'Kurumsal Mavi',
    color: '#295daa',
    surface: '#17365d',
    highlight: '#ffc107',
  },
  {
    id: 'emerald',
    name: 'Zümrüt',
    color: '#2e7d32',
    surface: '#153c2f',
    highlight: '#ffca28',
  },
  {
    id: 'ocean',
    name: 'Okyanus',
    color: '#00838f',
    surface: '#123b46',
    highlight: '#ffab40',
  },
  {
    id: 'amethyst',
    name: 'Ametist',
    color: '#512da8',
    surface: '#30204c',
    highlight: '#f48fb1',
  },
  {
    id: 'sunset',
    name: 'Gün Batımı',
    color: '#bf360c',
    surface: '#482b25',
    highlight: '#80cbc4',
  },
] as const;
export type ThemePalette = (typeof THEME_PALETTES)[number]['id'];

/** Toggles the `.dark-theme` class on <body> and persists the choice. */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly mode = signal<ThemeMode>('light');
  readonly palettes = THEME_PALETTES;
  readonly palette = signal<ThemePalette>('blue');

  init(): void {
    const stored = localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
    const prefersDark =
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches;
    this.apply(
      stored === 'dark' || stored === 'light'
        ? stored
        : prefersDark
          ? 'dark'
          : 'light',
    );
    this.selectPalette(localStorage.getItem(PALETTE_KEY) ?? 'blue');
  }

  selectPalette(id: string): void {
    const selected = this.palettes.find((item) => item.id === id)?.id ?? 'blue';
    this.palette.set(selected);
    document.body.setAttribute('data-palette', selected);
    localStorage.setItem(PALETTE_KEY, selected);
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
