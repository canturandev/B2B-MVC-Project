import { Utils } from './utils.js';

export const Pagination = {
    journeyList: null,
    allJourneys: [],
    currentCount: 10,

    init() {
        this.journeyList = Utils.$('.journey-list');
        if (!this.journeyList) return;

        this.allJourneys = Array.from(Utils.$$('.journey-card'));
        if (this.allJourneys.length <= 10) return;

        this.createPagination();
        this.applyPagination(10);
        this.bindEvents();
    },

    createPagination() {
        const footer = Utils.$('.journey-footer');
        if (!footer) return;

        const paginationWrapper = document.createElement('div');
        paginationWrapper.className = 'pagination-wrapper';
        paginationWrapper.innerHTML = `
            <span class="pagination-label" data-i18n="journey.showResults">Sonuç Göster:</span>
            <div class="pagination-buttons">
                <button type="button" class="pagination-btn active" data-count="10">10</button>
                <button type="button" class="pagination-btn" data-count="50">50</button>
                <button type="button" class="pagination-btn" data-count="100">100</button>
                <button type="button" class="pagination-btn" data-count="all">100+</button>
            </div>
        `;
        
        footer.parentNode.insertBefore(paginationWrapper, footer);
    },

    applyPagination(count) {
        this.currentCount = count;
        const showCount = count === 'all' ? this.allJourneys.length : Math.min(count, this.allJourneys.length);
        
        this.allJourneys.forEach((journey, index) => {
            if (index < showCount) {
                journey.style.display = '';
                journey.style.animationDelay = `${index * 30}ms`;
            } else {
                journey.style.display = 'none';
            }
        });

        Utils.$$('.pagination-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.count == count);
        });
    },

    bindEvents() {
        Utils.on(document, 'click', (e) => {
            const paginationBtn = e.target.closest('.pagination-btn');
            if (paginationBtn) {
                const count = paginationBtn.dataset.count;
                this.applyPagination(count === 'all' ? 'all' : parseInt(count));
            }
        });
    }
};