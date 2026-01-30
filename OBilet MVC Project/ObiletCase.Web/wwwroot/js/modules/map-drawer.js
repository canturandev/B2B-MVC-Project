import { Utils } from './utils.js';

export const MapDrawer = {
    drawer: null,
    overlay: null,
    closeBtn: null,
    map: null,
    markers: [],

    // Türkiye'deki popüler otogarların koordinatları
    busStations: {
        // İstanbul
        'esenler': { lat: 41.0419, lng: 28.8950, name: 'Esenler Otogarı' },
        'esenler otogarı': { lat: 41.0419, lng: 28.8950, name: 'Esenler Otogarı' },
        'istanbul otogarı': { lat: 41.0419, lng: 28.8950, name: 'İstanbul Otogarı' },
        'alibeyköy': { lat: 41.0667, lng: 28.9500, name: 'Alibeyköy Otogarı' },
        'alibeyköy otogarı': { lat: 41.0667, lng: 28.9500, name: 'Alibeyköy Otogarı' },
        'harem': { lat: 41.0053, lng: 29.0208, name: 'Harem Otogarı' },
        'harem otogarı': { lat: 41.0053, lng: 29.0208, name: 'Harem Otogarı' },
        'dudullu': { lat: 41.0167, lng: 29.1500, name: 'Dudullu Otogarı' },
        'samandıra': { lat: 40.9667, lng: 29.2167, name: 'Samandıra Otogarı' },

        // Ankara
        'aşti': { lat: 39.9167, lng: 32.8333, name: 'AŞTİ' },
        'ankara': { lat: 39.9167, lng: 32.8333, name: 'Ankara Otogarı' },
        'ankara otogarı': { lat: 39.9167, lng: 32.8333, name: 'Ankara Otogarı' },
        'ankara şehirlerarası': { lat: 39.9167, lng: 32.8333, name: 'AŞTİ' },

        // İzmir
        'izmir': { lat: 38.4614, lng: 27.1011, name: 'İzmir Otogarı' },
        'izmir otogarı': { lat: 38.4614, lng: 27.1011, name: 'İzmir Otogarı' },

        // Antalya
        'antalya': { lat: 36.9081, lng: 30.6961, name: 'Antalya Otogarı' },
        'antalya otogarı': { lat: 36.9081, lng: 30.6961, name: 'Antalya Otogarı' },

        // Bursa
        'bursa': { lat: 40.2256, lng: 28.8744, name: 'Bursa Otogarı' },
        'bursa otogarı': { lat: 40.2256, lng: 28.8744, name: 'Bursa Otogarı' },

        // Konya
        'konya': { lat: 37.8833, lng: 32.4833, name: 'Konya Otogarı' },
        'konya otogarı': { lat: 37.8833, lng: 32.4833, name: 'Konya Otogarı' },

        // Adana
        'adana': { lat: 37.0167, lng: 35.3167, name: 'Adana Otogarı' },
        'adana otogarı': { lat: 37.0167, lng: 35.3167, name: 'Adana Otogarı' },

        // Gaziantep
        'gaziantep': { lat: 37.0594, lng: 37.3500, name: 'Gaziantep Otogarı' },
        'gaziantep otogarı': { lat: 37.0594, lng: 37.3500, name: 'Gaziantep Otogarı' },

        // Mersin
        'mersin': { lat: 36.7833, lng: 34.6167, name: 'Mersin Otogarı' },
        'mersin otogarı': { lat: 36.7833, lng: 34.6167, name: 'Mersin Otogarı' },

        // Diyarbakır
        'diyarbakır': { lat: 37.9333, lng: 40.2167, name: 'Diyarbakır Otogarı' },
        'diyarbakır otogarı': { lat: 37.9333, lng: 40.2167, name: 'Diyarbakır Otogarı' },

        // Kayseri
        'kayseri': { lat: 38.7167, lng: 35.4833, name: 'Kayseri Otogarı' },
        'kayseri otogarı': { lat: 38.7167, lng: 35.4833, name: 'Kayseri Otogarı' },

        // Eskişehir
        'eskişehir': { lat: 39.7500, lng: 30.5000, name: 'Eskişehir Otogarı' },
        'eskişehir otogarı': { lat: 39.7500, lng: 30.5000, name: 'Eskişehir Otogarı' },

        // Trabzon
        'trabzon': { lat: 41.0000, lng: 39.7167, name: 'Trabzon Otogarı' },
        'trabzon otogarı': { lat: 41.0000, lng: 39.7167, name: 'Trabzon Otogarı' },

        // Samsun
        'samsun': { lat: 41.2867, lng: 36.3300, name: 'Samsun Otogarı' },
        'samsun otogarı': { lat: 41.2867, lng: 36.3300, name: 'Samsun Otogarı' },

        // Denizli
        'denizli': { lat: 37.7833, lng: 29.0833, name: 'Denizli Otogarı' },
        'denizli otogarı': { lat: 37.7833, lng: 29.0833, name: 'Denizli Otogarı' },

        // Malatya
        'malatya': { lat: 38.3500, lng: 38.3167, name: 'Malatya Otogarı' },
        'malatya otogarı': { lat: 38.3500, lng: 38.3167, name: 'Malatya Otogarı' },

        // Erzurum
        'erzurum': { lat: 39.9000, lng: 41.2667, name: 'Erzurum Otogarı' },
        'erzurum otogarı': { lat: 39.9000, lng: 41.2667, name: 'Erzurum Otogarı' },

        // Van
        'van': { lat: 38.4833, lng: 43.3833, name: 'Van Otogarı' },
        'van otogarı': { lat: 38.4833, lng: 43.3833, name: 'Van Otogarı' },

        // Şanlıurfa
        'şanlıurfa': { lat: 37.1500, lng: 38.7833, name: 'Şanlıurfa Otogarı' },
        'şanlıurfa otogarı': { lat: 37.1500, lng: 38.7833, name: 'Şanlıurfa Otogarı' },
        'urfa': { lat: 37.1500, lng: 38.7833, name: 'Şanlıurfa Otogarı' },

        // Kocaeli
        'kocaeli': { lat: 40.7667, lng: 29.9167, name: 'Kocaeli Otogarı' },
        'izmit': { lat: 40.7667, lng: 29.9167, name: 'İzmit Otogarı' },
        'izmit otogarı': { lat: 40.7667, lng: 29.9167, name: 'İzmit Otogarı' },

        // Sakarya
        'sakarya': { lat: 40.7333, lng: 30.4000, name: 'Sakarya Otogarı' },
        'adapazarı': { lat: 40.7333, lng: 30.4000, name: 'Adapazarı Otogarı' },

        // Manisa
        'manisa': { lat: 38.6167, lng: 27.4167, name: 'Manisa Otogarı' },
        'manisa otogarı': { lat: 38.6167, lng: 27.4167, name: 'Manisa Otogarı' },

        // Aydın
        'aydın': { lat: 37.8500, lng: 27.8333, name: 'Aydın Otogarı' },
        'aydın otogarı': { lat: 37.8500, lng: 27.8333, name: 'Aydın Otogarı' },

        // Muğla
        'muğla': { lat: 37.2167, lng: 28.3667, name: 'Muğla Otogarı' },
        'bodrum': { lat: 37.0333, lng: 27.4333, name: 'Bodrum Otogarı' },
        'marmaris': { lat: 36.8500, lng: 28.2667, name: 'Marmaris Otogarı' },
        'fethiye': { lat: 36.6500, lng: 29.1167, name: 'Fethiye Otogarı' },

        // Balıkesir
        'balıkesir': { lat: 39.6500, lng: 27.8833, name: 'Balıkesir Otogarı' },
        'balıkesir otogarı': { lat: 39.6500, lng: 27.8833, name: 'Balıkesir Otogarı' },

        // Çanakkale
        'çanakkale': { lat: 40.1500, lng: 26.4000, name: 'Çanakkale Otogarı' },
        'çanakkale otogarı': { lat: 40.1500, lng: 26.4000, name: 'Çanakkale Otogarı' },

        // Tekirdağ
        'tekirdağ': { lat: 40.9833, lng: 27.5000, name: 'Tekirdağ Otogarı' },

        // Edirne
        'edirne': { lat: 41.6667, lng: 26.5500, name: 'Edirne Otogarı' },
        'edirne otogarı': { lat: 41.6667, lng: 26.5500, name: 'Edirne Otogarı' },

        // Hatay
        'hatay': { lat: 36.2000, lng: 36.1500, name: 'Hatay Otogarı' },
        'antakya': { lat: 36.2000, lng: 36.1500, name: 'Antakya Otogarı' },
        'iskenderun': { lat: 36.5833, lng: 36.1667, name: 'İskenderun Otogarı' },

        // Kahramanmaraş
        'kahramanmaraş': { lat: 37.5833, lng: 36.9333, name: 'Kahramanmaraş Otogarı' },
        'maraş': { lat: 37.5833, lng: 36.9333, name: 'Kahramanmaraş Otogarı' },

        // Afyon
        'afyon': { lat: 38.7333, lng: 30.5500, name: 'Afyon Otogarı' },
        'afyonkarahisar': { lat: 38.7333, lng: 30.5500, name: 'Afyonkarahisar Otogarı' },

        // Sivas
        'sivas': { lat: 39.7500, lng: 37.0167, name: 'Sivas Otogarı' },
        'sivas otogarı': { lat: 39.7500, lng: 37.0167, name: 'Sivas Otogarı' },

        // Ordu
        'ordu': { lat: 40.9833, lng: 37.8833, name: 'Ordu Otogarı' },

        // Giresun
        'giresun': { lat: 40.9167, lng: 38.3833, name: 'Giresun Otogarı' },

        // Rize
        'rize': { lat: 41.0167, lng: 40.5167, name: 'Rize Otogarı' },

        // Artvin
        'artvin': { lat: 41.1833, lng: 41.8167, name: 'Artvin Otogarı' },

        // Zonguldak
        'zonguldak': { lat: 41.4500, lng: 31.7833, name: 'Zonguldak Otogarı' },

        // Kastamonu
        'kastamonu': { lat: 41.3833, lng: 33.7833, name: 'Kastamonu Otogarı' },

        // Çorum
        'çorum': { lat: 40.5500, lng: 34.9500, name: 'Çorum Otogarı' },

        // Tokat
        'tokat': { lat: 40.3167, lng: 36.5500, name: 'Tokat Otogarı' },

        // Amasya
        'amasya': { lat: 40.6500, lng: 35.8333, name: 'Amasya Otogarı' },

        // Yozgat
        'yozgat': { lat: 39.8167, lng: 34.8000, name: 'Yozgat Otogarı' },

        // Nevşehir
        'nevşehir': { lat: 38.6250, lng: 34.7139, name: 'Nevşehir Otogarı' },
        'göreme': { lat: 38.6431, lng: 34.8289, name: 'Göreme' },

        // Aksaray
        'aksaray': { lat: 38.3667, lng: 34.0333, name: 'Aksaray Otogarı' },

        // Niğde
        'niğde': { lat: 37.9667, lng: 34.6833, name: 'Niğde Otogarı' },

        // Karaman
        'karaman': { lat: 37.1833, lng: 33.2167, name: 'Karaman Otogarı' },

        // Isparta
        'ısparta': { lat: 37.7667, lng: 30.5500, name: 'Isparta Otogarı' },
        'isparta': { lat: 37.7667, lng: 30.5500, name: 'Isparta Otogarı' },

        // Burdur
        'burdur': { lat: 37.7167, lng: 30.2833, name: 'Burdur Otogarı' },

        // Uşak
        'uşak': { lat: 38.6833, lng: 29.4000, name: 'Uşak Otogarı' },

        // Kütahya
        'kütahya': { lat: 39.4167, lng: 29.9833, name: 'Kütahya Otogarı' },

        // Bilecik
        'bilecik': { lat: 40.1500, lng: 29.9833, name: 'Bilecik Otogarı' },

        // Bolu
        'bolu': { lat: 40.7333, lng: 31.6000, name: 'Bolu Otogarı' },

        // Düzce
        'düzce': { lat: 40.8333, lng: 31.1667, name: 'Düzce Otogarı' },

        // Batman
        'batman': { lat: 37.8833, lng: 41.1333, name: 'Batman Otogarı' },

        // Mardin
        'mardin': { lat: 37.3167, lng: 40.7333, name: 'Mardin Otogarı' },

        // Siirt
        'siirt': { lat: 37.9333, lng: 41.9500, name: 'Siirt Otogarı' },

        // Şırnak
        'şırnak': { lat: 37.5167, lng: 42.4667, name: 'Şırnak Otogarı' },

        // Hakkari
        'hakkari': { lat: 37.5833, lng: 43.7333, name: 'Hakkari Otogarı' },

        // Muş
        'muş': { lat: 38.7333, lng: 41.5000, name: 'Muş Otogarı' },

        // Bitlis
        'bitlis': { lat: 38.4000, lng: 42.1167, name: 'Bitlis Otogarı' },

        // Bingöl
        'bingöl': { lat: 38.8833, lng: 40.5000, name: 'Bingöl Otogarı' },

        // Elazığ
        'elazığ': { lat: 38.6667, lng: 39.2167, name: 'Elazığ Otogarı' },

        // Tunceli
        'tunceli': { lat: 39.1167, lng: 39.5500, name: 'Tunceli Otogarı' },

        // Ağrı
        'ağrı': { lat: 39.7167, lng: 43.0500, name: 'Ağrı Otogarı' },

        // Iğdır
        'ığdır': { lat: 39.9167, lng: 44.0500, name: 'Iğdır Otogarı' },

        // Kars
        'kars': { lat: 40.6000, lng: 43.1000, name: 'Kars Otogarı' },

        // Ardahan
        'ardahan': { lat: 41.1167, lng: 42.7000, name: 'Ardahan Otogarı' },

        // Bayburt
        'bayburt': { lat: 40.2500, lng: 40.2333, name: 'Bayburt Otogarı' },

        // Gümüşhane
        'gümüşhane': { lat: 40.4667, lng: 39.4833, name: 'Gümüşhane Otogarı' },

        // Erzincan
        'erzincan': { lat: 39.7500, lng: 39.5000, name: 'Erzincan Otogarı' },

        // Kırıkkale
        'kırıkkale': { lat: 39.8500, lng: 33.5167, name: 'Kırıkkale Otogarı' },

        // Kırşehir
        'kırşehir': { lat: 39.1500, lng: 34.1667, name: 'Kırşehir Otogarı' },

        // Çankırı
        'çankırı': { lat: 40.6000, lng: 33.6167, name: 'Çankırı Otogarı' },

        // Bartın
        'bartın': { lat: 41.6333, lng: 32.3333, name: 'Bartın Otogarı' },

        // Karabük
        'karabük': { lat: 41.2000, lng: 32.6167, name: 'Karabük Otogarı' },

        // Sinop
        'sinop': { lat: 42.0167, lng: 35.1500, name: 'Sinop Otogarı' },

        // Kırklareli
        'kırklareli': { lat: 41.7333, lng: 27.2167, name: 'Kırklareli Otogarı' },

        // Adıyaman
        'adıyaman': { lat: 37.7500, lng: 38.2833, name: 'Adıyaman Otogarı' },

        // Osmaniye
        'osmaniye': { lat: 37.0667, lng: 36.2500, name: 'Osmaniye Otogarı' },

        // Kilis
        'kilis': { lat: 36.7167, lng: 37.1167, name: 'Kilis Otogarı' }
    },

    init() {
        this.drawer = Utils.$('#mapDrawer');
        this.overlay = Utils.$('#mapDrawerOverlay');
        this.closeBtn = Utils.$('#mapDrawerClose');

        if (!this.drawer) return;

        this.bindEvents();
    },

    bindEvents() {
        // Map button clicks
        Utils.on(document, 'click', (e) => {
            const mapBtn = e.target.closest('.map-btn');
            if (mapBtn) {
                const origin = mapBtn.dataset.origin;
                const destination = mapBtn.dataset.destination;
                const originTime = mapBtn.dataset.originTime;
                const destTime = mapBtn.dataset.destTime;
                this.openDrawer(origin, destination, originTime, destTime);
            }
        });

        // Close drawer
        if (this.closeBtn) {
            Utils.on(this.closeBtn, 'click', () => this.closeDrawer());
        }

        if (this.overlay) {
            Utils.on(this.overlay, 'click', () => this.closeDrawer());
        }

        // Escape key
        Utils.on(document, 'keydown', (e) => {
            if (e.key === 'Escape' && this.drawer.classList.contains('active')) {
                this.closeDrawer();
            }
        });
    },

    openDrawer(origin, destination, originTime, destTime) {
        // Update info
        Utils.$('#mapOriginName').textContent = origin || '-';
        Utils.$('#mapDestName').textContent = destination || '-';
        Utils.$('#mapOriginTime').textContent = originTime || '-';
        Utils.$('#mapDestTime').textContent = destTime || '-';

        // Get coordinates
        const originCoords = this.getCoordinates(origin);
        const destCoords = this.getCoordinates(destination);

        // Update Google Maps link
        const gmapsLink = Utils.$('#googleMapsLink');
        if (originCoords && destCoords) {
            gmapsLink.href = `https://www.google.com/maps/dir/$${originCoords.lat},${originCoords.lng}/${destCoords.lat},${destCoords.lng}`;
        } else if (originCoords) {
            gmapsLink.href = `https://www.google.com/maps/search/?api=1&query=$${originCoords.lat},${originCoords.lng}`;
        } else {
            gmapsLink.href = `https://www.google.com/maps/search/?api=1&query=$${encodeURIComponent(origin + ' Otogarı')}`;
        }

        // Show drawer
        this.drawer.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Initialize map after drawer animation
        setTimeout(() => {
            this.initMap(originCoords, destCoords, origin, destination);
        }, 350);
    },

    closeDrawer() {
        this.drawer.classList.remove('active');
        document.body.style.overflow = '';

        // Clean up map
        if (this.map) {
            this.map.remove();
            this.map = null;
        }
    },

    getCoordinates(locationName) {
        if (!locationName) return null;

        const normalized = locationName.toLowerCase().trim();

        // Direct match
        if (this.busStations[normalized]) {
            return this.busStations[normalized];
        }

        // Partial match
        for (const [key, coords] of Object.entries(this.busStations)) {
            if (normalized.includes(key) || key.includes(normalized)) {
                return coords;
            }
        }

        // Try city name extraction
        const cityMatch = normalized.match(/^(\w+)/);
        if (cityMatch && this.busStations[cityMatch[1]]) {
            return this.busStations[cityMatch[1]];
        }

        return null;
    },

    initMap(originCoords, destCoords, originName, destName) {
        const mapContainer = Utils.$('#mapContainer');
        const mapLoading = Utils.$('#mapLoading');

        if (!mapContainer || typeof L === 'undefined') {
            console.error('Map container or Leaflet not found');
            return;
        }

        // Show loading
        if (mapLoading) mapLoading.classList.remove('hidden');

        // Clear existing map
        if (this.map) {
            this.map.remove();
        }

        // Default center (Turkey)
        let center = [39.0, 35.0];
        let zoom = 6;

        if (originCoords && destCoords) {
            center = [
                (originCoords.lat + destCoords.lat) / 2,
                (originCoords.lng + destCoords.lng) / 2
            ];
            zoom = this.calculateZoom(originCoords, destCoords);
        } else if (originCoords) {
            center = [originCoords.lat, originCoords.lng];
            zoom = 13;
        } else if (destCoords) {
            center = [destCoords.lat, destCoords.lng];
            zoom = 13;
        }

        // Create map
        this.map = L.map(mapContainer).setView(center, zoom);

        // Add tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(this.map);

        // Custom icons
        const originIcon = L.divIcon({
            className: 'custom-marker origin-marker',
            html: '<div class="marker-pin origin"><i class="fa-solid fa-circle-dot"></i></div>',
            iconSize: [30, 30],
            iconAnchor: [15, 30]
        });

        const destIcon = L.divIcon({
            className: 'custom-marker dest-marker',
            html: '<div class="marker-pin destination"><i class="fa-solid fa-flag-checkered"></i></div>',
            iconSize: [30, 30],
            iconAnchor: [15, 30]
        });

        // Add markers
        const bounds = [];

        if (originCoords) {
            const originMarker = L.marker([originCoords.lat, originCoords.lng], { icon: originIcon })
                .addTo(this.map)
                .bindPopup(`
                    <div class="map-popup">
                        <div class="map-popup__title">${originName}</div>
                        <div class="map-popup__type">
                            <i class="fa-solid fa-bus"></i> Kalkış Noktası
                        </div>
                    </div>
                `);
            bounds.push([originCoords.lat, originCoords.lng]);
        }

        if (destCoords) {
            const destMarker = L.marker([destCoords.lat, destCoords.lng], { icon: destIcon })
                .addTo(this.map)
                .bindPopup(`
                    <div class="map-popup">
                        <div class="map-popup__title">${destName}</div>
                        <div class="map-popup__type">
                            <i class="fa-solid fa-flag-checkered"></i> Varış Noktası
                        </div>
                    </div>
                `);
            bounds.push([destCoords.lat, destCoords.lng]);
        }

        // Draw route line if both points exist
        if (originCoords && destCoords) {
            const routeLine = L.polyline([
                [originCoords.lat, originCoords.lng],
                [destCoords.lat, destCoords.lng]
            ], {
                color: '#2F4EB4',
                weight: 3,
                opacity: 0.7,
                dashArray: '10, 10'
            }).addTo(this.map);

            // Fit bounds
            if (bounds.length > 1) {
                this.map.fitBounds(bounds, { padding: [50, 50] });
            }
        }

        // Hide loading
        setTimeout(() => {
            if (mapLoading) mapLoading.classList.add('hidden');
        }, 500);
    },

    calculateZoom(origin, dest) {
        const distance = this.getDistance(origin.lat, origin.lng, dest.lat, dest.lng);

        if (distance < 50) return 10;
        if (distance < 100) return 9;
        if (distance < 200) return 8;
        if (distance < 400) return 7;
        if (distance < 800) return 6;
        return 5;
    },

    getDistance(lat1, lng1, lat2, lng2) {
        const R = 6371; // Earth's radius in km
        const dLat = this.deg2rad(lat2 - lat1);
        const dLng = this.deg2rad(lng2 - lng1);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    },

    deg2rad(deg) {
        return deg * (Math.PI / 180);
    }
};