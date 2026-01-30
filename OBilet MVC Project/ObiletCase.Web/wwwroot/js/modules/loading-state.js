import { Utils } from './utils.js';

export const LoadingState = {
    searchBtn: null,
    originalText: '',

    init() {
        this.searchBtn = Utils.$('#searchBtn');
        if (!this.searchBtn) return;

        this.originalText = this.searchBtn.innerHTML;
        this.bindFormSubmit();
    },

    bindFormSubmit() {
        const form = Utils.$('#searchForm');
        Utils.on(form, 'submit', () => {
            this.showLoading();
        });
    },

    showLoading() {
        this.searchBtn.disabled = true;
        // I18n varsa kullan yoksa default yazı
        const searchingText = (typeof I18n !== 'undefined' && I18n.t) ? I18n.t('home.searching') : 'Searching...';
        this.searchBtn.innerHTML = `
            <span class="spinner-border spinner-border-sm me-2" role="status"></span>
            ${searchingText}
        `;
    },

    reset() {
        this.searchBtn.disabled = false;
        this.searchBtn.innerHTML = this.originalText;
    }
};