# 🚌 B2B Entegrasyon Projesi

![.NET Core](https://img.shields.io/badge/.NET%20Core-8.0-purple)
![MVC](https://img.shields.io/badge/Architecture-MVC-blue)
![Frontend](https://img.shields.io/badge/Frontend-ES6%20Modules%20%2B%20SCSS-green)
![Status](https://img.shields.io/badge/Status-Completed-success)

Bu proje, **.NET Core MVC** mimarisi kullanılarak geliştirilmiş, modern ve ölçeklenebilir bir otobüs bileti rezervasyon sistemi arayüzü ve B2B entegrasyonudur. Clean Code prensiplerine sadık kalınarak; modüler JavaScript yapısı (ES Modules) ve SCSS ile geliştirilmiştir.

## 🌟 Öne Çıkan Özellikler

* **Modern Arama Arayüzü:** Dinamik şehir seçimi ve akıllı tarih yönetimi (Geçmiş tarih engelleme).
* **Gelişmiş Filtreleme:** Sayfa yenilenmeden (Client-Side) fiyat, saat ve firma bazlı anlık filtreleme.
* **Harita Entegrasyonu (Leaflet.js):** Kalkış ve varış noktalarını dinamik olarak harita üzerinde gösterme.
* **Modüler Frontend:** `site.js` yerine parçalanmış ES6 Modülleri (`map-drawer.js`, `journey-filter.js` vb.).
* **Responsive Tasarım:** Mobil uyumlu, modern kart yapıları ve "Empty State" durumları.
* **Güvenlik:** Session ve Cookie yönetimi ile güvenli kullanıcı deneyimi.
* **Çoklu Dil & Tema:** Dark Mode desteği ve i18n altyapısı.

## 📸 Ekran Görüntüleri

### 1. Ana Sayfa & Arama
Kullanıcı dostu arama motoru ve dinamik lokasyon yönetimi.

### 2. Sefer Sonuçları & Filtreleme
Fiyat aralığı, kalkış saati ve firma filtreleri ile anlık sonuç güncelleme.

### 3. Harita Modalı
Sefer güzergahının harita üzerinde detaylı gösterimi.

### 4. Gizlilik ve Güvenlik
KVKK ve GDPR uyumlu bilgilendirme sayfaları.

## 🛠️ Kullanılan Teknolojiler

* **Backend:** ASP.NET Core MVC 8.0, C#
* **Frontend:** HTML5, SCSS (SASS), Vanilla JavaScript (ES6 Modules)
* **Libraries:** Leaflet.js (Harita), FontAwesome 6 (İkonlar), Bootstrap 5 (Grid)
* **Architecture:** B2B Integration Pattern, Session Management

## 🚀 Kurulum

Projeyi yerel ortamınızda çalıştırmak için:

1.  Repoyu klonlayın:
    ```bash
    git clone [https://github.com/KULLANICI_ADIN/PROJE_ADIN.git](https://github.com/KULLANICI_ADIN/PROJE_ADIN.git)
    ```
2.  Proje dizinine gidin:
    ```bash
    cd ObiletCase.Web
    ```
3.  Bağımlılıkları yükleyin ve projeyi ayağa kaldırın:
    ```bash
    dotnet restore
    dotnet watch run
    ```

## 📄 Lisans

Bu proje MIT lisansı ile lisanslanmıştır.
