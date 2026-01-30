import { Utils } from './utils.js';

export const SmoothScroll = {
    init() {
        Utils.$$('a[href^="#"]').forEach(anchor => {
            Utils.on(anchor, 'click', (e) => {
                const targetId = anchor.getAttribute('href');
                if (targetId === '#') return;

                const targetElement = Utils.$(targetId);
                if (targetElement) {
                    e.preventDefault();
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
};