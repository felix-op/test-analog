import { DOCUMENT } from "@angular/common";
import { inject, Injectable, signal } from "@angular/core";

@Injectable({
    providedIn: "root"
})
export class ThemeService {
    private document = inject(DOCUMENT);
    theme = signal<'light' | 'dark'>('light');

    constructor() {
        this.initializeTheme();
    }

    private initializeTheme(): void {
        const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');

        this.theme.set(initialTheme);
        this.applyThemeToDom(initialTheme);
    }

    private applyThemeToDom(theme: 'light' | 'dark'): void {
        const root = this.document.documentElement;

        if (theme === 'dark') {
            root.classList.add('dark-mode');
        } else {
            root.classList.remove('dark-mode');
        }
    }

    toggleTheme(): void {
        // 1. Calculamos el siguiente estado basándonos en el valor actual del Signal
        const nextTheme = this.theme() === 'light' ? 'dark' : 'light';
        
        // 2. Actualizamos el estado, la persistencia y el DOM
        this.theme.set(nextTheme);
        localStorage.setItem('theme', nextTheme);
        this.applyThemeToDom(nextTheme);
    }
}