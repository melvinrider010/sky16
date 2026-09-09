# Sky16 Cafe | Coorg — Cinematic Scroll & Restaurant Destination

Complete, production-ready clone and cinematic web experience for **[Sky16 Cafe | Coorg’s Best All-in-One Destination](https://www.skydinecoorg.com/)**.

---

## 🌟 Cinematic Coffee Cup Scroll Feature

The homepage features an **Apple-style cinematic scroll storytelling experience**:

1. **Initial Entrance**:
   - On page load, the handcrafted ceramic coffee cup falls from above the viewport, rotating with subtle physics-based easing (`power4.out`), and settles into the hero composition.
   - Realistic wisps of steam rise continuously from the coffee rim.

2. **Dedicated 400vh Scroll-Driven Journey**:
   - Pinned / sticky viewport that tracks the user's scroll.
   - The coffee cup rotates continuously (0° → 360°) as the user scrolls, transforming with subtle depth, scale changes (1.0x → 1.2x), and perspective tilt.
   - Parallax roasted coffee beans float at varying Z-depths (0.4x and 0.8x speeds).
   - Side text smoothly transitions between 4 narrative chapters using the **actual website content**:
     - **Chapter 1 — Welcome & Intro**: Mountain mist meets artisanal coffee, Coorg's premier all-in-one destination.
     - **Chapter 2 — Coffee & Gourmet Dining**: Signature Kaapi (₹149), Wild Truffle Pizza (₹499), Sky16 Monster Burger (₹389), Coorg Koli Curry (₹469).
     - **Chapter 3 — Thrill Adventures & Chalets**: Giant Swing (50+ ft drop), Rocket Launcher, Mechanical Bull Ride, and Estate Chalets.
     - **Chapter 4 — Location & Table Reservations**: Near Kaveri Nisargadhama, BM Road, Kushalnagar, timings (9 AM – 10 PM), and instant booking.

3. **Full Cafe & Destination Features Below the Journey**:
   - 4 Pillars of Sky16 Experience (Cafe, Thrill Adventures, Estate Chalets, Scenic Hangout).
   - Full interactive Cafe Menu with category tabs (Artisan Coffee, Wood-Fired Pizza, Burgers, Coorg Specials, Desserts), search bar, and veg/non-veg dietary tags.
   - Adventure Arena 3D hover tilt cards.
   - Luxury Chalet showcase with MakeMyTrip direct link.
   - Continuous visitor moments marquee photo stream synced with the backend API.
   - Customer testimonials and verified traveler reviews.
   - Location guide, operating hours, and Google Maps integration.
   - Instant Table & Stay Reservation Modal with guest counter, seating preferences, and direct WhatsApp confirmation.
   - Floating quick-action dock (Book Table, WhatsApp, Call, Scroll to Top).
   - Separate Admin Portal at `/admin` (Default password: `admin123`).

---

## 🚀 How to Run

Zero third-party installations required! Works offline and online.

### Node.js
```bash
npm start
# or
node server.js
```

### Python
```bash
python server.py
```

---

## 🌐 URLs

- **Main Website**: [http://localhost:3000/](http://localhost:3000/)
- **Admin Dashboard**: [http://localhost:3000/admin](http://localhost:3000/admin) *(Password: `admin123`)*
- **API Backend**: [http://localhost:3001/api](http://localhost:3001/api)

---

## 🧪 Verification

Run the test suite:
```bash
python test_server.py
```
