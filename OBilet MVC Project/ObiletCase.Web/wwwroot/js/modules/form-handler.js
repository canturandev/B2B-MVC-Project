import { Utils } from './utils.js';

export const FormHandler = {
    init() {
        this.originSelect = Utils.$('#originSelect');
        this.destinationSelect = Utils.$('#destinationSelect');
        this.originNameInput = Utils.$('#OriginName');
        this.destinationNameInput = Utils.$('#DestinationName');
        
        if (this.originSelect && this.originNameInput) {
            Utils.on(this.originSelect, 'change', () => this.updateOriginName());
        }
        
        if (this.destinationSelect && this.destinationNameInput) {
            Utils.on(this.destinationSelect, 'change', () => this.updateDestinationName());
        }
        
        // Populate hidden fields with current selections immediately
        try {
            this.updateOriginName();
            this.updateDestinationName();
        } catch (e) {
            console.warn('FormHandler init: could not populate origin/destination names', e);
        }

        // Log values on submit to help debug server redirect issues
        const form = Utils.$('#searchForm');
        if (form) {
            Utils.on(form, 'submit', () => {
                console.log('Submitting search form', {
                    OriginId: this.originSelect ? this.originSelect.value : null,
                    DestinationId: this.destinationSelect ? this.destinationSelect.value : null,
                    OriginName: this.originNameInput ? this.originNameInput.value : null,
                    DestinationName: this.destinationNameInput ? this.destinationNameInput.value : null,
                    DepartureDate: Utils.$('#dateInput') ? Utils.$('#dateInput').value : null
                });
            });
        }
    },
    
    updateOriginName() {
        const selectedOption = this.originSelect.options[this.originSelect.selectedIndex];
        if (selectedOption) {
            this.originNameInput.value = selectedOption.text !== 'Seçiniz' ? selectedOption.text : '';
        }
    },
    
    updateDestinationName() {
        const selectedOption = this.destinationSelect.options[this.destinationSelect.selectedIndex];
        if (selectedOption) {
            this.destinationNameInput.value = selectedOption.text !== 'Seçiniz' ? selectedOption.text : '';
        }
    }
};