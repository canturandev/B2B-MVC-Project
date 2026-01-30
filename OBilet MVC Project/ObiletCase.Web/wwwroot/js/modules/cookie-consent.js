import { Utils } from './utils.js';

export const CookieConsent = {
    banner: null,
    acceptBtn: null,
    rejectBtn: null,

    init() {
        this.banner = Utils.$('#cookieConsent');
        this.acceptBtn = Utils.$('#cookieAccept');
        this.rejectBtn = Utils.$('#cookieReject');

        if (!this.banner) return;

        // Sadece ana sayfada popup göster
        const isHomePage = window.location.pathname === '/' || 
                           window.location.pathname === '/Home' || 
                           window.location.pathname === '/Home/Index';
        
        if (isHomePage) {
            setTimeout(() => this.show(), 1000);
        }

        this.bindEvents();
    },

    hasConsent() {
        return localStorage.getItem('obilet_cookie_consent') !== null;
    },

    show() {
        this.banner.classList.add('show');
    },

    hide() {
        this.banner.classList.remove('show');
    },

    accept() {
        localStorage.setItem('obilet_cookie_consent', 'accepted');
        this.hide();
    },

    reject() {
        localStorage.setItem('obilet_cookie_consent', 'rejected');
        this.hide();
    },

    bindEvents() {
        Utils.on(this.acceptBtn, 'click', () => this.accept());
        Utils.on(this.rejectBtn, 'click', () => this.reject());
    }
};