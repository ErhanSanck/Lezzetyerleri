// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyDHeie0D4Rr5PfP_HtTt-SE9W_QCE_fKo0",
  authDomain: "yemek-63572.firebaseapp.com",
  databaseURL: "https://yemek-63572-default-rtdb.firebaseio.com",
  projectId: "yemek-63572",
  storageBucket: "yemek-63572.firebasestorage.app",
  messagingSenderId: "674967323369",
  appId: "1:674967323369:web:81be0f511873434a55a678",
  measurementId: "G-WYT9KCWG4E"
};

// Sabit değişkenler
const FIREBASE_URL = firebaseConfig.databaseURL;

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getDatabase, ref, set, get, update, remove } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Yardımcı Fonksiyonlar (Nesne dışına çıkarıldı)
function slugify(text) {
  const trMap = { ç: 'c', ğ: 'g', ı: 'i', ö: 'o', ş: 's', ü: 'u', Ç: 'c', Ğ: 'g', İ: 'i', Ö: 'o', Ş: 's', Ü: 'u' };
  return text.split('').map(ch => trMap[ch] || ch).join('').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

// 81 İl Sabit Listesi - Koordinatlarla birlikte
const TURKEY_CITIES = [
  { name: "Adana", emoji: "🍊", lat: 36.99, lng: 35.32 },
  { name: "Adıyaman", emoji: "⛰️", lat: 37.76, lng: 38.27 },
  { name: "Afyonkarahisar", emoji: "🧆", lat: 38.75, lng: 30.54 },
  { name: "Ağrı", emoji: "🏔️", lat: 39.71, lng: 43.05 },
  { name: "Amasya", emoji: "🍏", lat: 40.65, lng: 35.83 },
  { name: "Ankara", emoji: "🏛️", lat: 39.93, lng: 32.86 },
  { name: "Antalya", emoji: "☀️", lat: 36.90, lng: 30.71 },
  { name: "Artvin", emoji: "🌲", lat: 41.18, lng: 41.82 },
  { name: "Aydın", emoji: "🍇", lat: 37.84, lng: 27.84 },
  { name: "Balıkesir", emoji: "🧀", lat: 39.64, lng: 27.88 },
  { name: "Bilecik", emoji: "🏺", lat: 40.13, lng: 29.98 },
  { name: "Bingöl", emoji: "🍯", lat: 39.13, lng: 40.50 },
  { name: "Bitlis", emoji: "🏰", lat: 38.39, lng: 42.10 },
  { name: "Bolu", emoji: "🌲", lat: 40.73, lng: 31.61 },
  { name: "Burdur", emoji: "🏺", lat: 37.73, lng: 29.73 },
  { name: "Bursa", emoji: "🍑", lat: 40.18, lng: 29.07 },
  { name: "Çanakkale", emoji: "🗿", lat: 40.14, lng: 26.41 },
  { name: "Çankırı", emoji: "🧂", lat: 40.59, lng: 33.63 },
  { name: "Çorum", emoji: "🥜", lat: 40.56, lng: 34.95 },
  { name: "Denizli", emoji: "🐓", lat: 37.77, lng: 29.21 },
  { name: "Diyarbakır", emoji: "🍉", lat: 37.91, lng: 40.23 },
  { name: "Edirne", emoji: "🕌", lat: 41.68, lng: 26.56 },
  { name: "Elazığ", emoji: "🍇", lat: 38.68, lng: 39.22 },
  { name: "Erzincan", emoji: "🧀", lat: 39.75, lng: 39.50 },
  { name: "Erzurum", emoji: "❄️", lat: 39.90, lng: 41.27 },
  { name: "Eskişehir", emoji: "🎓", lat: 39.77, lng: 30.52 },
  { name: "Gaziantep", emoji: "🥘", lat: 37.07, lng: 37.38 },
  { name: "Giresun", emoji: "🌰", lat: 40.91, lng: 38.64 },
  { name: "Gümüşhane", emoji: "⛰️", lat: 40.46, lng: 39.46 },
  { name: "Hakkari", emoji: "🏔️", lat: 37.57, lng: 43.74 },
  { name: "Hatay", emoji: "🥘", lat: 36.40, lng: 36.16 },
  { name: "Isparta", emoji: "🌹", lat: 37.77, lng: 30.55 },
  { name: "Mersin", emoji: "🌴", lat: 36.78, lng: 34.63 },
  { name: "İstanbul", emoji: "🕌", lat: 41.01, lng: 28.98 },
  { name: "İzmir", emoji: "🌴", lat: 38.41, lng: 27.13 },
  { name: "Kars", emoji: "🧀", lat: 40.60, lng: 43.10 },
  { name: "Kastamonu", emoji: "🧄", lat: 41.39, lng: 33.77 },
  { name: "Kayseri", emoji: "🥟", lat: 38.73, lng: 35.48 },
  { name: "Kırklareli", emoji: "🍇", lat: 41.73, lng: 27.22 },
  { name: "Kırşehir", emoji: "🎻", lat: 39.14, lng: 34.16 },
  { name: "Kocaeli", emoji: "🏭", lat: 40.76, lng: 29.95 },
  { name: "Konya", emoji: "🕌", lat: 37.87, lng: 32.48 },
  { name: "Kütahya", emoji: "🏺", lat: 39.42, lng: 29.98 },
  { name: "Malatya", emoji: "🍑", lat: 38.35, lng: 38.31 },
  { name: "Manisa", emoji: "🍇", lat: 38.61, lng: 27.43 },
  { name: "Kahramanmaraş", emoji: "🍦", lat: 37.58, lng: 36.93 },
  { name: "Mardin", emoji: "🕌", lat: 37.31, lng: 40.74 },
  { name: "Muğla", emoji: "🏖️", lat: 37.21, lng: 28.36 },
  { name: "Muş", emoji: "🌷", lat: 38.74, lng: 41.50 },
  { name: "Nevşehir", emoji: "🎈", lat: 38.62, lng: 34.72 },
  { name: "Niğde", emoji: "🍎", lat: 37.96, lng: 34.67 },
  { name: "Ordu", emoji: "🌰", lat: 41.00, lng: 37.27 },
  { name: "Rize", emoji: "☕", lat: 41.20, lng: 40.50 },
  { name: "Sakarya", emoji: "🎃", lat: 40.76, lng: 30.39 },
  { name: "Samsun", emoji: "🗽", lat: 41.28, lng: 36.33 },
  { name: "Siirt", emoji: "🥜", lat: 37.96, lng: 41.94 },
  { name: "Sinop", emoji: "⚓", lat: 42.02, lng: 35.15 },
  { name: "Sivas", emoji: "🏰", lat: 39.75, lng: 36.49 },
  { name: "Tekirdağ", emoji: "🥩", lat: 40.98, lng: 27.51 },
  { name: "Tokat", emoji: "🍇", lat: 40.31, lng: 36.55 },
  { name: "Trabzon", emoji: "🐟", lat: 41.00, lng: 39.76 },
  { name: "Tunceli", emoji: "⛰️", lat: 39.10, lng: 39.48 },
  { name: "Şanlıurfa", emoji: "🌶️", lat: 37.15, lng: 38.79 },
  { name: "Uşak", emoji: "🧵", lat: 38.68, lng: 29.40 },
  { name: "Van", emoji: "🐈", lat: 38.48, lng: 43.38 },
  { name: "Yozgat", emoji: "🌾", lat: 39.82, lng: 35.81 },
  { name: "Zonguldak", emoji: "⛏️", lat: 41.45, lng: 31.79 },
  { name: "Aksaray", emoji: "🏛️", lat: 38.36, lng: 34.03 },
  { name: "Bayburt", emoji: "🏰", lat: 40.29, lng: 40.30 },
  { name: "Karaman", emoji: "🐑", lat: 37.18, lng: 33.23 },
  { name: "Kırıkkale", emoji: "🔧", lat: 39.84, lng: 33.51 },
  { name: "Batman", emoji: "🛢️", lat: 37.88, lng: 41.54 },
  { name: "Şırnak", emoji: "⛰️", lat: 37.52, lng: 42.48 },
  { name: "Bartın", emoji: "🌲", lat: 41.63, lng: 32.34 },
  { name: "Ardahan", emoji: "❄️", lat: 41.11, lng: 42.70 },
  { name: "Iğdır", emoji: "🍏", lat: 39.92, lng: 44.05 },
  { name: "Yalova", emoji: "🌸", lat: 40.65, lng: 29.27 },
  { name: "Karabük", emoji: "🏗️", lat: 41.20, lng: 32.62 },
  { name: "Kilis", emoji: "🍇", lat: 36.71, lng: 37.11 },
  { name: "Osmaniye", emoji: "🥜", lat: 37.07, lng: 36.25 },
  { name: "Düzce", emoji: "🌲", lat: 40.84, lng: 31.16 }
].map(c => ({ ...c, slug: slugify(c.name) }));

// Harita koordinatları
const CITY_COORDINATES = TURKEY_CITIES.reduce((acc, city) => {
  acc[city.slug] = { lat: city.lat, lng: city.lng };
  return acc;
}, {});

// Mesafe hesaplama (Haversine formülü)
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Dünya'nın yarıçapı (km)
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// En yakın şehri bulma
function findNearestCity(lat, lng) {
  let nearest = null;
  let minDistance = Infinity;

  for (const [slug, coords] of Object.entries(CITY_COORDINATES)) {
    const distance = calculateDistance(lat, lng, coords.lat, coords.lng);
    if (distance < minDistance) {
      minDistance = distance;
      nearest = slug;
    }
  }

  return nearest;
}

/* ----------------------- RestoranDB ----------------------- */
const RestoranDB = {
  // Kullanıcının konumundan en yakın şehri bulma
    async getDefaultCity() {
    return new Promise((resolve) => {
      // 1. LocalStorage kontrolü
      const savedCity = localStorage.getItem('selectedCity');
      if (savedCity) {
        resolve(savedCity);
        return;
      }

      // 2. Geolocation Desteği Kontrolü
      if (!navigator.geolocation) {
        console.warn('Geolocation desteklenmiyor, varsayılan: istanbul');
        localStorage.setItem('selectedCity', 'istanbul');
        resolve('istanbul');
        return;
      }

      // 3. Konum İsteği
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          const nearestCity = findNearestCity(lat, lng);
          
          console.log(`Konum başarıyla alındı: ${nearestCity}`);
          localStorage.setItem('selectedCity', nearestCity);
          resolve(nearestCity);
        },
        (error) => {
          // Hata durumunda (kullanıcı reddetti, konum kapalı vb.)
          console.error('Konum alınamadı (Hata Kodu: ' + error.code + '), varsayılan: istanbul');
          localStorage.setItem('selectedCity', 'istanbul');
          resolve('istanbul');
        },
        {
          enableHighAccuracy: false, // Daha hızlı yanıt için false yapıldı
          timeout: 7000,             // Süre 7 saniyeye çıkarıldı
          maximumAge: 0              // Her zaman güncel konumu dene
        }
      );
    });
  },

        (error) => {
          console.log('Konum alınamadı:', error.message, '- Varsayılan: istanbul');
          localStorage.setItem('selectedCity', 'istanbul');
          resolve('istanbul');
        },
        {
          timeout: 5000,
          maximumAge: 300000 // 5 dakika önce alınan konum kullanılabilir
        }
      );
    });
  },

  // getCities metodu
    // Güncellenmiş getCities metodu
  async getCities() {
    const response = await fetch(`${FIREBASE_URL}/cities.json`);
    const data = await response.json();
    
    // Veri yoksa veya hatalıysa baştan oluştur
    if (!data) {
      const cityData = {};
      // Şehirleri bir obje içinde topla
      TURKEY_CITIES.forEach(city => {
        cityData[city.slug] = { 
          name: city.name, 
          emoji: city.emoji, 
          slug: city.slug, 
          restaurantCount: 0 
        };
      });

      // Tüm listeyi tek seferde veritabanına yaz (POST yerine PUT)
      await fetch(`${FIREBASE_URL}/cities.json`, {
        method: 'PUT',
        body: JSON.stringify(cityData)
      });
      
      return TURKEY_CITIES.sort((a,b) => a.name.localeCompare(b.name, 'tr'));
    }

    // Veri varsa dönüştür
    return Object.keys(data).map(key => ({
      id: key, 
      ...data[key],
      restaurantCount: data[key].restaurantCount || 0
    })).sort((a,b) => a.name.localeCompare(b.name, 'tr'));
  },


  async getCityBySlug(slug) {
    const cities = await this.getCities();
    return cities.find(c => c.slug === slug) || null;
  },

  async getCategories() {
    const response = await fetch(`${FIREBASE_URL}/categories.json`);
    const data = await response.json();
    if (!data) return [];
    
    return Object.keys(data).map(key => ({ id: key, ...data[key] }));
  },

  async getCategoryBySlug(slug) {
    const categories = await this.getCategories();
    return categories.find(c => c.slug === slug) || null;
  },

  async getRestaurants(params = {}) {
    const response = await fetch(`${FIREBASE_URL}/restaurants.json`);
    const data = await response.json();
    if (!data) return [];
    
    let list = Object.keys(data).map(key => ({ id: key, ...data[key] }));
    
    // Şehir filtresi
    if (params.citySlug) {
      list = list.filter(r => r.city?.slug === params.citySlug);
    }
    
    // Kategori filtresi
    if (params.categorySlug) {
      list = list.filter(r => r.category?.slug === params.categorySlug);
    }
    
    // Alt kategori filtresi
    if (params.subcategorySlug) {
      list = list.filter(r => r.subcategory?.slug === params.subcategorySlug);
    }
    
    // Arama filtresi
    if (params.query) {
      const q = params.query.toLowerCase();
      list = list.filter(r => 
        r.name?.toLowerCase().includes(q) ||
        r.address?.toLowerCase().includes(q) ||
        r.category?.name?.toLowerCase().includes(q) ||
        r.subcategory?.name?.toLowerCase().includes(q)
      );
    }
    
    return list;
  },

  async getRestaurantById(id) {
    const response = await fetch(`${FIREBASE_URL}/restaurants/${id}.json`);
    const data = await response.json();
    if (!data) return null;
    
    return { id, ...data };
  }
};

window.RestoranDB = RestoranDB;
// data.js dosyasının en altına ekleyin
const RestoranAuth = {
  // Basit bir şifre kontrolü (Admin panelini korumak için)
  login(user, pass) {
    // BURAYA GERÇEK BİR ŞİFRE VEYA FIREBASE AUTH EKLEMELİSİNİZ
    // Örnek basit kontrol:
    return new Promise((resolve) => {
      if (user === "admin" && pass === "123456") {
        localStorage.setItem('isAdminLoggedIn', 'true');
        resolve(true);
      } else {
        resolve(false);
      }
    });
  },

  logout() {
    localStorage.removeItem('isAdminLoggedIn');
  },

  isLoggedIn() {
    return localStorage.getItem('isAdminLoggedIn') === 'true';
  }
};

window.RestoranAuth = RestoranAuth; // Bunu mutlaka ekleyin ki admin.html görsün

