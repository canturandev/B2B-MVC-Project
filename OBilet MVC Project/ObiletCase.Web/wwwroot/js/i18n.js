'use strict';

const I18n = {
    currentLang: 'tr',
    translations: {},
    supportedLanguages: ['tr', 'en'],

    /**
     * Initialize i18n module
     */
    async init() {
        // Get saved language or default to 'tr'
        this.currentLang = this.getSavedLanguage();
        
        // Load translations
        await this.loadTranslations(this.currentLang);
        
        // Apply translations
        this.applyTranslations();
        
        // Bind language switcher events
        this.bindLanguageSwitcher();
        
        // Update HTML lang attribute
        this.updateHtmlLang();
        
        console.log(`✅ i18n initialized with language: ${this.currentLang}`);
    },

    /**
     * Get saved language from localStorage
     * @returns {string}
     */
    getSavedLanguage() {
        const saved = localStorage.getItem('obilet_lang');
        return this.supportedLanguages.includes(saved) ? saved : 'tr';
    },

    /**
     * Save language preference
     * @param {string} lang 
     */
    saveLanguage(lang) {
        localStorage.setItem('obilet_lang', lang);
    },

    /**
     * Load translation file
     * @param {string} lang 
     */
    async loadTranslations(lang) {
        try {
            const response = await fetch(`/i18n/${lang}.json`);
            if (!response.ok) throw new Error(`Failed to load ${lang}.json`);
            this.translations = await response.json();
        } catch (error) {
            console.error('Translation load error:', error);
            // Fallback to Turkish if load fails
            if (lang !== 'tr') {
                await this.loadTranslations('tr');
            }
        }
    },

    /**
     * Apply translations to all elements with data-i18n attribute
     */
    applyTranslations() {
        const elements = document.querySelectorAll('[data-i18n]');
        
        elements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.getNestedValue(this.translations, key);
            
            if (translation) {
                element.textContent = translation;
            }
        });

        // Update placeholders
        const placeholderElements = document.querySelectorAll('[data-i18n-placeholder]');
        placeholderElements.forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            const translation = this.getNestedValue(this.translations, key);
            
            if (translation) {
                element.placeholder = translation;
            }
        });

        // Update titles
        const titleElements = document.querySelectorAll('[data-i18n-title]');
        titleElements.forEach(element => {
            const key = element.getAttribute('data-i18n-title');
            const translation = this.getNestedValue(this.translations, key);
            
            if (translation) {
                element.title = translation;
            }
        });
    },

    /**
     * Get nested object value by dot notation key
     * @param {object} obj 
     * @param {string} key 
     * @returns {string|null}
     */
    getNestedValue(obj, key) {
        return key.split('.').reduce((o, k) => (o || {})[k], obj);
    },

    /**
     * Bind language switcher button events
     */
    bindLanguageSwitcher() {
        const langButtons = document.querySelectorAll('.lang-btn');
        
        langButtons.forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const newLang = e.target.dataset.lang;
                
                if (newLang !== this.currentLang) {
                    await this.switchLanguage(newLang);
                }
            });
        });

        // Set initial active state
        this.updateActiveLangButton();
    },

    /**
     * Switch to a new language
     * @param {string} lang 
     */
    async switchLanguage(lang) {
        if (!this.supportedLanguages.includes(lang)) return;
        
        this.currentLang = lang;
        this.saveLanguage(lang);
        
        await this.loadTranslations(lang);
        this.applyTranslations();
        this.updateActiveLangButton();
        this.updateHtmlLang();
        
        console.log(`🌐 Language switched to: ${lang}`);
    },

    /**
     * Update active state of language buttons
     */
    updateActiveLangButton() {
        const langButtons = document.querySelectorAll('.lang-btn');
        
        langButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === this.currentLang);
        });
    },

    /**
     * Update HTML lang attribute
     */
    updateHtmlLang() {
        document.documentElement.lang = this.currentLang;
        document.documentElement.dataset.lang = this.currentLang;
    },

    /**
     * Get translation by key
     * @param {string} key 
     * @returns {string}
     */
    t(key) {
        return this.getNestedValue(this.translations, key) || key;
    }
};

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => I18n.init());

// Export for global access
window.I18n = I18n;
