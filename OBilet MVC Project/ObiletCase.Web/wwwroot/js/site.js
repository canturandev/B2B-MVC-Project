import { ThemeToggle } from './modules/theme-toggle.js';
import { CookieConsent } from './modules/cookie-consent.js';
import { ModernDatePicker } from './modules/modern-datepicker.js';
import { LocationSwap } from './modules/location-swap.js';
import { FormValidation } from './modules/form-validation.js';
import { FormHandler } from './modules/form-handler.js';
import { LoadingState } from './modules/loading-state.js';
import { SmoothScroll } from './modules/smooth-scroll.js';
import { JourneySort } from './modules/journey-sort.js';
import { Pagination } from './modules/pagination.js';
import { JourneyFilter } from './modules/journey-filter.js';
import { MapDrawer } from './modules/map-drawer.js';

function init() {
    ThemeToggle.init();
    CookieConsent.init();
    ModernDatePicker.init();
    LocationSwap.init();
    FormValidation.init();
    FormHandler.init();
    LoadingState.init();
    SmoothScroll.init();
    JourneySort.init();
    Pagination.init();
    JourneyFilter.init();
    MapDrawer.init();

    console.log('Obilet UI initialized successfully (ES Modules).');
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}