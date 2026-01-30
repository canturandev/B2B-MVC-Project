import { Utils } from './utils.js';

export const JourneyFilter = {
    journeyCards: null,
    filterPanel: null,
    filterToggle: null,
    activeFiltersContainer: null,
    activeFilterTags: null,
    filterCount: null,
    visibleCountEl: null,
    filterNoResults: null,
    journeyList: null,
    filters: {
        cheapest: false,
        fastest: false,
        priceMin: 0,
        priceMax: Infinity,
        timeRanges: [],
        companies: [],
        busTypes: []
    },

    init() {
        this.journeyCards = Utils.$$('.journey-card');
        this.filterPanel = Utils.$('.filter-panel');
        this.filterToggle = Utils.$('#filterToggle');
        this.activeFiltersContainer = Utils.$('#activeFilters');
        this.activeFilterTags = Utils.$('#activeFilterTags');
        this.filterCount = Utils.$('#filterCount');
        this.visibleCountEl = Utils.$('#visibleCount');
        this.filterNoResults = Utils.$('#filterNoResults');
        this.journeyList = Utils.$('#journeyList');

        if (!this.journeyCards.length || !this.filterPanel) return;

        this.populateCompanyFilters();
        this.populateBusTypeFilters();
        this.initPriceRange();
        this.bindEvents();
    },

    populateCompanyFilters() {
        const container = Utils.$('#companyFilters');
        if (!container) return;

        const companies = {};
        this.journeyCards.forEach(card => {
            const company = card.dataset.company;
            if (company) {
                companies[company] = (companies[company] || 0) + 1;
            }
        });

        const sortedCompanies = Object.entries(companies).sort((a, b) => b[1] - a[1]);

        container.innerHTML = sortedCompanies.map(([name, count]) => `
            <label class="company-filter-item">
                <input type="checkbox" class="filter-checkbox company-filter" data-company="${name}">
                <span class="company-filter-label">
                    <span>${name}</span>
                    <span class="company-count">${count}</span>
                </span>
            </label>
        `).join('');
    },

    populateBusTypeFilters() {
        const container = Utils.$('#busTypeFilters');
        if (!container) return;

        const busTypes = {};
        this.journeyCards.forEach(card => {
            const busType = card.dataset.busType;
            if (busType) {
                busTypes[busType] = (busTypes[busType] || 0) + 1;
            }
        });

        const sortedTypes = Object.entries(busTypes).sort((a, b) => b[1] - a[1]);

        container.innerHTML = sortedTypes.map(([type, count]) => `
            <label class="bus-type-filter-item">
                <input type="checkbox" class="filter-checkbox bus-type-filter" data-bus-type="${type}">
                <span class="bus-type-filter-label">
                    <span>${type}</span>
                    <span class="bus-type-count">${count}</span>
                </span>
            </label>
        `).join('');
    },

    initPriceRange() {
        const prices = Array.from(this.journeyCards).map(card => parseFloat(card.dataset.price) || 0);
        const maxPrice = Math.max(...prices);
        const minPrice = Math.min(...prices);

        const priceSlider = Utils.$('#priceSlider');
        const priceMin = Utils.$('#priceMin');
        const priceMax = Utils.$('#priceMax');
        const sliderValue = Utils.$('#priceSliderValue');

        if (priceSlider) {
            priceSlider.max = Math.ceil(maxPrice / 100) * 100;
            priceSlider.value = priceSlider.max;
        }

        if (priceMin) priceMin.placeholder = Math.floor(minPrice);
        if (priceMax) priceMax.placeholder = Math.ceil(maxPrice);
        if (sliderValue) sliderValue.textContent = `${Math.ceil(maxPrice)} ₺`;
    },

    bindEvents() {
        // Mobile filter toggle
        if (this.filterToggle) {
            Utils.on(this.filterToggle, 'click', () => {
                this.filterPanel.classList.toggle('active');
                document.body.style.overflow = this.filterPanel.classList.contains('active') ? 'hidden' : '';
            });
        }

        // Apply filters button (mobile)
        const applyBtn = Utils.$('#applyFilters');
        if (applyBtn) {
            Utils.on(applyBtn, 'click', () => {
                this.filterPanel.classList.remove('active');
                document.body.style.overflow = '';
            });
        }

        // Reset filters
        const resetBtns = [Utils.$('#resetFilters'), Utils.$('#resetFiltersAlt'), Utils.$('#clearAllFilters')];
        resetBtns.forEach(btn => {
            if (btn) {
                Utils.on(btn, 'click', () => this.resetFilters());
            }
        });

        // Quick filters
        const cheapestFilter = Utils.$('#filterCheapest');
        const fastestFilter = Utils.$('#filterFastest');

        if (cheapestFilter) {
            Utils.on(cheapestFilter, 'change', () => {
                this.filters.cheapest = cheapestFilter.checked;
                this.applyFilters();
            });
        }

        if (fastestFilter) {
            Utils.on(fastestFilter, 'change', () => {
                this.filters.fastest = fastestFilter.checked;
                this.applyFilters();
            });
        }

        // Price inputs with debounce for better performance
        const priceMin = Utils.$('#priceMin');
        const priceMax = Utils.$('#priceMax');
        const priceSlider = Utils.$('#priceSlider');
        const sliderValue = Utils.$('#priceSliderValue');

        // Debounced filter application
        const debouncedApply = Utils.debounce(() => this.applyFilters(), 200);

        if (priceMin) {
            Utils.on(priceMin, 'input', () => {
                this.filters.priceMin = parseFloat(priceMin.value) || 0;
                debouncedApply();
            });
        }

        if (priceMax) {
            Utils.on(priceMax, 'input', () => {
                this.filters.priceMax = parseFloat(priceMax.value) || Infinity;
                debouncedApply();
            });
        }

        if (priceSlider) {
            Utils.on(priceSlider, 'input', () => {
                const value = parseFloat(priceSlider.value);
                this.filters.priceMax = value;
                if (sliderValue) sliderValue.textContent = `${value} ₺`;
                if (priceMax) priceMax.value = value;
                debouncedApply();
            });
        }

        // Time filters
        Utils.$$('.time-filter').forEach(checkbox => {
            Utils.on(checkbox, 'change', () => {
                this.updateTimeFilters();
                this.applyFilters();
            });
        });

        // Company filters
        Utils.on(Utils.$('#companyFilters'), 'change', (e) => {
            if (e.target.classList.contains('company-filter')) {
                this.updateCompanyFilters();
                this.applyFilters();
            }
        });

        // Bus type filters
        Utils.on(Utils.$('#busTypeFilters'), 'change', (e) => {
            if (e.target.classList.contains('bus-type-filter')) {
                this.updateBusTypeFilters();
                this.applyFilters();
            }
        });
    },

    updateTimeFilters() {
        this.filters.timeRanges = [];
        Utils.$$('.time-filter:checked').forEach(checkbox => {
            this.filters.timeRanges.push({
                start: parseInt(checkbox.dataset.start.split(':')[0]),
                end: parseInt(checkbox.dataset.end.split(':')[0])
            });
        });
    },

    updateCompanyFilters() {
        this.filters.companies = [];
        Utils.$$('.company-filter:checked').forEach(checkbox => {
            this.filters.companies.push(checkbox.dataset.company);
        });
    },

    updateBusTypeFilters() {
        this.filters.busTypes = [];
        Utils.$$('.bus-type-filter:checked').forEach(checkbox => {
            this.filters.busTypes.push(checkbox.dataset.busType);
        });
    },

    applyFilters() {
        // Use requestAnimationFrame for smooth rendering
        requestAnimationFrame(() => {
            let visibleCount = 0;

            // Cache these calculations
            const cheapestCards = this.filters.cheapest ? this.getCheapestCards() : [];
            const fastestCards = this.filters.fastest ? this.getFastestCards() : [];

            // Batch DOM reads first, then writes
            const updates = [];

            this.journeyCards.forEach(card => {
                const price = parseFloat(card.dataset.price) || 0;
                const company = card.dataset.company || '';
                const busType = card.dataset.busType || '';
                const departureHour = parseInt(card.dataset.departureHour) || 0;

                let visible = true;

                // Price filter
                if (price < this.filters.priceMin || price > this.filters.priceMax) {
                    visible = false;
                }

                // Time range filter
                if (visible && this.filters.timeRanges.length > 0) {
                    const inRange = this.filters.timeRanges.some(range => {
                        if (range.end === 24) {
                            return departureHour >= range.start && departureHour < 24;
                        }
                        return departureHour >= range.start && departureHour < range.end;
                    });
                    if (!inRange) visible = false;
                }

                // Company filter
                if (visible && this.filters.companies.length > 0 && !this.filters.companies.includes(company)) {
                    visible = false;
                }

                // Bus type filter
                if (visible && this.filters.busTypes.length > 0 && !this.filters.busTypes.includes(busType)) {
                    visible = false;
                }

                // Cheapest filter
                if (visible && this.filters.cheapest && !cheapestCards.includes(card)) {
                    visible = false;
                }

                // Fastest filter
                if (visible && this.filters.fastest && !fastestCards.includes(card)) {
                    visible = false;
                }

                updates.push({ card, visible });
                if (visible) visibleCount++;
            });

            // Batch DOM writes
            updates.forEach(({ card, visible }) => {
                const newDisplay = visible ? '' : 'none';
                if (card.style.display !== newDisplay) {
                    card.style.display = newDisplay;
                }
            });

            // Update visible count
            if (this.visibleCountEl) {
                this.visibleCountEl.textContent = visibleCount;
            }

            // Show/hide no results message
            if (this.filterNoResults && this.journeyList) {
                const hasResults = visibleCount > 0;
                this.filterNoResults.style.display = hasResults ? 'none' : 'block';
                this.journeyList.style.display = hasResults ? '' : 'none';
            }

            this.updateActiveFiltersDisplay();
            this.updateFilterCount();
        });
    },

    getCheapestCards() {
        const prices = Array.from(this.journeyCards)
            .map(card => parseFloat(card.dataset.price) || Infinity);
        const minPrice = Math.min(...prices);
        return Array.from(this.journeyCards)
            .filter(card => parseFloat(card.dataset.price) === minPrice);
    },

    getFastestCards() {
        const durations = Array.from(this.journeyCards)
            .map(card => {
                const duration = card.dataset.duration || '99:99:99';
                return this.parseDuration(duration);
            });
        const minDuration = Math.min(...durations);
        const secondMinDuration = Math.min(...durations.filter(d => d > minDuration));

        return Array.from(this.journeyCards).filter(card => {
            const duration = this.parseDuration(card.dataset.duration || '99:99:99');
            return duration === minDuration || duration === secondMinDuration;
        });
    },

    parseDuration(duration) {
        const parts = duration.split(':').map(Number);
        return parts[0] * 3600 + (parts[1] || 0) * 60 + (parts[2] || 0);
    },

    getActiveFilterCount() {
        let count = 0;
        if (this.filters.cheapest) count++;
        if (this.filters.fastest) count++;
        if (this.filters.priceMin > 0) count++;
        if (this.filters.priceMax < Infinity && Utils.$('#priceSlider') &&
            this.filters.priceMax < parseFloat(Utils.$('#priceSlider').max)) count++;
        count += this.filters.timeRanges.length;
        count += this.filters.companies.length;
        count += this.filters.busTypes.length;
        return count;
    },

    updateFilterCount() {
        const count = this.getActiveFilterCount();
        if (this.filterCount) {
            this.filterCount.style.display = count > 0 ? 'inline' : 'none';
            this.filterCount.textContent = count;
        }
    },

    updateActiveFiltersDisplay() {
        if (!this.activeFiltersContainer || !this.activeFilterTags) return;

        const tags = [];

        if (this.filters.cheapest) {
            tags.push(this.createFilterTag('En Ucuz', 'cheapest'));
        }
        if (this.filters.fastest) {
            tags.push(this.createFilterTag('En Hızlı', 'fastest'));
        }
        if (this.filters.priceMin > 0) {
            tags.push(this.createFilterTag(`Min: ${this.filters.priceMin}₺`, 'priceMin'));
        }
        if (this.filters.priceMax < Infinity && Utils.$('#priceSlider') &&
            this.filters.priceMax < parseFloat(Utils.$('#priceSlider').max)) {
            tags.push(this.createFilterTag(`Max: ${this.filters.priceMax}₺`, 'priceMax'));
        }
        this.filters.timeRanges.forEach((range, i) => {
            const timeLabels = { 0: 'Gece', 6: 'Sabah', 12: 'Öğle', 18: 'Akşam' };
            tags.push(this.createFilterTag(timeLabels[range.start] || `${range.start}:00-${range.end}:00`, `time-${i}`));
        });
        this.filters.companies.forEach(company => {
            tags.push(this.createFilterTag(company, `company-${company}`));
        });
        this.filters.busTypes.forEach(type => {
            tags.push(this.createFilterTag(type, `bustype-${type}`));
        });

        this.activeFilterTags.innerHTML = tags.join('');
        this.activeFiltersContainer.style.display = tags.length > 0 ? 'flex' : 'none';

        // Bind remove events
        this.activeFilterTags.querySelectorAll('.active-filter-tag__remove').forEach(btn => {
            Utils.on(btn, 'click', () => this.removeFilter(btn.dataset.filter));
        });
    },

    createFilterTag(label, filterId) {
        return `
            <span class="active-filter-tag">
                ${label}
                <button type="button" class="active-filter-tag__remove" data-filter="${filterId}">
                    <i class="fa-solid fa-times"></i>
                </button>
            </span>
        `;
    },

    removeFilter(filterId) {
        if (filterId === 'cheapest') {
            this.filters.cheapest = false;
            const checkbox = Utils.$('#filterCheapest');
            if (checkbox) checkbox.checked = false;
        } else if (filterId === 'fastest') {
            this.filters.fastest = false;
            const checkbox = Utils.$('#filterFastest');
            if (checkbox) checkbox.checked = false;
        } else if (filterId === 'priceMin') {
            this.filters.priceMin = 0;
            const input = Utils.$('#priceMin');
            if (input) input.value = '';
        } else if (filterId === 'priceMax') {
            const slider = Utils.$('#priceSlider');
            this.filters.priceMax = slider ? parseFloat(slider.max) : Infinity;
            const input = Utils.$('#priceMax');
            if (input) input.value = '';
            if (slider) slider.value = slider.max;
            const sliderValue = Utils.$('#priceSliderValue');
            if (sliderValue && slider) sliderValue.textContent = `${slider.max} ₺`;
        } else if (filterId.startsWith('time-')) {
            this.filters.timeRanges = [];
            Utils.$$('.time-filter').forEach(cb => cb.checked = false);
        } else if (filterId.startsWith('company-')) {
            const company = filterId.replace('company-', '');
            this.filters.companies = this.filters.companies.filter(c => c !== company);
            const checkbox = Utils.$(`.company-filter[data-company="${company}"]`);
            if (checkbox) checkbox.checked = false;
        } else if (filterId.startsWith('bustype-')) {
            const type = filterId.replace('bustype-', '');
            this.filters.busTypes = this.filters.busTypes.filter(t => t !== type);
            const checkbox = Utils.$(`.bus-type-filter[data-bus-type="${type}"]`);
            if (checkbox) checkbox.checked = false;
        }
        this.applyFilters();
    },

    resetFilters() {
        // Reset filter state
        this.filters = {
            cheapest: false,
            fastest: false,
            priceMin: 0,
            priceMax: Infinity,
            timeRanges: [],
            companies: [],
            busTypes: []
        };

        // Reset UI
        Utils.$$('.filter-checkbox').forEach(cb => cb.checked = false);

        const priceMin = Utils.$('#priceMin');
        const priceMax = Utils.$('#priceMax');
        const priceSlider = Utils.$('#priceSlider');
        const sliderValue = Utils.$('#priceSliderValue');

        if (priceMin) priceMin.value = '';
        if (priceMax) priceMax.value = '';
        if (priceSlider) {
            priceSlider.value = priceSlider.max;
            this.filters.priceMax = parseFloat(priceSlider.max);
        }
        if (sliderValue && priceSlider) sliderValue.textContent = `${priceSlider.max} ₺`;

        this.applyFilters();

        // Close mobile panel
        if (this.filterPanel) {
            this.filterPanel.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
};