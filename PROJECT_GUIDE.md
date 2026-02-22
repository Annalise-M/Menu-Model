# The Traveling Taphouse - Project Guide

## 🎯 Project Overview

A full-stack restaurant menu management system designed for smart TV displays. Managers can log in to add/remove items and mark items as sold out, with changes reflected in real-time on the public display.

**Design Philosophy:** Cookie-cutter/white-label system that any restaurant can personalize and use.

---

## 🚀 Quick Start

### Backend (Menu-Model)
```bash
cd /Users/annalise/Personal/Menu-Model
npm start  # Runs on http://localhost:7890
```

### Frontend (Digital-Menu-fe)
```bash
cd /Users/annalise/Personal/Digital-Menu-fe
npm start  # Runs on http://localhost:7891
```

### Database
- **Type:** PostgreSQL
- **Connection:** Already configured in `.env`
- **Admin:** Use pgAdmin for direct database access

---

## 📁 Project Structure

### Backend (`Menu-Model/`)
```
lib/
├── models/
│   ├── beer.js         # Beer model with availability field
│   ├── menu.js         # Menu model with availability field
│   └── admin.js        # Admin authentication model
├── controllers/        # Route handlers
├── middleware/         # Auth middleware (ensure-auth.js)
└── routes/            # API endpoints
```

**Key API Endpoints:**
- `POST /api/v1/auth/signup` - Create admin account
- `POST /api/v1/auth/login` - Login admin
- `GET /api/v1/auth/verify` - Verify session
- `GET /api/v1/menus` - Fetch all menu items
- `POST /api/v1/menus` - Create menu item
- `PUT /api/v1/menus/:id` - Update menu item (including availability)
- `DELETE /api/v1/menus/:id` - Delete menu item
- Similar endpoints for `/api/v1/beers`

### Frontend (`Digital-Menu-fe/`)
```
src/
├── components/
│   ├── auth/
│   │   ├── Login.jsx              # Manager login page
│   │   ├── Signup.jsx             # Manager signup page
│   │   ├── AuthProvider.jsx       # Auth context provider
│   │   ├── PrivateRoute.jsx       # Protected route wrapper
│   │   └── auth.scss              # Auth page styling
│   ├── pages/
│   │   ├── Home.jsx               # Public menu display
│   │   ├── Dashboard.jsx          # Manager dashboard
│   │   └── Header.jsx             # Navigation header
│   ├── list/
│   │   ├── MenuList.jsx           # Menu item management
│   │   ├── BeerList.jsx           # Beer item management
│   │   └── DraggableGrid.jsx      # Drag-and-drop grid
│   └── form-creation/
│       └── CombinedForm.jsx       # Add menu/beer form
├── hooks/
│   ├── useMenus.js                # Menu queries & mutations
│   └── useBeers.js                # Beer queries & mutations
└── context/
    └── AuthContext.js             # Auth context & hooks
```

---

## 🎨 Design System

### Color Palette
```scss
$gold-light: #D4AF37;   // Primary accent
$gold: #B8860B;         // Secondary accent
$charcoal: #1C1C1E;     // Dark background
$slate: #2C2C2E;        // Card background
$cream: #F5F1E8;        // Light text
$text-light: #E5E5E7;   // Primary text
$text-muted: #98989D;   // Secondary text
```

### Typography
- **Headers:** 'Playfair Display', serif
- **Body:** 'Inter', sans-serif

---

## ✅ Completed Features

### Manager Dashboard
- ✅ Admin authentication (signup/login/logout)
- ✅ Toggle between "Add Beer" and "Add Menu Item" forms
- ✅ Add new menu items with name, description, price
- ✅ Add new beers with brewery, style, ABV, price
- ✅ Delete items with trash button
- ✅ Toggle availability (sold out) with checkbox
- ✅ Drag-and-drop reordering with improved z-index
- ✅ Real-time updates via TanStack Query mutations

### Public Display
- ✅ Beautiful hero section with background image
- ✅ "Our Menu" section with food items
- ✅ "On Tap" section with beer selection
- ✅ Real-time polling (10-second intervals)
- ✅ Unavailable items show with:
  - Strikethrough text
  - Grayscale filter (60% opacity)
  - Red "SOLD OUT" badge
- ✅ Smooth GSAP animations (fixed visibility issues)
- ✅ Responsive design for all screen sizes

### Technical Infrastructure
- ✅ React 18 with createRoot API
- ✅ React Router v6 for navigation
- ✅ TanStack Query for server state
- ✅ GSAP with ScrollTrigger for animations
- ✅ PostgreSQL with availability tracking
- ✅ Express.js with JWT authentication
- ✅ Rate limiting (5 requests per 15 min on auth endpoints)
- ✅ CORS enabled for frontend-backend communication

---

## 🔧 Recent Fixes & Solutions

### GSAP Animation Issues
**Problem:** Menu and beer cards were invisible due to GSAP animations starting with `opacity: 0` but not completing.

**Solution:**
```javascript
// Set visibility first, then animate
const cards = document.querySelectorAll('.beer-card');
gsap.set(cards, { opacity: 1, scale: 1 });
gsap.from(cards, { y: 30, opacity: 0, duration: 0.6 });
```

### Rate Limiting
- Backend has strict rate limiting on `/api/v1/auth` endpoints
- **If rate limited:** Restart backend server to reset counter
- **For development:** Rate limiter only active in non-test environments

### Drag-and-Drop Z-Index
**Problem:** Cards overlapping incorrectly when dragged.

**Solution:**
```javascript
onDragStart: () => {
  gsap.to(card, { scale: 1.05, zIndex: 1000 });
},
onDragEnd: () => {
  gsap.to(card, { scale: 1, zIndex: 1 });
}
```

---

## 🎯 URLs & Navigation

### Public View (Smart TV Display)
- **URL:** `http://localhost:7891/`
- **Who sees it:** Everyone (no authentication)
- **Purpose:** Display menu and beers for customers
- **Updates:** Automatically every 10 seconds

### Manager Dashboard
- **URL:** `http://localhost:7891/dashboard`
- **Who sees it:** Logged-in managers only
- **Purpose:** Add/remove items, toggle availability
- **Features:** Full CRUD operations

### Authentication
- **Login:** `http://localhost:7891/login`
- **Signup:** `http://localhost:7891/signup`

---

## 📊 Database Schema

### Menus Table
```sql
CREATE TABLE menus (
  id SERIAL PRIMARY KEY,
  item VARCHAR(255) NOT NULL,
  detail TEXT,
  price DECIMAL(10,2) NOT NULL,
  available BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Beers Table
```sql
CREATE TABLE beers (
  id SERIAL PRIMARY KEY,
  brewery VARCHAR(255) NOT NULL,
  style VARCHAR(255) NOT NULL,
  abv DECIMAL(4,2) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  available BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Admins Table
```sql
CREATE TABLE admins (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🚧 Known Issues & Limitations

1. **No Drag-and-Drop Persistence**
   - Items can be dragged but positions don't save to database
   - Need to add `order` field to tables if this feature is desired

2. **No Image Support**
   - Currently text-only menu items
   - Could add image URLs to models for photos

3. **Single Restaurant**
   - Not multi-tenant yet
   - All managers share same menu

4. **Basic Search/Filter**
   - No search functionality in dashboard
   - All items displayed at once

---

## 🔮 Next Steps / Future Features

### High Priority
1. **Merge AuthContext branch to main**
   ```bash
   cd Digital-Menu-fe
   git checkout main
   git merge AuthContext
   git push
   ```

2. **TV Display Mode**
   - Full-screen mode without header/navigation
   - Auto-rotate between menu sections
   - Larger fonts for viewing from distance

3. **White-Label Customization**
   - Restaurant configuration table
   - Custom color schemes (CSS custom properties)
   - Upload logo and background image
   - Restaurant name/tagline settings

### Medium Priority
4. **Menu Categories**
   - Organize items into sections (Appetizers, Entrees, etc.)
   - Category-based filtering

5. **Order Persistence**
   - Save drag-and-drop positions
   - Custom sorting options (price, name, popularity)

6. **Enhanced Availability**
   - Temporary sold out (auto-restore at midnight)
   - Low stock warnings
   - Quantity tracking

### Low Priority
7. **Analytics Dashboard**
   - Track which items are sold out most often
   - View menu change history
   - Popular items metrics

8. **Multi-Restaurant Support**
   - Restaurant selection/switching
   - Separate admin accounts per restaurant
   - Multi-tenancy with restaurant_id FK

9. **Advanced Features**
   - QR code generation for each restaurant
   - Print-friendly menu view
   - Daily specials system
   - Allergen/dietary tags

---

## 🐛 Debugging Tips

### Backend Issues
```bash
# Check backend logs
tail -f /path/to/backend/logs

# Test API directly
curl http://localhost:7890/api/v1/menus
curl http://localhost:7890/api/v1/beers

# Verify database connection
psql -U postgres -d menu_db
SELECT * FROM menus;
SELECT * FROM beers;
```

### Frontend Issues
```bash
# Check webpack compilation
# Look for errors in terminal where npm start is running

# Clear browser cache
# Open DevTools > Application > Clear storage

# Check network tab
# Look for failed API calls or 404s

# Check console for errors
# Open DevTools > Console
```

### Common Problems

**Problem:** "Too many login attempts"
- **Cause:** Rate limiter triggered (5 requests in 15 min)
- **Fix:** Restart backend server

**Problem:** Menu/beer cards invisible
- **Cause:** GSAP animation not completing
- **Fix:** Check that `gsap.set()` is called before `gsap.from()`

**Problem:** Changes not reflecting on public display
- **Cause:** Polling not working or cache issue
- **Fix:** Hard refresh browser (Cmd+Shift+R), check refetchInterval in useMenus/useBeers

**Problem:** Can't delete items
- **Cause:** Missing authentication or CORS issue
- **Fix:** Check that you're logged in, verify CORS settings in backend

---

## 📝 Important Notes

### Environment Variables
Both `.env` files are gitignored. Make sure these exist:

**Backend `.env`:**
```
DATABASE_URL=postgresql://...
JWT_SECRET=your_secret_key
PORT=7890
```

**Frontend `.env`:**
```
API_URL=http://localhost:7890
PORT=7891
```

### Git Branches
- **Backend:** Working on `main` branch
- **Frontend:** Working on `AuthContext` branch (needs to be merged to main)

### Security Notes
- ⚠️ **Never commit .env files**
- ⚠️ **Change JWT_SECRET in production**
- ⚠️ **Use HTTPS in production**
- ⚠️ **Implement proper password requirements**
- ⚠️ **Add CSRF protection**

---

## 👥 Team Workflow

### Starting a New Session
1. Pull latest changes from both repos
2. Start backend: `cd Menu-Model && npm start`
3. Start frontend: `cd Digital-Menu-fe && npm start`
4. Verify both are running (check terminal output)
5. Open `http://localhost:7891` in browser

### Before Pushing Changes
1. Test thoroughly in both manager view and public view
2. Check for console errors (browser DevTools)
3. Verify API calls work (Network tab)
4. Test availability toggle and real-time updates
5. Commit with descriptive messages
6. Push to respective branches

---

## 📚 Key Dependencies

### Backend
- `express` - Web framework
- `pg` - PostgreSQL client
- `jsonwebtoken` - JWT authentication
- `bcryptjs` - Password hashing
- `cookie-parser` - Cookie handling
- `express-rate-limit` - Rate limiting
- `helmet` - Security headers
- `cors` - Cross-origin requests

### Frontend
- `react` (v18) - UI library
- `react-router-dom` (v6) - Routing
- `@tanstack/react-query` - Server state management
- `gsap` - Animations
- `sass` - CSS preprocessing

---

## 🎓 Learning Resources

- [React Query Docs](https://tanstack.com/query/latest)
- [GSAP Docs](https://greensock.com/docs/)
- [React Router v6](https://reactrouter.com/en/main)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)

---

## ✨ Design Inspirations

The current design features:
- Elegant gold and charcoal color scheme
- Sophisticated serif typography (Playfair Display)
- Premium restaurant aesthetic
- Smooth animations and transitions
- Card-based layout with hover effects

**Style Keywords:** Upscale, modern, elegant, sophisticated, minimalist

---

**Last Updated:** February 22, 2026
**Created by:** Annalise with Claude Sonnet 4.5
**Repository:** https://github.com/Annalise-M/Menu-Model
