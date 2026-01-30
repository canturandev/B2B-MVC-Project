import { Utils } from './utils.js';

export const ModernDatePicker = {
    wrapper: null,
    input: null,
    dropdown: null,
    hiddenInput: null,
    currentMonth: null,
    currentYear: null,
    selectedDate: null,
    months: ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
        'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'],
    weekdays: ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'],

    init() {
        const dateGroup = Utils.$('.date-group');
        if (!dateGroup) return;

        this.hiddenInput = Utils.$('#dateInput');
        if (!this.hiddenInput) return;

        const initialDate = this.hiddenInput.value ? new Date(this.hiddenInput.value) : new Date(Utils.getTomorrow());
        this.selectedDate = initialDate;
        this.currentMonth = initialDate.getMonth();
        this.currentYear = initialDate.getFullYear();

        this.createDatePicker(dateGroup);
        this.bindEvents();
        this.updateDisplay();
    },

    createDatePicker(container) {
        const floatingDiv = container.querySelector('.form-floating');
        if (floatingDiv) floatingDiv.style.display = 'none';

        this.wrapper = document.createElement('div');
        this.wrapper.className = 'date-picker-wrapper';

        this.input = document.createElement('div');
        this.input.className = 'date-picker-input';
        this.input.innerHTML = `
            <div class="date-picker-value">
                <i class="fa-regular fa-calendar"></i>
                <div class="date-picker-text">
                    <span class="date-picker-label">Tarih Seçin</span>
                    <span class="date-picker-date"></span>
                </div>
            </div>
            <i class="fa-solid fa-chevron-down date-picker-icon"></i>
        `;

        // Create overlay for modal effect
        this.overlay = document.createElement('div');
        this.overlay.className = 'date-picker-overlay';
        document.body.appendChild(this.overlay);

        this.dropdown = document.createElement('div');
        this.dropdown.className = 'date-picker-dropdown';
        document.body.appendChild(this.dropdown);

        this.wrapper.appendChild(this.input);
        container.appendChild(this.wrapper);

        this.renderCalendar();
    },

    renderCalendar() {
        const firstDay = new Date(this.currentYear, this.currentMonth, 1);
        const lastDay = new Date(this.currentYear, this.currentMonth + 1, 0);
        const startDay = (firstDay.getDay() + 6) % 7;
        const daysInMonth = lastDay.getDate();
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let html = `
            <div class="date-picker-header">
                <span class="date-picker-month">${this.months[this.currentMonth]} ${this.currentYear}</span>
                <div class="date-picker-nav">
                    <button type="button" class="date-nav-btn" data-action="prev">
                        <i class="fa-solid fa-chevron-left"></i>
                    </button>
                    <button type="button" class="date-nav-btn" data-action="next">
                        <i class="fa-solid fa-chevron-right"></i>
                    </button>
                </div>
            </div>
            <div class="date-picker-weekdays">
                ${this.weekdays.map(d => `<span class="date-picker-weekday">${d}</span>`).join('')}
            </div>
            <div class="date-picker-days">
        `;

        const prevMonthLastDay = new Date(this.currentYear, this.currentMonth, 0).getDate();
        for (let i = startDay - 1; i >= 0; i--) {
            html += `<button type="button" class="date-picker-day other-month disabled">${prevMonthLastDay - i}</button>`;
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(this.currentYear, this.currentMonth, day);
            const isToday = date.toDateString() === today.toDateString();
            const isSelected = this.selectedDate && date.toDateString() === this.selectedDate.toDateString();
            const isPast = date < today;

            let classes = 'date-picker-day';
            if (isToday) classes += ' today';
            if (isSelected) classes += ' selected';
            if (isPast) classes += ' disabled';

            html += `<button type="button" class="${classes}" data-date="${this.currentYear}-${String(this.currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}">${day}</button>`;
        }

        const totalCells = startDay + daysInMonth;
        const remaining = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
        for (let i = 1; i <= remaining; i++) {
            html += `<button type="button" class="date-picker-day other-month disabled">${i}</button>`;
        }

        html += '</div>';
        this.dropdown.innerHTML = html;
    },

    updateDisplay() {
        if (!this.selectedDate) return;

        const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
        const lang = document.documentElement.getAttribute('data-lang') || 'tr';
        const displayDate = this.selectedDate.toLocaleDateString(lang === 'tr' ? 'tr-TR' : 'en-US', options);

        const dateDisplay = this.input.querySelector('.date-picker-date');
        if (dateDisplay) dateDisplay.textContent = displayDate;

        if (this.hiddenInput) {
            this.hiddenInput.value = Utils.formatDate(this.selectedDate);
        }

        this.updatePresetButtons();
    },

    updatePresetButtons() {
        const presetButtons = Utils.$$('.date-preset');
        const today = Utils.getToday();
        const tomorrow = Utils.getTomorrow();
        const selectedStr = Utils.formatDate(this.selectedDate);

        presetButtons.forEach(btn => {
            const dateType = btn.dataset.date;
            const isActive = (dateType === 'today' && selectedStr === today) ||
                (dateType === 'tomorrow' && selectedStr === tomorrow);
            btn.classList.toggle('active', isActive);
        });
    },

    show() {
        this.dropdown.classList.add('show');
        this.overlay.classList.add('show');
        this.input.classList.add('active');
        document.body.style.overflow = 'hidden';
    },

    hide() {
        this.dropdown.classList.remove('show');
        this.overlay.classList.remove('show');
        this.input.classList.remove('active');
        document.body.style.overflow = '';
    },

    toggle() {
        if (this.dropdown.classList.contains('show')) {
            this.hide();
        } else {
            this.show();
        }
    },

    selectDate(dateStr) {
        this.selectedDate = new Date(dateStr);
        this.updateDisplay();
        this.renderCalendar();
        this.hide();
    },

    bindEvents() {
        Utils.on(this.input, 'click', () => this.show());

        // Close on overlay click
        Utils.on(this.overlay, 'click', () => this.hide());

        Utils.on(this.dropdown, 'click', (e) => {
            e.stopPropagation();

            const target = e.target.closest('.date-nav-btn');
            if (target) {
                const action = target.dataset.action;
                if (action === 'prev') {
                    this.currentMonth--;
                    if (this.currentMonth < 0) {
                        this.currentMonth = 11;
                        this.currentYear--;
                    }
                } else if (action === 'next') {
                    this.currentMonth++;
                    if (this.currentMonth > 11) {
                        this.currentMonth = 0;
                        this.currentYear++;
                    }
                }
                this.renderCalendar();
                return;
            }

            const dayBtn = e.target.closest('.date-picker-day');
            if (dayBtn && !dayBtn.classList.contains('disabled') && dayBtn.dataset.date) {
                this.selectDate(dayBtn.dataset.date);
            }
        });

        // Preset buttons
        const presetButtons = Utils.$$('.date-preset');
        presetButtons.forEach(btn => {
            Utils.on(btn, 'click', () => {
                const dateType = btn.dataset.date;
                const newDate = dateType === 'today' ? Utils.getToday() : Utils.getTomorrow();
                this.selectDate(newDate);
            });
        });

        // Close on Escape key
        Utils.on(document, 'keydown', (e) => {
            if (e.key === 'Escape') {
                this.hide();
            }
        });
    }
};