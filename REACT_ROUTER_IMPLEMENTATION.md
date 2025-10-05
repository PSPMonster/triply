# 🗺️ React Router Implementation

## Overview

Replaced state-based navigation with **React Router v6** for:

- ✅ **Deep linking** (shareable URLs)
- ✅ **Browser history** (back/forward buttons work)
- ✅ **SEO-friendly** routes
- ✅ **Page transitions** (Framer Motion + AnimatePresence)
- ✅ **Scroll reset** on route change (Apple-like)

---

## 🛣️ Route Structure

```
/                    → LandingPage (Home)
/explore             → TripSelector (Destination + Vibe)
/trip/:cityId        → TripView (Itinerary)
  ↳ /trip/lisbon     → Lisbon trip
  ↳ /trip/krakow     → Kraków trip
/*                   → 404 Redirect to /
```

---

## 📱 Deep Linking Examples

### Example 1: Share Lisbon Trip

```
https://Triply.app/trip/lisbon
```

**What happens:**

1. User opens link
2. `useParams()` extracts `cityId: "lisbon"`
3. `mockTrips["lisbon"]` loads trip data
4. TripView renders Lisbon itinerary
5. Hero shows "Lisbon - Breathe in history, exhale stress"

### Example 2: Share with Query Params (Future)

```
https://Triply.app/trip/krakow?day=2&activity=kazimierz
```

**Potential use:**

- Deep link to specific day
- Highlight specific activity
- Pre-select mood/filter

---

## 🎬 Animation Flow

### Route Transition (Apple-like)

```jsx
<AnimatePresence mode="wait">
  <Routes location={location} key={location.pathname}>
    {/* Routes... */}
  </Routes>
</AnimatePresence>
```

**`mode="wait"`**: Current page fades out BEFORE next page fades in

**Flow:**

```
User clicks "Begin Your Journey"
  ↓
navigate("/explore") triggered
  ↓
LandingPage fades out (exit animation)
  ↓ 200ms
TripSelector fades in (enter animation)
  ↓
URL updates: / → /explore
  ↓
Browser history updated (back button works)
```

---

## 📜 Scroll Reset Logic

```jsx
function AnimatedRoutes() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [location.pathname]);

  return <Routes>...</Routes>;
}
```

**Why `behavior: "instant"`?**

- `"smooth"` = janky during route transitions
- `"instant"` = clean slate, Apple-like

**Triggers on:**

- `/` → `/explore`
- `/explore` → `/trip/lisbon`
- `/trip/lisbon` → `/explore` (back button)

---

## 🔗 Navigation Methods

### 1. Programmatic Navigation (Buttons)

```jsx
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <button onClick={() => navigate("/explore")}>Begin Your Journey</button>
  );
};
```

### 2. Navigation with State (Pass Data)

```jsx
const TripSelector = () => {
  const navigate = useNavigate();

  const handlePlanTrip = () => {
    navigate(`/trip/${selectedDestination}`, {
      state: { mood: selectedMood }, // Pass mood to TripView
    });
  };
};
```

**Retrieve in TripView:**

```jsx
const TripView = () => {
  const location = useLocation();
  const mood = location.state?.mood || "relax"; // Default fallback
};
```

### 3. Link Components (Future)

```jsx
import { Link } from "react-router-dom";

<Link to="/explore">Explore Destinations</Link>;
```

---

## 🎯 URL Parameters

### Dynamic Route: `/trip/:cityId`

```jsx
const TripView = () => {
  const { cityId } = useParams(); // Extract from URL
  const trip = mockTrips[cityId]; // Fetch data

  if (!trip) {
    return <NotFound />; // 404 handling
  }
};
```

**Examples:**

- `/trip/lisbon` → `cityId = "lisbon"`
- `/trip/krakow` → `cityId = "krakow"`
- `/trip/paris` → `cityId = "paris"` (404 if not in mockTrips)

---

## 🚫 404 Handling

### Invalid City ID

```jsx
if (!trip) {
  return (
    <motion.div className={styles.notFound}>
      <h1>Trip not found</h1>
      <p>The city "{cityId}" doesn't exist in our database.</p>
      <button onClick={() => navigate("/explore")}>Explore Destinations</button>
    </motion.div>
  );
}
```

**Scenarios:**

- User manually types `/trip/tokyo` (not in mockTrips)
- Broken link from old version
- Typo in URL

**User Experience:**

1. See friendly error message
2. Click "Explore Destinations"
3. Navigate to `/explore` (TripSelector)
4. Choose valid destination

---

## 🔄 Browser Navigation

### Back Button

```
User journey:
/ → /explore → /trip/lisbon

Back button:
/trip/lisbon → /explore → /

✅ Works automatically (no custom logic needed)
```

### Forward Button

```
After going back:
/explore (back from /trip/lisbon)

Forward button:
/explore → /trip/lisbon

✅ Restores state (React Router handles this)
```

### Refresh (F5)

```
Current URL: /trip/lisbon

User presses F5:
1. Page reloads
2. React Router reads URL
3. useParams() extracts "lisbon"
4. TripView renders with correct data

✅ No state lost (data from mockTrips)
```

---

## 📊 Route-to-Component Mapping

| Route           | Component      | Props            | Data Source         |
| --------------- | -------------- | ---------------- | ------------------- |
| `/`             | `LandingPage`  | None             | Static              |
| `/explore`      | `TripSelector` | None             | Static destinations |
| `/trip/:cityId` | `TripView`     | `cityId` (param) | `mockTrips[cityId]` |

---

## 🎨 Page Transition Animation

### Entry Animation (All Pages)

```jsx
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.5 }}
>
```

**Timing:**

- **Duration**: 500ms (Apple standard)
- **Easing**: Default (cubic-bezier)
- **Property**: Opacity only (performant)

### Exit Animation (AnimatePresence)

```jsx
<motion.div
  exit={{ opacity: 0 }}
  transition={{ duration: 0.3 }}
>
```

**Why faster exit (300ms)?**

- User expects immediate response
- Next page should appear quickly
- Apple HIG: Exit = 0.6× entry duration

---

## 🔍 SEO Improvements

### Meta Tags (index.html)

```html
<title>Triply - Intelligent Calm Travel Planning</title>
<meta name="description" content="Travel slower. Feel deeper..." />

<!-- Open Graph (Facebook/LinkedIn) -->
<meta property="og:title" content="Triply..." />
<meta property="og:image" content="/og-image.jpg" />

<!-- Twitter Card -->
<meta property="twitter:card" content="summary_large_image" />
```

**Benefits:**

- ✅ Google search results show title + description
- ✅ Facebook/LinkedIn preview on share
- ✅ Twitter card with image
- ✅ WhatsApp/Telegram rich preview

---

## 🚀 Performance Optimizations

### 1. Route-Based Code Splitting (Future)

```jsx
import { lazy, Suspense } from "react";

const TripView = lazy(() => import("./components/TripView"));

<Suspense fallback={<LoadingSpinner />}>
  <Route path="/trip/:cityId" element={<TripView />} />
</Suspense>;
```

**Benefits:**

- LandingPage loads instantly (small bundle)
- TripView loads on-demand (lazy)
- Faster initial page load

### 2. Prefetching (Future)

```jsx
<Link
  to="/trip/lisbon"
  onMouseEnter={() => prefetch(mockTrips.lisbon)}
>
```

**Hover = start loading data** (iOS-like)

---

## 🧪 Testing Scenarios

### Test 1: Direct URL Access

1. ✅ Open `http://localhost:5173/trip/lisbon` in new tab
2. ✅ Page loads directly to Lisbon itinerary
3. ✅ No flash of landing page

### Test 2: Browser Back Button

1. ✅ Navigate: `/` → `/explore` → `/trip/krakow`
2. ✅ Press back → Returns to `/explore`
3. ✅ Press back → Returns to `/`
4. ✅ Press forward → Returns to `/explore`

### Test 3: Refresh on Dynamic Route

1. ✅ Navigate to `/trip/lisbon`
2. ✅ Press F5 (refresh)
3. ✅ Page reloads with same content (no 404)

### Test 4: Invalid City ID

1. ✅ Manually type `/trip/tokyo` in URL
2. ✅ See "Trip not found" message
3. ✅ Click "Explore Destinations"
4. ✅ Navigate to `/explore`

### Test 5: Scroll Position

1. ✅ Navigate to `/trip/lisbon`
2. ✅ Scroll to Day 3 activities
3. ✅ Click back → Returns to `/explore` at **top** (scroll reset)
4. ✅ Navigate to `/trip/krakow` → Starts at **top**

### Test 6: Share Link

1. ✅ Copy URL: `http://localhost:5173/trip/krakow`
2. ✅ Send to friend
3. ✅ Friend opens link → See Kraków trip directly

---

## 🍎 Apple Design Principles

### 1. **Clarity**

- URLs are human-readable (`/trip/lisbon`, not `/t/123`)
- Route structure is predictable
- 404 page is helpful, not cryptic

### 2. **Deference**

- Scroll resets instantly (no jarring smooth scroll)
- Page transitions are subtle (opacity only)
- Browser controls work as expected (back/forward)

### 3. **Consistency**

- All routes follow `/resource/:id` pattern
- All pages have same enter/exit animations
- Scroll behavior is uniform across routes

---

## 🔮 Future Enhancements

### 1. Query Parameters

```jsx
/trip/lisbon?day=2&mood=adventure&filter=eco
```

**Use cases:**

- Deep link to specific day
- Pre-filter activities
- Share exact view state

### 2. Hash Navigation (Scroll to Activity)

```jsx
/trip/lisbon#day-2-activity-kazimierz
```

**Scroll to specific activity on load**

### 3. Breadcrumb Navigation

```jsx
Home > Explore > Lisbon Trip > Day 2
```

**Apple-like trail navigation**

### 4. Route Transitions

```jsx
// Slide left/right based on navigation direction
const direction = historyDirection(); // "forward" | "back"

<motion.div
  initial={{ x: direction === "forward" ? 100 : -100 }}
  animate={{ x: 0 }}
  exit={{ x: direction === "forward" ? -100 : 100 }}
/>;
```

### 5. Preload on Hover

```jsx
<Link
  to="/trip/lisbon"
  onMouseEnter={() => {
    // Start loading Lisbon images
    preloadImages(mockTrips.lisbon.days);
  }}
>
```

---

## 📚 Technical Reference

### React Router v6 Key Features

- **`BrowserRouter`**: HTML5 history API (clean URLs)
- **`Routes`**: Replaces `Switch` (v5)
- **`Route`**: Define path-component mapping
- **`useNavigate`**: Programmatic navigation
- **`useParams`**: Extract URL parameters
- **`useLocation`**: Access current location + state

### Framer Motion Integration

- **`AnimatePresence`**: Handle exit animations
- **`mode="wait"`**: Sequential transitions (not simultaneous)
- **`key={location.pathname}`**: Trigger animation on route change

---

## 🎯 Key Takeaways

1. ✅ **Deep linking works** - `/trip/lisbon` loads directly
2. ✅ **Browser history works** - back/forward buttons
3. ✅ **Scroll resets on route change** - clean slate
4. ✅ **404 handled gracefully** - friendly error page
5. ✅ **SEO-ready** - meta tags for social sharing
6. ✅ **Smooth transitions** - Framer Motion + AnimatePresence
7. ✅ **Mobile-friendly** - iOS Safari theme-color
8. ✅ **Type-safe params** - `useParams<{ cityId: string }>`

**Result**: Professional, shareable, Apple-level routing. 🚀

---

**Built with ❤️ for Triply**  
_Deep links, smooth transitions, delightful UX_
