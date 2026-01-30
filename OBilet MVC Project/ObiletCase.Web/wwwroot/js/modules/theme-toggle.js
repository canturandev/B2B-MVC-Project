import { Utils } from './utils.js';

export const ThemeToggle = {
    themeButtons: null,
    currentTheme: 'light',

    init() {
        this.themeButtons = Utils.$$('.theme-btn');
        if (!this.themeButtons.length) return;

        this.currentTheme = this.getSavedTheme();
        this.applyTheme(this.currentTheme);
        this.bindEvents();
    },

    getSavedTheme() {
        return localStorage.getItem('obilet_theme') || 'light';
    },

    saveTheme(theme) {
        localStorage.setItem('obilet_theme', theme);
    },

    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        this.updateActiveButton(theme);
    },

    updateActiveButton(theme) {
        this.themeButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.theme === theme);
        });
    },

    bindEvents() {
        this.themeButtons.forEach(btn => {
            Utils.on(btn, 'click', () => {
                const theme = btn.dataset.theme;
                this.currentTheme = theme;
                this.applyTheme(theme);
                this.saveTheme(theme);
            });
        });
    }
};