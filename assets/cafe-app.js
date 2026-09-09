/**
 * Sky16 Cafe & Retreat — Application Engine
 * Inspired by Mystic Brew House Design & Melvin Moses Portfolio Polish
 * Controls: Multi-slide Crema Carousel, Menu Filter & Search, Modal Booking, Lightbox
 */

// ============================================================
// 1. HERO INTERACTIVE MULTI-SLIDE CREMA CAROUSEL (Mystic Brew House)
// ============================================================

const HERO_SLIDES = [
  {
    id: "coffee",
    category: "Artisanal Coffee",
    tagline: "SLOW-BREWED TO COLD PERFECTION",
    title: "Chilled Craft Coffee & Single-Origin Kaapi",
    description: "Savor the rich aromas of Coorg's shade-grown estate beans freshly roasted on-site, paired with velvety milk, 18-hour cold brew, and signature latte art.",
    image: "/images-sky-16/cofeecup.jpeg",
    bgColor: "#EFEAE2",
    cremaColor: "#FAF8F5",
    ambientColor: "#C7BAA8",
    waveStroke: "#451a03",
    cardCategory: "ESTATE COFFEE",
    cardName: "Signature Kaapi & Iced Brews",
    badge1: { icon: "☕", tag: "Estate Brew", val: "Smoked Hazelnut" },
    badge2: { icon: "✨", tag: "Daily Roast", val: "Signature Kaapi" }
  },
  {
    id: "tea",
    category: "Mountain Spiced Teas",
    tagline: "COORG'S FRESHLY PLUCKED ELIXIR",
    title: "Royal Mountain Spiced Masala Chai",
    description: "Savor the thick, comforting slow-simmered perfection of our mountain spiced tea infused with hand-crushed ginger, cardamom, and valley spices.",
    image: "/images-sky-16/tea-glass.webp",
    bgColor: "#FDF0D5",
    cremaColor: "#FFFBF2",
    ambientColor: "#E5BA73",
    waveStroke: "#ea580c",
    cardCategory: "HERITAGE BREWS",
    cardName: "Spiced Masala & Ginger Teas",
    badge1: { icon: "🫖", tag: "Royal Brew", val: "Mountain Masala" },
    badge2: { icon: "🌿", tag: "Fresh Spices", val: "Honey Ginger Tea" }
  },
  {
    id: "burgers",
    category: "Specialty Burgers & Pizzas",
    tagline: "BITE INTO CRISPY GOURMET GOODNESS",
    title: "Sky16 Monster Burgers & Wood-Fired Pizzas",
    description: "Sink your teeth into golden, flame-grilled crispy patties, melted cheddar, hand-stretched sourdough pizzas fresh from the wood-fired oven, and secret relish.",
    image: "/images-food/pizza.jpg",
    bgColor: "#D8ECE4",
    cremaColor: "#F4FAF7",
    ambientColor: "#B5D6C9",
    waveStroke: "#059669",
    cardCategory: "CHEF'S GASTRONOMY",
    cardName: "Wild Truffle & Monster Patty",
    badge1: { icon: "🍕", tag: "Wood-Fired", val: "Wild Truffle Pizza" },
    badge2: { icon: "🔥", tag: "Hot & Fresh", val: "Monster Double Patty" }
  },
  {
    id: "adventure",
    category: "Adventure & Luxury Retreat",
    tagline: "COORG'S PREMIER ALL-IN-ONE RETREAT",
    title: "Giant Swing, Thrill Rides & Scenic Chalets",
    description: "Experience Coorg's first 50+ ft Giant Swing, rocket ejector launcher, mechanical rodeo bull, wooden luxury chalets, and open-air dining under misty mountain skies.",
    image: "/images-real/RIDE1.webp",
    bgColor: "#F9DCDD",
    cremaColor: "#FFF5F5",
    ambientColor: "#E2B2B4",
    waveStroke: "#e11d48",
    cardCategory: "DESTINATION RESORT",
    cardName: "50ft Giant Swing & Chalet Stay",
    badge1: { icon: "🌲", tag: "Pure Thrill", val: "50ft Giant Swing" },
    badge2: { icon: "🏡", tag: "Valley Stay", val: "Scenic Chalets" }
  }
];

let currentHeroIdx = 0;
let heroProgress = 0;
let heroTimer = null;
let isHeroPaused = false;

function initHeroCarousel() {
  const container = document.getElementById('hero-carousel-container');
  if (container) {
    container.addEventListener('mouseenter', () => { isHeroPaused = true; });
    container.addEventListener('mouseleave', () => { isHeroPaused = false; });
  }

  // Init Spring Mouse Tilt on Card
  const card = document.getElementById('hero-interactive-card');
  if (card) {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - (rect.left + rect.width / 2);
      const y = e.clientY - (rect.top + rect.height / 2);
      card.style.transform = `perspective(1000px) rotateX(${-y * 0.05}deg) rotateY(${x * 0.05}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    });
  }

  // Start 50ms timer for smooth 5-second progress bar
  if (heroTimer) clearInterval(heroTimer);
  heroTimer = setInterval(() => {
    if (!isHeroPaused) {
      heroProgress += 1;
      const progressBar = document.getElementById('hero-slide-progress');
      if (progressBar) progressBar.style.width = `${heroProgress}%`;

      if (heroProgress >= 100) {
        heroProgress = 0;
        setHeroSlide((currentHeroIdx + 1) % HERO_SLIDES.length);
      }
    }
  }, 50);

  // Set initial slide
  setHeroSlide(0);
}

function setHeroSlide(index) {
  currentHeroIdx = index;
  heroProgress = 0;
  const slide = HERO_SLIDES[index];
  if (!slide) return;

  // 1. Dynamic Radial Background
  const radialBg = document.getElementById('hero-radial-bg');
  if (radialBg) {
    radialBg.style.background = `radial-gradient(circle at 50% 35%, ${slide.cremaColor} 0%, ${slide.bgColor} 55%, ${slide.ambientColor} 100%)`;
  }

  // 2. SVG Wavy Stroke
  const wavyPath = document.getElementById('hero-wavy-path');
  if (wavyPath) {
    wavyPath.setAttribute('stroke', slide.waveStroke);
  }

  // 3. Left Column Content
  const iconEl = document.getElementById('hero-slide-icon');
  const taglineEl = document.getElementById('hero-slide-tagline');
  const titleEl = document.getElementById('hero-slide-title');
  const descEl = document.getElementById('hero-slide-desc');

  if (iconEl) iconEl.textContent = slide.badge1.icon;
  if (taglineEl) taglineEl.textContent = slide.tagline;
  if (titleEl) titleEl.textContent = slide.title;
  if (descEl) descEl.textContent = slide.description;

  // 4. Right Card Content
  const cardImg = document.getElementById('hero-card-img');
  const b1Icon = document.getElementById('hero-badge1-icon');
  const b1Tag = document.getElementById('hero-badge1-tag');
  const b1Val = document.getElementById('hero-badge1-val');

  const b2Icon = document.getElementById('hero-badge2-icon');
  const b2Tag = document.getElementById('hero-badge2-tag');
  const b2Val = document.getElementById('hero-badge2-val');

  const cardCategory = document.getElementById('hero-card-category');
  const cardName = document.getElementById('hero-card-name');

  if (cardImg) cardImg.src = slide.image;
  if (b1Icon) b1Icon.textContent = slide.badge1.icon;
  if (b1Tag) b1Tag.textContent = slide.badge1.tag;
  if (b1Val) b1Val.textContent = slide.badge1.val;

  if (b2Icon) b2Icon.textContent = slide.badge2.icon;
  if (b2Tag) b2Tag.textContent = slide.badge2.tag;
  if (b2Val) b2Val.textContent = slide.badge2.val;

  if (cardCategory) cardCategory.textContent = slide.cardCategory;
  if (cardName) cardName.textContent = slide.cardName;

  // 5. Update Tab Buttons Active State
  const tabs = document.querySelectorAll('.hero-cat-tab');
  tabs.forEach(tab => {
    const tabIdx = parseInt(tab.getAttribute('data-idx'), 10);
    if (tabIdx === index) {
      tab.className = 'hero-cat-tab active px-4 py-2 rounded-full font-sans text-xs font-bold tracking-wide transition-all bg-[#23120b] text-white shadow-sm';
    } else {
      tab.className = 'hero-cat-tab px-4 py-2 rounded-full font-sans text-xs font-bold tracking-wide transition-all bg-white/50 hover:bg-white/80 text-[#3d2c22]';
    }
  });
}

function nextHeroSlide() {
  const nextIdx = (currentHeroIdx + 1) % HERO_SLIDES.length;
  setHeroSlide(nextIdx);
}

function prevHeroSlide() {
  const prevIdx = (currentHeroIdx - 1 + HERO_SLIDES.length) % HERO_SLIDES.length;
  setHeroSlide(prevIdx);
}

// ============================================================
// 2. GOURMET MENU DATA & INTERACTIVE SEARCH / FILTER
// ============================================================

const MENU_ITEMS = [
  // Coffee & Brews
  {
    id: 1,
    category: "coffee",
    name: "Coorg Estate Signature Kaapi",
    desc: "Slow-dripped Arabica & Robusta blend from local Kushalnagar plantations, frothed with rich buffalo milk and raw jaggery.",
    price: "₹149",
    type: "veg",
    tag: "Estate Special",
    isBestseller: true,
    image: "/images-sky-16/cofeecup.jpeg"
  },
  {
    id: 2,
    category: "coffee",
    name: "Smoked Hazelnut Latte",
    desc: "Fresh espresso roast infused with toasted hazelnut syrup, textured microfoam, and artisanal rosetta latte art.",
    price: "₹219",
    type: "veg",
    tag: "Popular",
    isBestseller: true,
    image: "/images-food/coffee.jpg"
  },
  {
    id: 3,
    category: "coffee",
    name: "Iced Salted Caramel Cold Brew",
    desc: "18-hour cold steeped Coorg single-origin beans, topped with house-made salted vanilla cold foam.",
    price: "₹239",
    type: "veg",
    tag: "Chef's Pick",
    isBestseller: true,
    image: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 4,
    category: "coffee",
    name: "Double Shot Espresso Macchiato",
    desc: "Intense double shot of dark roasted mountain beans marked with a dollop of velvety steamed cream.",
    price: "₹169",
    type: "veg",
    tag: "Classic",
    isBestseller: false,
    image: "/images-sky-16/coffee-machine.webp"
  },

  // Mountain Teas
  {
    id: 5,
    category: "tea",
    name: "Mountain Spiced Masala Chai",
    desc: "Slow-simmered Indian milk tea loaded with hand-crushed ginger, green cardamom, cloves, and cinnamon.",
    price: "₹129",
    type: "veg",
    tag: "Best Seller",
    isBestseller: true,
    image: "/images-sky-16/tea-glass.webp"
  },
  {
    id: 6,
    category: "tea",
    name: "Honey Ginger Mountain Lemon Tea",
    desc: "Zesty mountain tea steeped with crushed fresh ginger slices, organic Coorg honey, and fresh lemon squeeze.",
    price: "₹119",
    type: "veg",
    tag: "Immunity",
    isBestseller: false,
    image: "/images-sky-16/tea-glass.webp"
  },

  // Wood-Fired Pizzas
  {
    id: 7,
    category: "pizza",
    name: "Sky16 Wild Truffle & Mushroom Pizza",
    desc: "Hand-stretched sourdough crust, roasted forest mushrooms, creamy fior di latte, white truffle oil, and fresh oregano.",
    price: "₹499",
    type: "veg",
    tag: "Signature",
    isBestseller: true,
    image: "/images-food/pizza.jpg"
  },
  {
    id: 8,
    category: "pizza",
    name: "Coorg Spiced Smoked Chicken Pizza",
    desc: "Slow-smoked estate chicken chunks, roasted bell peppers, San Marzano tomato reduction, mozzarella, and bird's eye chili drizzle.",
    price: "₹549",
    type: "nonveg",
    tag: "Best Seller",
    isBestseller: true,
    image: "/images-food/pizza.jpg"
  },
  {
    id: 9,
    category: "pizza",
    name: "Rustic Margherita Con Bufala",
    desc: "San Marzano sauce, fresh buffalo mozzarella, aromatic sweet basil leaves, and extra virgin olive oil drizzle.",
    price: "₹429",
    type: "veg",
    tag: "Classic",
    isBestseller: false,
    image: "/images-food/pizza.jpg"
  },
  {
    id: 10,
    category: "pizza",
    name: "Fiery Paneer Tikka Woodfire Pizza",
    desc: "Clay-oven smoked cottage cheese, charred red onions, green bell peppers, spiced tomato coulis, and cheddar blend.",
    price: "₹479",
    type: "veg",
    tag: "Fusion",
    isBestseller: false,
    image: "/images-food/pizza.jpg"
  },

  // Burgers & Sandwiches
  {
    id: 11,
    category: "burgers",
    name: "The Sky16 High-Altitude Monster Burger",
    desc: "Double flame-grilled patty, aged cheddar, caramelised onion jam, crisp lettuce, and signature secret house relish.",
    price: "₹389",
    type: "nonveg",
    tag: "Monster Size",
    isBestseller: true,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 12,
    category: "burgers",
    name: "Crisp Tandoori Paneer Burger",
    desc: "Crispy battered paneer steak dusted with tandoori spices, mint mayonnaise, sliced tomatoes, and melted cheese slice.",
    price: "₹249",
    type: "veg",
    tag: "Popular",
    isBestseller: true,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 13,
    category: "burgers",
    name: "Golden Corn & Triple Cheese Sandwich",
    desc: "Toasted farmhouse bread loaded with sweet butter corn, mozzarella, cheddar, and crushed black pepper.",
    price: "₹189",
    type: "veg",
    tag: "Quick Bite",
    isBestseller: false,
    image: "/images-food/sandwich.jpg"
  },

  // Coorg Specials
  {
    id: 14,
    category: "coorg",
    name: "Coorg Koli Curry & Kadambuttu",
    desc: "Traditional Kodava chicken curry cooked in roasted coconut gravy and ground bird's eye chili, served with steamed rice dumplings.",
    price: "₹469",
    type: "nonveg",
    tag: "Kodava Heritage",
    isBestseller: true,
    image: "/images-food/coorg-curry.jpg"
  },
  {
    id: 15,
    category: "coorg",
    name: "Pandi Curry Fusion Bowl",
    desc: "Tender pork chunks slow-cooked with authentic Kachampuli vinegar and roasted dark spices, served over fragrant jeera rice.",
    price: "₹449",
    type: "nonveg",
    tag: "Authentic",
    isBestseller: true,
    image: "/images-food/coorg-curry.jpg"
  },

  // Indo-Chinese Corner
  {
    id: 16,
    category: "chinese",
    name: "Street Style Veg Hakka Noodles",
    desc: "Wok-tossed noodles with shredded cabbage, crunchy bell peppers, spring onions, and spicy soy-garlic glaze.",
    price: "₹229",
    type: "veg",
    tag: "Wok Fresh",
    isBestseller: true,
    image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 17,
    category: "chinese",
    name: "Fiery Chili Paneer Dry",
    desc: "Crisp cottage cheese cubes tossed with fiery green chillies, diced capsicum, and oriental sauces.",
    price: "₹269",
    type: "veg",
    tag: "Spicy",
    isBestseller: false,
    image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=800&q=80"
  },

  // Shakes & Coolers
  {
    id: 18,
    category: "shakes",
    name: "Signature Chilled Oreo Shake",
    desc: "Double scoop vanilla cream blitzed with crunchy Oreo cookies, dark chocolate fudge, and whipped cream crown.",
    price: "₹219",
    type: "veg",
    tag: "Sweet Craving",
    isBestseller: true,
    image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 19,
    category: "shakes",
    name: "Fresh Mountain Virgin Mojito",
    desc: "Hand-muddled fresh valley mint leaves, crushed Persian lime wedges, cane sugar, and chilled bubbly soda.",
    price: "₹179",
    type: "veg",
    tag: "Refreshing",
    isBestseller: false,
    image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80"
  }
];

let activeCategory = "all";
let bestsellerOnly = false;
let searchQuery = "";

function renderMenuItems(items) {
  const container = document.getElementById('menu-items-grid');
  if (!container) return;

  if (items.length === 0) {
    container.innerHTML = `
      <div class="col-span-full text-center py-16">
        <span class="text-4xl">☕</span>
        <h3 class="font-serif text-xl font-bold text-white mt-3">No dishes found</h3>
        <p class="text-xs text-[#886d5e] mt-1">Try another category or keyword.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = items.map(item => `
    <div class="mystic-dish-card text-left flex flex-col justify-between" data-category="${item.category}">
      
      <!-- Dish Image & Badges -->
      <div class="relative h-48 sm:h-52 overflow-hidden">
        <img src="${item.image}" alt="${item.name}" class="w-full h-full object-cover dish-img" loading="lazy" />
        <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
        
        <!-- Veg / Non-Veg Indicator -->
        <div class="absolute top-3 left-3 bg-[#23120b]/90 backdrop-blur-md p-1.5 rounded-lg border border-white/10 flex items-center justify-center">
          <span class="${item.type === 'veg' ? 'veg-indicator' : 'non-veg-indicator'}"></span>
        </div>

        <!-- Tag / Bestseller Badge -->
        <div class="absolute top-3 right-3 bg-[#c08257] text-white text-[10px] font-mono font-bold px-2.5 py-1 rounded-full uppercase shadow-sm">
          ${item.tag}
        </div>

        <!-- Price Tag overlay bottom right -->
        <div class="absolute bottom-3 right-3 bg-[#23120b]/90 border border-[#c08257]/30 text-[#e2a850] font-mono font-bold text-sm px-3 py-1 rounded-lg backdrop-blur-md">
          ${item.price}
        </div>
      </div>

      <!-- Card Body -->
      <div class="p-5 flex flex-col justify-between flex-grow">
        <div>
          <span class="font-mono text-[9px] uppercase tracking-widest text-[#c08257] font-semibold">${item.category.toUpperCase()}</span>
          <h3 class="font-serif text-lg font-bold text-white mt-1 leading-snug">${item.name}</h3>
          <p class="text-xs text-[#a99587] mt-2 line-clamp-2 leading-relaxed">${item.desc}</p>
        </div>

        <!-- Order Button -->
        <div class="pt-5 mt-4 border-t border-white/5 flex items-center justify-between">
          <span class="text-xs text-[#886d5e] font-medium">Freshly Prepared</span>
          <button onclick="orderDish('${item.name}', '${item.price}')" class="bg-[#c08257]/15 hover:bg-[#c08257] text-[#e2a850] hover:text-white border border-[#c08257]/40 text-xs font-bold px-4 py-1.5 rounded-full transition-all" data-cursor="pointer">
            Order / Add +
          </button>
        </div>
      </div>

    </div>
  `).join('');
}

function filterMenu(category) {
  activeCategory = category;
  
  // Update Tab Styling
  const tabs = document.querySelectorAll('.filter-tab-btn');
  tabs.forEach(tab => {
    if (tab.getAttribute('data-category') === category) {
      tab.classList.add('active');
    } else {
      tab.classList.remove('active');
    }
  });

  applyMenuFilters();
}

function searchMenu() {
  const input = document.getElementById('menu-search-input');
  if (input) {
    searchQuery = input.value.trim().toLowerCase();
    applyMenuFilters();
  }
}

function toggleBestsellerFilter() {
  bestsellerOnly = !bestsellerOnly;
  const btn = document.getElementById('bestseller-filter-btn');
  if (btn) {
    if (bestsellerOnly) {
      btn.className = 'flex-shrink-0 bg-[#c08257] text-white border border-[#c08257] text-xs px-3.5 py-2.5 rounded-full transition-all flex items-center gap-1.5 shadow-md';
    } else {
      btn.className = 'flex-shrink-0 bg-[#23120b] hover:bg-[#c08257]/20 border border-[#c08257]/30 text-xs text-[#e2a850] px-3.5 py-2.5 rounded-full transition-all flex items-center gap-1.5';
    }
  }
  applyMenuFilters();
}

function applyMenuFilters() {
  let filtered = MENU_ITEMS;

  if (activeCategory !== 'all') {
    filtered = filtered.filter(item => item.category === activeCategory);
  }

  if (bestsellerOnly) {
    filtered = filtered.filter(item => item.isBestseller);
  }

  if (searchQuery !== '') {
    filtered = filtered.filter(item => 
      item.name.toLowerCase().includes(searchQuery) ||
      item.desc.toLowerCase().includes(searchQuery) ||
      item.category.toLowerCase().includes(searchQuery)
    );
  }

  renderMenuItems(filtered);
}

function orderDish(dishName, price) {
  const url = `https://wa.me/918296316161?text=Hi%20Sky16%20Cafe,%20I%20would%20like%20to%20order:%20${encodeURIComponent(dishName)}%20(${encodeURIComponent(price)})`;
  window.open(url, '_blank');
}

// ============================================================
// 3. LIGHTBOX MODAL (Visual Gallery)
// ============================================================

function openLightbox(imgSrc, caption) {
  const modal = document.getElementById('lightbox-modal');
  const img = document.getElementById('lightbox-img');
  const cap = document.getElementById('lightbox-caption');
  if (modal && img) {
    img.src = imgSrc;
    if (cap) cap.textContent = caption || '';
    modal.classList.remove('hidden');
  }
}

function closeLightbox() {
  const modal = document.getElementById('lightbox-modal');
  if (modal) modal.classList.add('hidden');
}

// ============================================================
// 4. RESERVATION SYSTEM (WhatsApp Integration)
// ============================================================

function openReservationModal(title) {
  const modal = document.getElementById('reservation-modal');
  const titleEl = document.getElementById('modal-res-title');
  if (modal) {
    if (titleEl && title) titleEl.textContent = title;
    modal.classList.remove('hidden');
  }
}

function closeReservationModal() {
  const modal = document.getElementById('reservation-modal');
  if (modal) modal.classList.add('hidden');
}

function submitQuickReservation() {
  const name = document.getElementById('quick-res-name')?.value || 'Guest';
  const guests = document.getElementById('quick-res-guests')?.value || '2';
  const time = document.getElementById('quick-res-time')?.value || 'Today';

  const text = `Hi Sky16 Cafe, I would like to reserve a table for ${guests} guests under the name ${name} on ${time}.`;
  window.open(`https://wa.me/918296316161?text=${encodeURIComponent(text)}`, '_blank');
  closeReservationModal();
}

function submitReservationForm(e) {
  e.preventDefault();
  const name = document.getElementById('res-name')?.value || 'Guest';
  const phone = document.getElementById('res-phone')?.value || '';
  const date = document.getElementById('res-date')?.value || '';
  const time = document.getElementById('res-time')?.value || '';
  const guests = document.getElementById('res-guests')?.value || '2';
  const type = document.getElementById('res-type')?.value || 'Cafe Dining';
  const notes = document.getElementById('res-notes')?.value || 'None';

  const text = `*New Table & Experience Reservation - Sky16 Cafe Coorg*\n\n*Name:* ${name}\n*Phone:* ${phone}\n*Date:* ${date}\n*Time:* ${time}\n*Guests:* ${guests}\n*Experience:* ${type}\n*Notes:* ${notes}`;
  window.open(`https://wa.me/918296316161?text=${encodeURIComponent(text)}`, '_blank');
}

// ============================================================
// 5. MOBILE MENU & NAVBAR SCROLL BEHAVIOR
// ============================================================

function toggleMobileMenu() {
  const menu = document.getElementById('mobile-menu');
  if (menu) {
    menu.classList.toggle('hidden');
  }
}

window.addEventListener('scroll', () => {
  const nav = document.getElementById('main-nav');
  const progress = document.getElementById('scroll-progress');

  // Scroll Progress Bar
  const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
  if (totalScroll > 0 && progress) {
    const scrolledPercent = (window.scrollY / totalScroll) * 100;
    progress.style.width = `${scrolledPercent}%`;
  }

  // Scrolled Navbar background styling
  if (nav) {
    if (window.scrollY > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }
}, { passive: true });

// ============================================================
// 6. INITIALIZATION ON DOM CONTENT LOADED
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  initHeroCarousel();
  renderMenuItems(MENU_ITEMS);

  // Set default reservation date to today
  const dateInput = document.getElementById('res-date');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.value = today;
  }
});
