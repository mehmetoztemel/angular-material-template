# Material Workspace

Angular Material tabanlı yönetim paneli şablonu. Daraltılabilir navigasyon, seçilebilir renk paletleri, açık/koyu tema ve mobil uyumlu form bileşenleri içerir.

## Gereksinimler

- Angular / Material 22
- Node.js 24 LTS (en az 24.15) önerilir. Desteklenen alternatifler: Node 22.22.3+ veya 26+.
- npm

## Çalıştırma

```sh
npm ci
npm start
```

Uygulama: http://localhost:4200

```sh
npm run build
npm test -- --watch=false --browsers=ChromeHeadless
```

Üretim çıktısı: `dist/angular-material-template/browser`.

## Arayüz

- Açık/koyu tema tercihi tarayıcıda saklanır; dialog ve seçim panellerine de uygulanır.
- Masaüstünde daraltılabilir, mobilde açılır navigasyon.
- Mobil kişi kartları, açılır filtre/sıralama alanı, boş sonuç görünümü.
- Klavye ile kullanılabilen menü, şifre gösterme ve dialog kapatma kontrolleri.
- Kişi ekleme, düzenleme ve onaylı silme için oturum içi örnek akış.

## Demo sınırları

Ürünler (`/products`), Siparişler (`/orders`) ve İşlem kayıtları (`/activity`) sayfaları sırasıyla 36, 60 ve 80 yapay kayıt içerir. Filtreleme, sıralama, sayfalama ve detay dialogları ortak bileşenlerle çalışır. Özet kartları filtrelenmiş sonuçları değil tüm veri setini gösterir. Bu sayfalar gerçek bir servise bağlı değildir ve kayıtları salt okunurdur.

Giriş ve kayıt ekranları gerçek bir kimlik servisine bağlı değildir. Giriş için herhangi bir dolu kullanıcı adı ve şifre kullanılabilir. Kayıt formu kullanıcı oluşturmaz; giriş ekranına döner. Kişi değişiklikleri bellekte tutulur ve sayfa yenilendiğinde veya kişi sayfasına yeniden girildiğinde sıfırlanır.

Gerçek kullanım için auth guard, interceptor ve kişi işlemlerini kendi API'nize bağlayın.

## Yükseltme

Angular 19 → 20 → 21 → 22 sırasıyla resmi CLI, Core, CDK ve Material migration'ları uygulanmıştır. Zone.js tabanlı mevcut NgModule yapısı korunmuştur. Kontrol akışı şablonları `@if`, `@for` ve `@switch` biçimine taşınmıştır.

Yerel doğrulama için `.tooling/` altında Node 24 kurulabilir; bu dizin ve `.npm-cache/` Git'e dahil değildir. Makinedeki Node sürümü değiştirilmemiştir.

## Ortak bileşenler ve altyapı

Şablon aşağıdaki bileşenleri ve yapılandırmaları içerir:

- `shared/components/mo-table/`: tipli kolonlar, istemci/sunucu modu, filtre taslakları, arama, sıralama, mobil işlem menüsü ve testler.
- `styles.scss`, `theme.scss`, `form-styles.scss`: açık/koyu renkler, renk paletleri ve ortak form düzeni.
- `shared/services/theme.service.ts`: tarayıcıda saklanan tema ve renk paleti tercihleri, sistem teması desteği.
- `mo-dialog`, görsel yükleme/önizleme bileşenleri.
- API kapsamlı auth interceptor, mesaj ve loader altyapısı; Türkçe sayfalama ve pazartesi başlangıçlı takvim.
- Environment dosyaları, modern `@angular/build` altyapısı ve build bütçeleri (initial 2/5 MB, component style 6/10 kB).

`SharedUiModule` ortak bileşenleri dışarı açar. Tüm sayfalarda doğrudan `MoTableComponent<T>`, `IColumns<T>` ve `MoDialogComponent` kullanılır; tablo etiketi `mo-table` olmalıdır.

Hesabım → Profilim (`/account`) sayfasından ad, soyad, birim, unvan ve iletişim bilgileri düzenlenebilir. Profil mevcut sekmenin oturumunda saklanır; çıkışta veya yeni girişte temizlenir. Canlı profil API'si bağlı değildir.
