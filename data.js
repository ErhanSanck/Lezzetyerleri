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

// 81 İl Sabit Listesi (Nesne dışına çıkarıldı)
const TURKEY_CITIES = [
  { name: "Adana", emoji: "🍊" }, { name: "Adıyaman", emoji: "⛰️" }, { name: "Afyonkarahisar", emoji: "🧆" },
  { name: "Ağrı", emoji: "🏔️" }, { name: "Amasya", emoji: "🍏" }, { name: "Ankara", emoji: "🏛️" },
  { name: "Antalya", emoji: "☀️" }, { name: "Artvin", emoji: "🌲" }, { name: "Aydın", emoji: "🍇" },
  { name: "Balıkesir", emoji: "🧀" }, { name: "Bilecik", emoji: "🏺" }, { name: "Bingöl", emoji: "🍯" },
  { name: "Bitlis", emoji: "🏰" }, { name: "Bolu", emoji: "🌲" }, { name: "Burdur", emoji: "🏺" },
  { name: "Bursa", emoji: "🍑" }, { name: "Çanakkale", emoji: "🗿" }, { name: "Çankırı", emoji: "🧂" },
  { name: "Çorum", emoji: "🥜" }, { name: "Denizli", emoji: "🐓" }, { name: "Diyarbakır", emoji: "🍉" },
  { name: "Edirne", emoji: "🕌" }, { name: "Elazığ", emoji: "🍇" }, { name: "Erzincan", emoji: "🧀" },
  { name: "Erzurum", emoji: "❄️" }, { name: "Eskişehir", emoji: "🎓" }, { name: "Gaziantep", emoji: "🥘" },
  { name: "Giresun", emoji: "🌰" }, { name: "Gümüşhane", emoji: "⛰️" }, { name: "Hakkari", emoji: "🏔️" },
  { name: "Hatay", emoji: "🥘" }, { name: "Isparta", emoji: "🌹" }, { name: "Mersin", emoji: "🌴" },
  { name: "İstanbul", emoji: "🕌" }, { name: "İzmir", emoji: "🌴" }, { name: "Kars", emoji: "🧀" },
  { name: "Kastamonu", emoji: "🧄" }, { name: "Kayseri", emoji: "🥟" }, { name: "Kırklareli", emoji: "🍇" },
  { name: "Kırşehir", emoji: "🎻" }, { name: "Kocaeli", emoji: "🏭" }, { name: "Konya", emoji: "🕌" },
  { name: "Kütahya", emoji: "🏺" }, { name: "Malatya", emoji: "🍑" }, { name: "Manisa", emoji: "🍇" },
  { name: "Kahramanmaraş", emoji: "🍦" }, { name: "Mardin", emoji: "🕌" }, { name: "Muğla", emoji: "🏖️" },
  { name: "Muş", emoji: "🌷" }, { name: "Nevşehir", emoji: "🎈" }, { name: "Niğde", emoji: "🍎" },
  { name: "Ordu", emoji: "🌰" }, { name: "Rize", emoji: "☕" }, { name: "Sakarya", emoji: "🎃" },
  { name: "Samsun", emoji: "🗽" }, { name: "Siirt", emoji: "🥜" }, { name: "Sinop", emoji: "⚓" },
  { name: "Sivas", emoji: "🏰" }, { name: "Tekirdağ", emoji: "🥩" }, { name: "Tokat", emoji: "🍇" },
  { name: "Trabzon", emoji: "🐟" }, { name: "Tunceli", emoji: "⛰️" }, { name: "Şanlıurfa", emoji: "🌶️" },
  { name: "Uşak", emoji: "🧵" }, { name: "Van", emoji: "🐈" }, { name: "Yozgat", emoji: "🌾" },
  { name: "Zonguldak", emoji: "⛏️" }, { name: "Aksaray", emoji: "🏛️" }, { name: "Bayburt", emoji: "🏰" },
  { name: "Karaman", emoji: "🐑" }, { name: "Kırıkkale", emoji: "🔧" }, { name: "Batman", emoji: "🛢️" },
  { name: "Şırnak", emoji: "⛰️" }, { name: "Bartın", emoji: "🌲" }, { name: "Ardahan", emoji: "❄️" },
  { name: "Iğdır", emoji: "🍏" }, { name: "Yalova", emoji: "🌸" }, { name: "Karabük", emoji: "🏗️" },
  { name: "Kilis", emoji: "🍇" }, { name: "Osmaniye", emoji: "🥜" }, { name: "Düzce", emoji: "🌲" }
].map(c => ({ ...c, slug: slugify(c.name) }));

/* ----------------------- RestoranDB ----------------------- */
const RestoranDB = {
  // getCities metodu artık TURKEY_CITIES'i tanır
  async getCities() {
    const response = await fetch(`${FIREBASE_URL}/cities.json`);
    const data = await response.json();
    
    if (!data || Object.keys(data).length === 0) {
      // Firebase'i temizlediyseniz burası çalışır ve 81 ili yazar
      for (const city of TURKEY_CITIES) {
        await fetch(`${FIREBASE_URL}/cities.json`, {
          method: 'POST',
          body: JSON.stringify({ name: city.name, emoji: city.emoji, slug: city.slug, restaurantCount: 0 })
        });
      }
      const retryResponse = await fetch(`${FIREBASE_URL}/cities.json`);
      const retryData = await retryResponse.json();
      return Object.keys(retryData).map(key => ({ id: key, ...retryData[key] })).sort((a,b) => a.name.localeCompare(b.name, 'tr'));
    }

    return Object.keys(data).map(key => ({
      id: key, ...data[key],
      restaurantCount: data[key].restaurantCount || 0
    })).sort((a,b) => a.name.localeCompare(b.name, 'tr'));
  },
  
  // ... Geri kalan fonksiyonlarınız aynı şekilde kalabilir ...
  
  async getCityBySlug(slug) {
    const cities = await this.getCities();
    return cities.find(c => c.slug === slug) || null;
  }
};

window.RestoranDB = RestoranDB;
