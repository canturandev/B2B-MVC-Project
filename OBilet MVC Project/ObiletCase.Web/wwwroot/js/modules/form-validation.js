import { Utils } from './utils.js';

export const FormValidation = {
    form: null,
    originSelect: null,
    destinationSelect: null,

    init() {
        this.form = Utils.$('#searchForm');
        this.originSelect = Utils.$('#originSelect');
        this.destinationSelect = Utils.$('#destinationSelect');

        if (!this.form) return;

        this.bindSubmitValidation();
    },

    bindSubmitValidation() {
        Utils.on(this.form, 'submit', (e) => {
            if (!this.validateForm()) {
                e.preventDefault();
            }
        });
    },

    validateForm() {
        if (this.originSelect && this.destinationSelect) {
            if (this.originSelect.value === this.destinationSelect.value) {
                this.showError('Kalkış ve varış noktası aynı olamaz!');
                return false;
            }
        }
        return true;
    },

    showError(message) {
        let alertEl = Utils.$('.js-validation-alert');
        
        if (!alertEl) {
            alertEl = document.createElement('div');
            alertEl.className = 'alert alert-danger alert-dismissible fade show js-validation-alert';
            alertEl.innerHTML = `
                <i class="fa-solid fa-circle-exclamation me-2"></i>
                <span class="alert-message"></span>
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            `;
            this.form.insertBefore(alertEl, this.form.firstChild);
        }

        alertEl.querySelector('.alert-message').textContent = message;
        alertEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
};