import { Utils } from './utils.js';

export const LocationSwap = {
    swapBtn: null,
    originSelect: null,
    destinationSelect: null,

    init() {
        this.swapBtn = Utils.$('#swapBtn');
        this.originSelect = Utils.$('#originSelect');
        this.destinationSelect = Utils.$('#destinationSelect');

        if (!this.swapBtn || !this.originSelect || !this.destinationSelect) return;

        this.bindSwapEvent();
    },

    bindSwapEvent() {
        Utils.on(this.swapBtn, 'click', () => {
            this.swapLocations();
            this.animateButton();
        });
    },

    swapLocations() {
        const tempValue = this.originSelect.value;
        this.originSelect.value = this.destinationSelect.value;
        this.destinationSelect.value = tempValue;

        this.originSelect.dispatchEvent(new Event('change'));
        this.destinationSelect.dispatchEvent(new Event('change'));
    },

    animateButton() {
        const icon = this.swapBtn.querySelector('i');
        if (icon) {
            icon.style.transform = 'rotate(180deg)';
            setTimeout(() => {
                icon.style.transform = 'rotate(0deg)';
            }, 300);
        }
    }
};