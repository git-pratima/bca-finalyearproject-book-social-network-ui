import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';

export type Theme = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly storageKey = 'theme';
  private currentTheme: Theme = 'light';

  constructor(@Inject(DOCUMENT) private document: Document) {}

  initialize(): void {
    const savedTheme = localStorage.getItem(this.storageKey) as Theme | null;
    const systemPrefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
    this.setTheme(savedTheme === 'dark' || (!savedTheme && systemPrefersDark) ? 'dark' : 'light');
  }

  get theme(): Theme {
    return this.currentTheme;
  }

  toggleTheme(): void {
    this.setTheme(this.currentTheme === 'dark' ? 'light' : 'dark');
  }

  private setTheme(theme: Theme): void {
    this.currentTheme = theme;
    const root = this.document.documentElement;
    root.setAttribute('data-theme', theme);
    root.setAttribute('data-bs-theme', theme);
    localStorage.setItem(this.storageKey, theme);
  }
}
