/* data.js
 * ---------------------------------------------------------
 * Bu dosya Firebase Realtime Database sunucusuna bağlanır.
 * Tüm veriler bulut üzerinde gerçek zamanlı saklanır.
 * ---------------------------------------------------------
 */

// Kendi Firebase Config bilgilerinizi buraya yapıştırın
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

// Firebase Modüllerini CDN üzerinden import ediyoruz
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getDatabase, ref, set, get, update, remove } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const EMOJI_BY_CATEGORY = {
  'koefteciler': '🍢',
  'donerciler': '🥙',
  'tatli-yerleri': '🍰'
};

const EMOJI_BY_SUBCATEGORY = {
  'waffle': '🧇',
  'sutlu-tatlilar': '🥛',
  'kekler': '🍰'
};

function slugify(text) {
  const trMap = { ç: 'c', ğ: 'g', ı: 'i', ö: 'o', ş: 's', ü: 'u', Ç: 'c', Ğ: 'g', İ: 'i', Ö: 'o', Ş: 's', Ü: 'u' };
  return text.split('').map(ch => trMap[ch] || ch).join('')
    .toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

/* ----------------------- Varsayılan Veri Kurulumu ----------------------- */
async function buildDefaultData() {
  const cities = {
    'city-istanbul': { id: 'city-istanbul', name: 'İstanbul', slug: 'istanbul', emoji: '🌆' },
    'city-ankara': { id: 'city-ankara', name: 'Ankara', slug: 'ankara', emoji: '🏛️' },
    'city-izmir': { id: 'city-izmir', name: 'İzmir', slug: 'izmir', emoji: '🌊' }
  };

  const categories = {
    'cat-kofteci': { id: 'cat-kofteci', name: 'Köfteciler', slug: 'koefteciler' },
    'cat-donerci': { id: 'cat-donerci', name: 'Dönerciler', slug: 'donerciler' },
    'cat-tatli': { id: 'cat-tatli', name: 'Tatlı Yerleri', slug: 'tatli-yerleri' }
  };

  const subcategories = {
    'sub-waffle': { id: 'sub-waffle', categoryId: 'cat-tatli', name: 'Waffle', slug: 'waffle' },
    'sub-sutlu': { id: 'sub-sutlu', categoryId: 'cat-tatli', name: 'Sütlü Tatlılar', slug: 'sutlu-tatlilar' },
    'sub-kek': { id: 'sub-kek', categoryId: 'cat-tatli', name: 'Kekler', slug: 'kekler' }
  };

  const r1_id = 'r1', r2_id = 'r2', r3_id = 'r3', r4_id = 'r4', r5_id = 'r5';
  const restaurants = {
    [r1_id]: {
      id: r1_id, name: 'Hacı Köfteci', categoryId: 'cat-kofteci', subcategoryId: null, cityId: 'city-istanbul',
      address: 'Atatürk Cad. No:12, Merkez', phone: '0212 111 22 33',
      description: 'Geleneksel ızgara köfte, 1985\'ten beri aynı tarif.', image: null,
      menuItems: {
        [uid()]: { name: 'Izgara Köfte (Porsiyon)', price: 180 },
        [uid()]: { name: 'Köfte Ekmek', price: 90 },
        [uid()]: { name: 'Piyaz', price: 60 }
      }
    },
    // Diğer varsayılan veriler...
  };

  const initialDB = { cities, categories, subcategories, restaurants };
  await set(ref(db, '/'), initialDB);
  return initialDB;
}

/* ----------------------- Veri Yükleme Yardımcısı ----------------------- */
async function loadFullRawDB() {
  const snapshot = await get(ref(db, '/'));
  if (snapshot.exists()) {
    const data = snapshot.val();
    return {
      cities: data.cities ? Object.values(data.cities) : [],
      categories: data.categories ? Object.values(data.categories) : [],
      subcategories: data.subcategories ? Object.values(data.subcategories) : [],
      restaurants: data.restaurants ? Object.values(data.restaurants).map(r => ({
        ...r,
        menuItems: r.menuItems ? Object.values(r.menuItems) : []
      })) : []
    };
  } else {
    const initial = await buildDefaultData();
    return {
      cities: Object.values(initial.cities),
      categories: Object.values(initial.categories),
      subcategories: Object.values(initial.subcategories),
      restaurants: Object.values(initial.restaurants).map(r => ({
        ...r,
        menuItems: Object.values(r.menuItems)
      }))
    };
  }
}

/* ----------------------- Public API ----------------------- */
const RestoranDB = {

 // 81 İl Sabit Listesi (data.js içine eklenecek)
const TURKEY_CITIES = [
  { name: "Adana", emoji: "🍊" }, { name: "Adıyaman", emoji: "⛰️" }, { name: "Afyonkarahisar", emoji: "🧆" },
  { name: "Ağrı", emoji: "🏔️" }, { name: "Amasya", emoji: "🍏" }, { name: "Ankara", emoji: "🏛️" },
  { name: "Antalya", emoji: "☀️" }, { name: "Artvin", emoji: "🌲" }, { name: "Aydın", emoji: "🍇" },
  { name: "Balıkesir", emoji: "🧀" }, { name: "Bilecik", emoji: "🏺" }, { name: "Bingöl", emoji: "🍯" },
  { name: "Bitlis", emoji: "🏰" }, { name: "Bolu", emoji: "🌲" }, { name: "Burdur", emoji: "🏺" },
  { name: "Bursa", emoji: "🍑" }, { name: "Çanakkale", emoji: "🗿" }, { name: "Çankırı", emoji: "🧂" },
  { name: "Çorum", emoji: "🥜" }, { name: "Denizli", emoji: "🐓" }, { name: "Diyarbakır", emoji: "🍉" },
  { name: "Edirne", emoji: "🕌" }, { name: "Elazığ", emoji: "🍇" }, { name: "Erzincan", emoji: "🧀" },
  { name: "Erzurum", emoji: "❄️" }, { name: "Eskişehir", emoji: "🎓" }, { name: "Gaziantep", emoji: "Baklava" }, // Uygun emojilerle güncellenebilir
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
].map(c => ({
  ...c,
  // Slug oluşturma fonksiyonu (Örn: "Kahramanmaraş" -> "kahramanmaras")
  slug: c.name.toLowerCase()
    .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's')
    .replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
    .replace(/[^a-z0-9]/g, '-')
}));

// RestoranDB nesnesi içindeki getCities metodunu bununla revize edin:
async getCities() {
  // 1. Firebase'den mevcut şehirleri çekmeyi deneyin
  const response = await fetch(`${FIREBASE_URL}/cities.json`);
  const data = await response.json();
  
  // Eğer veritabanında şehirler listesi henüz hiç yoksa (ilk kurulum):
  if (!data || Object.keys(data).length === 0) {
    console.log("Şehir listesi boş, 81 il otomatik yükleniyor...");
    
    // Tüm şehirleri sırayla Firebase'e yazıyoruz
    for (const city of TURKEY_CITIES) {
      await fetch(`${FIREBASE_URL}/cities.json`, {
        method: 'POST',
        body: JSON.stringify({
          name: city.name,
          emoji: city.emoji,
          slug: city.slug,
          restaurantCount: 0
        })
      });
    }
    // Yükleme bittikten sonra tekrar çekiyoruz
    const retryResponse = await fetch(`${FIREBASE_URL}/cities.json`);
    const retryData = await retryResponse.json();
    return Object.keys(retryData).map(key => ({ id: key, ...retryData[key] })).sort((a,b) => a.name.localeCompare(b.name, 'tr'));
  }

  // Firebase'de şehirler varsa, objeyi diziye çevirip alfabetik sıralayarak döndürün
  return Object.keys(data).map(key => ({
    id: key,
    ...data[key],
    // Dinamik restoran sayısı hesabı varsa ekleyin, yoksa direkt veritabanındaki değeri döner:
    restaurantCount: data[key].restaurantCount || 0 
  })).sort((a,b) => a.name.localeCompare(b.name, 'tr'));
},

  async getCityBySlug(slug) {
    const cities = await this.getCities();
    return cities.find(c => c.slug === slug) || null;
  },

  async addCity(name) {
    const id = 'city-' + uid();
    const city = { id, name, slug: slugify(name), emoji: '📍' };
    await set(ref(db, `cities/${id}`), city);
    return city;
  },

  async deleteCity(id) {
    const rawData = await loadFullRawDB();
    await remove(ref(db, `cities/${id}`));
    
    for (const r of rawData.restaurants.filter(r => r.cityId === id)) {
      await remove(ref(db, `restaurants/${r.id}`));
    }
  },

  async getCategories() {
    const rawData = await loadFullRawDB();
    return rawData.categories.map(cat => ({
      ...cat,
      emoji: EMOJI_BY_CATEGORY[cat.slug] || '🍽️',
      restaurantCount: rawData.restaurants.filter(r => r.categoryId === cat.id).length,
      subcategories: rawData.subcategories
        .filter(s => s.categoryId === cat.id)
        .map(s => ({ ...s, emoji: EMOJI_BY_SUBCATEGORY[s.slug] || '🍽️' }))
    }));
  },

  async getCategoryBySlug(slug) {
    const cats = await this.getCategories();
    return cats.find(c => c.slug === slug) || null;
  },

  async addCategory(name) {
    const id = 'cat-' + uid();
    const cat = { id, name, slug: slugify(name) };
    await set(ref(db, `categories/${id}`), cat);
    return cat;
  },

  async deleteCategory(id) {
    const rawData = await loadFullRawDB();
    await remove(ref(db, `categories/${id}`));
    
    for (const sub of rawData.subcategories.filter(s => s.categoryId === id)) {
      await remove(ref(db, `subcategories/${sub.id}`));
    }
    for (const r of rawData.restaurants.filter(r => r.categoryId === id)) {
      await remove(ref(db, `restaurants/${r.id}`));
    }
  },

  async addSubcategory(categoryId, name) {
    const id = 'sub-' + uid();
    const sub = { id, categoryId, name, slug: slugify(name) };
    await set(ref(db, `subcategories/${id}`), sub);
    return sub;
  },

  async deleteSubcategory(id) {
    const rawData = await loadFullRawDB();
    await remove(ref(db, `subcategories/${id}`));
    
    for (const r of rawData.restaurants.filter(r => r.subcategoryId === id)) {
      await update(ref(db, `restaurants/${r.id}`), { subcategoryId: null });
    }
  },

  async getRestaurants({ citySlug, categorySlug, subcategorySlug, query } = {}) {
    const rawData = await loadFullRawDB();
    let list = rawData.restaurants.map(r => this._hydrate(r, rawData));

    if (citySlug) {
      list = list.filter(r => r.city && r.city.slug === citySlug);
    }
    if (categorySlug) {
      list = list.filter(r => r.category && r.category.slug === categorySlug);
    }
    if (subcategorySlug) {
      list = list.filter(r => r.subcategory && r.subcategory.slug === subcategorySlug);
    }
    if (query && query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(r =>
        r.name.toLowerCase().includes(q) ||
        (r.address || '').toLowerCase().includes(q) ||
        (r.city && r.city.name.toLowerCase().includes(q)) ||
        (r.category && r.category.name.toLowerCase().includes(q)) ||
        (r.subcategory && r.subcategory.name.toLowerCase().includes(q)) ||
        r.menuItems.some(m => m.name.toLowerCase().includes(q))
      );
    }
    return list.sort((a, b) => a.name.localeCompare(b.name, 'tr'));
  },

  async getRestaurantById(id) {
    const rawData = await loadFullRawDB();
    const r = rawData.restaurants.find(r => r.id === id);
    return r ? this._hydrate(r, rawData) : null;
  },

  _hydrate(r, rawData) {
    const city = rawData.cities.find(c => c.id === r.cityId);
    const cat = rawData.categories.find(c => c.id === r.categoryId);
    const sub = rawData.subcategories.find(s => s.id === r.subcategoryId);
    return {
      ...r,
      city: city ? { ...city } : null,
      category: cat ? { ...cat, emoji: EMOJI_BY_CATEGORY[cat.slug] || '🍽️' } : null,
      subcategory: sub ? { ...sub, emoji: EMOJI_BY_SUBCATEGORY[sub.slug] || '🍽️' } : null
    };
  },

  // Düzeltilmiş addRestaurant fonksiyonu
  async addRestaurant(data) {
    const id = 'r-' + uid();
    const menuItemsObj = {};
    
    (data.menuItems || []).forEach(m => {
      const mId = m.id || uid();
      menuItemsObj[mId] = { id: mId, name: m.name, price: Number(m.price) };
    });

    const restaurant = {
      id,
      name: data.name,
      cityId: data.cityId,
      categoryId: data.categoryId,
      subcategoryId: data.subcategoryId || null,
      address: data.address || '',
      phone: data.phone || '',
      description: data.description || '',
      image: data.image || null,
      menuItems: menuItemsObj
    };

    await set(ref(db, `restaurants/${id}`), restaurant);
    return restaurant;
  },

  async updateRestaurant(id, data) {
    const menuItemsObj = {};
    (data.menuItems || []).forEach(m => {
      const mId = m.id || uid();
      menuItemsObj[mId] = { id: mId, name: m.name, price: Number(m.price) };
    });

    const updateData = {
      name: data.name,
      cityId: data.cityId,
      categoryId: data.categoryId,
      subcategoryId: data.subcategoryId || null,
      address: data.address || '',
      phone: data.phone || '',
      description: data.description || '',
      menuItems: menuItemsObj
    };

    if (data.image !== undefined) {
      updateData.image = data.image;
    }

    await update(ref(db, `restaurants/${id}`), updateData);
  },

  async deleteRestaurant(id) {
    await remove(ref(db, `restaurants/${id}`));
  },

  async resetToDefaults() {
    return await buildDefaultData();
  }
};

/* ----------------------- Oturum Yönetimi ----------------------- */
const RestoranAuth = {
  ADMIN_USER: 'admin',
  ADMIN_PASS: 'admin123',
  SESSION_KEY: 'restoran_admin_session',

  login(username, password) {
    if (username === this.ADMIN_USER && password === this.ADMIN_PASS) {
      sessionStorage.setItem(this.SESSION_KEY, JSON.stringify({ username, ts: Date.now() }));
      return true;
    }
    return false;
  },

  isLoggedIn() {
    return !!sessionStorage.getItem(this.SESSION_KEY);
  },

  logout() {
    sessionStorage.removeItem(this.SESSION_KEY);
  }
};

window.RestoranDB = RestoranDB;
window.RestoranAuth = RestoranAuth;
