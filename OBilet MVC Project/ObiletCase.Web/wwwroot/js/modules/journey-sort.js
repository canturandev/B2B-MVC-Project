import { Utils } from './utils.js';

export const JourneySort = {
    container: null,
    journeyList: null,
    journeys: [],
    currentSort: 'default',

    init() {
        this.journeyList = Utils.$('.journey-list');
        if (!this.journeyList) return;

        this.journeys = Array.from(Utils.$$('.journey-card'));
        if (this.journeys.length === 0) return;

        this.createSortToolbar();
        this.markSpecialJourneys();
        this.bindEvents();
    },

    createSortToolbar() {
        const container = Utils.$('.journey-results .container .row .col-lg-9'); // col-lg-8'i col-lg-9 yaptım, genelde o class var
        if (!container && this.journeyList) {
            // Container bulunamazsa listenin hemen öncesine eklemeyi dene
            this.journeyList.parentNode.insertBefore(this.createToolbarElement(), this.journeyList);
            return;
        }
        if (container && this.journeyList) {
            container.insertBefore(this.createToolbarElement(), this.journeyList);
        }
    },

    createToolbarElement() {
        const toolbar = document.createElement('div');
        toolbar.className = 'journey-toolbar';
        toolbar.innerHTML = `
            <div class="journey-sort">
                <span class="journey-sort__label" data-i18n="journey.sortBy">Sırala:</span>
                <div class="sort-buttons">
                    <button type="button" class="sort-btn active" data-sort="default">
                        <i class="fa-solid fa-bars"></i>
                        <span>Varsayılan</span>
                    </button>
                    <button type="button" class="sort-btn" data-sort="price-asc">
                        <i class="fa-solid fa-arrow-up-short-wide"></i>
                        <span data-i18n="journey.priceAsc">Fiyat (Artan)</span>
                    </button>
                    <button type="button" class="sort-btn" data-sort="price-desc">
                        <i class="fa-solid fa-arrow-down-wide-short"></i>
                        <span data-i18n="journey.priceDesc">Fiyat (Azalan)</span>
                    </button>
                </div>
            </div>
        `;
        return toolbar;
    },

    markSpecialJourneys() {
        const prices = this.journeys.map(j => this.getPrice(j));
        const minPrice = Math.min(...prices.filter(p => p > 0));

        const durations = this.journeys.map(j => this.getDuration(j));
        const sortedDurations = [...durations].filter(d => d > 0).sort((a, b) => a - b);
        const fastestDuration = sortedDurations[0];
        const secondFastestDuration = sortedDurations[1];

        this.journeys.forEach((journey, index) => {
            const price = prices[index];
            const duration = durations[index];

            const badgeContainer = this.createBadgeContainer(journey);

            if (price === minPrice && price > 0) {
                badgeContainer.innerHTML += `
                    <span class="journey-badge journey-badge--cheapest">
                        <i class="fa-solid fa-tag"></i>
                        <span data-i18n="journey.cheapest">En Ucuz</span>
                    </span>
                `;
            }

            if (duration === fastestDuration && duration > 0) {
                badgeContainer.innerHTML += `
                    <span class="journey-badge journey-badge--fastest">
                        <i class="fa-solid fa-bolt"></i>
                        <span data-i18n="journey.fastest">En Hızlı</span>
                    </span>
                `;
            } else if (duration === secondFastestDuration && duration > 0 && secondFastestDuration !== fastestDuration) {
                badgeContainer.innerHTML += `
                    <span class="journey-badge journey-badge--second-fastest">
                        <i class="fa-solid fa-bolt"></i>
                        <span data-i18n="journey.secondFastest">2. En Hızlı</span>
                    </span>
                `;
            }
        });
    },

    createBadgeContainer(journey) {
        let container = journey.querySelector('.journey-badges');
        if (!container) {
            container = document.createElement('div');
            container.className = 'journey-badges';
            const priceSection = journey.querySelector('.journey-card__price');
            if (priceSection) {
                priceSection.parentNode.insertBefore(container, priceSection);
            }
        }
        return container;
    },

    getPrice(journey) {
        const priceEl = journey.querySelector('.price-amount');
        if (!priceEl) return 0;
        return parseFloat(priceEl.textContent.replace(/[^0-9]/g, '')) || 0;
    },

    getDuration(journey) {
        const durationEl = journey.querySelector('.duration-text');
        if (!durationEl) return 0;

        const text = durationEl.textContent;
        const match = text.match(/(\d+):(\d+):(\d+)/);
        if (match) {
            return parseInt(match[1]) * 3600 + parseInt(match[2]) * 60 + parseInt(match[3]);
        }
        return 0;
    },

    sortJourneys(sortType) {
        this.currentSort = sortType;

        // Use requestAnimationFrame for smooth rendering
        requestAnimationFrame(() => {
            let sortedJourneys;

            switch (sortType) {
                case 'price-asc':
                    sortedJourneys = [...this.journeys].sort((a, b) => this.getPrice(a) - this.getPrice(b));
                    break;
                case 'price-desc':
                    sortedJourneys = [...this.journeys].sort((a, b) => this.getPrice(b) - this.getPrice(a));
                    break;
                default:
                    sortedJourneys = this.journeys;
            }

            // Use DocumentFragment for better performance
            const fragment = document.createDocumentFragment();
            sortedJourneys.forEach((journey, index) => {
                journey.style.animationDelay = `${index * 20}ms`;
                fragment.appendChild(journey);
            });
            this.journeyList.appendChild(fragment);

            Utils.$$('.sort-btn').forEach(btn => {
                btn.classList.toggle('active', btn.dataset.sort === sortType);
            });
        });
    },

    bindEvents() {
        Utils.on(document, 'click', (e) => {
            const sortBtn = e.target.closest('.sort-btn');
            if (sortBtn) {
                this.sortJourneys(sortBtn.dataset.sort);
            }
        });
    }
};