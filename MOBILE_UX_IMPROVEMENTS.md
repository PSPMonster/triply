# 📱 Mobile UX Improvements

## Overview

Enhanced mobile experience with iOS-inspired interactions:

1. **Scroll Snap Behavior** - Hero must collapse before content scrolling
2. **Auto-Scroll to Vibe** - Smooth navigation after destination selection
3. **Haptic-Like Feedback** - Pulsating glow + scale animations

---

## 1️⃣ iOS-Style Scroll Snap (Mobile Only)

### Problem

On mobile, fast finger scrolling could make users accidentally skip the first activity because Hero collapses quickly.

### Solution

```css
/* Mobile only (≤768px) */
@media (max-width: 768px) {
  .tripView {
    scroll-snap-type: y proximity;
  }

  .dayTabs {
    scroll-snap-align: start;
    scroll-snap-stop: always;
  }
}
```

### How It Works

1. **Snap Container**: `.tripView` becomes scroll snap container
2. **Snap Point**: `.dayTabs` is the target - scroll "sticks" here
3. **Proximity Mode**: Gentle snap (not mandatory) - iOS Safari behavior
4. **Desktop Exemption**: Tablets/desktops scroll freely (better mouse UX)

### User Experience

```
User scrolls down fast on iPhone:
  ↓
Hero collapses (0-200px)
  ↓
Scroll "magnetically" snaps to Day Tabs
  ↓
First activity is ALWAYS visible ✓
```

**Inspiration**: iOS Safari address bar, Apple Maps snap points

---

## 2️⃣ Auto-Scroll to Vibe Section

### Problem

After selecting destination, vibe section appeared but user had to manually scroll to see it.

### Solution

```jsx
const moodSectionRef = useRef(null);

useEffect(() => {
  if (showMoodSection && moodSectionRef.current) {
    setTimeout(() => {
      moodSectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center", // Center in viewport
        inline: "nearest",
      });
    }, 300); // Wait for slide-up animation to start
  }
}, [showMoodSection]);
```

### Timing Breakdown

```
0ms    - User clicks "Lisbon"
        ↓
400ms  - showMoodSection = true (setState)
        ↓
700ms  - Vibe section starts sliding up (initial animation)
        ↓
1000ms - Auto-scroll begins (300ms after setState)
        ↓
1500ms - Vibe section centered in viewport
        ↓
∞      - Pulsating glow animation continues
```

### Why 300ms Delay?

- Too early (0ms): Scrolls to empty space (section not rendered yet)
- Just right (300ms): Section is mid-slide, scroll feels synchronized
- Too late (800ms): Jarring - section already visible, then scrolls

**Inspiration**: Apple Store product selector, iOS Settings sub-menus

---

## 3️⃣ Haptic-Like Visual Feedback

### A) Pulsating Glow Effect

```css
@keyframes pulseGlow {
  0%,
  100% {
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1), 0 0 0 3px var(--mood-color),
      0 0 20px rgba(0, 122, 255, 0.3);
  }
  50% {
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15), 0 0 0 4px var(--mood-color),
      0 0 40px rgba(0, 122, 255, 0.5);
  }
}

.moodCard.selectedMood {
  animation: pulseGlow 2s ease-in-out infinite;
}
```

**Effect Layers**:

1. **Base shadow**: `0 8px 24px` - card elevation
2. **Border ring**: `0 0 0 3px` - solid outline (grows to 4px)
3. **Glow halo**: `0 0 20px` - soft ambient light (grows to 40px)

**Inspiration**: Apple Watch activity rings, iOS Focus mode glow

---

### B) Scale Pulse Animation

```jsx
<motion.button
  animate={{
    scale: selectedMood === mood.id ? [1, 1.08, 1] : 1,
  }}
  transition={{
    scale: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
  }}
  whileTap={{ scale: 0.95 }}
/>
```

**Animation Sequence**:

```
User taps "Relax" card:
  ↓
1.0 → 1.08 (150ms) - Quick expand
  ↓
1.08 → 1.0 (150ms) - Gentle settle
  ↓
Pulsating glow starts (infinite)
```

**Inspiration**: Apple Watch haptic tap feedback, iOS button press

---

### C) Title Slide-In

```jsx
<motion.h2
  initial={{ opacity: 0, x: -20 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ delay: 0.2, duration: 0.5 }}
>
  What's your travel mood?
</motion.h2>
```

**Why Slide From Left?**

- Reading direction (Western languages)
- Implies "progression" (destination → mood)
- Matches iOS navigation transitions

---

## 🎯 Complete User Journey

### Desktop Flow (Smooth, Unrestricted)

```
1. Click "Lisbon" card
   - Card scales up briefly
   ↓
2. 400ms delay
   ↓
3. Vibe section slides up from bottom (y: 40 → 0)
   ↓
4. Auto-scroll centers vibe section
   - smooth, duration ~500ms
   ↓
5. Title fades in from left (x: -20 → 0)
   ↓
6. Mood cards stagger in (80ms intervals)
   ↓
7. Click "Relax"
   - Scale pulse: 1 → 1.08 → 1
   - Pulsating glow starts (infinite 2s loop)
   ↓
8. "Create My Journey" button fades in
```

### Mobile Flow (Snap-Enhanced)

```
1. Tap "Lisbon" card
   ↓
2-7. [Same as desktop]
   ↓
8. Navigate to TripView
   ↓
9. Hero is full height (800px)
   ↓
10. User scrolls down naturally
   ↓
11. Hero collapses (800px → 120px)
   ↓
12. Scroll SNAPS to Day Tabs ← NEW!
   - Magnetic effect, prevents over-scroll
   ↓
13. First activity always visible
```

---

## 📐 Technical Details

### Scroll Snap Calculations

**Snap Type**: `proximity` (not `mandatory`)

- **Mandatory**: Forces snap always - can feel "sticky" and unnatural
- **Proximity**: Snaps only when close - iOS Safari behavior

**Snap Align**: `start`

- Day Tabs align to top of viewport (below fixed header)

**Snap Stop**: `always`

- Prevents "scroll through" on fast swipes
- User must deliberately scroll again to continue

### Performance Considerations

**GPU Acceleration**:

```css
.moodCard.selectedMood {
  will-change: transform, box-shadow;
  /* Hint browser to optimize animations */
}
```

**Animation Frame Budget**:

- Pulse glow: 2s duration = 0.5 FPS (very light)
- Scale animation: 0.3s = runs once per selection
- Auto-scroll: native browser API (optimized)

**Mobile Optimization**:

- Scroll snap only on `max-width: 768px`
- Reduces layout recalculations on large screens
- Touch-first interaction model

---

## 🍎 Apple Design Principles

### 1. **Deference**

- Animations guide attention, don't distract
- Scroll snap helps (doesn't force)
- Glow is subtle (not flashy)

### 2. **Clarity**

- Auto-scroll ensures user sees next step
- Pulsating glow confirms selection
- Snap prevents confusion (content always aligned)

### 3. **Depth**

- Glow creates Z-axis illusion (card "floats")
- Scale pulse mimics physical button press
- Smooth scroll has acceleration curve

### 4. **Feedback**

- Immediate visual response (tap → scale)
- Continuous feedback (pulsating glow)
- Predictable behavior (snap points are consistent)

---

## 🧪 Testing Checklist

### Desktop

- [ ] Click Lisbon → Vibe section slides up
- [ ] Auto-scroll centers vibe section smoothly
- [ ] Click "Relax" → Scale pulse (1→1.08→1)
- [ ] Selected card has pulsating glow (2s loop)
- [ ] No scroll snap (free scrolling in TripView)

### Mobile (≤768px)

- [ ] Tap Lisbon → Vibe section slides up
- [ ] Auto-scroll works on touch devices
- [ ] Tap "Culture" → Haptic-like scale + glow
- [ ] Navigate to TripView
- [ ] Fast swipe down → Hero collapses → Snaps to Day Tabs
- [ ] First activity visible (not skipped)

### Edge Cases

- [ ] Select destination, then change → Vibe section updates
- [ ] Fast scroll on mobile → Snap still works
- [ ] Slow scroll on mobile → No snap (proximity mode)
- [ ] Tablet (769px+) → No snap, free scroll

---

## 🎨 Visual Design Specs

### Glow Colors by Mood

```css
Relax:     #93C5FD (Soft Blue)
Culture:   #C4B5FD (Gentle Purple)
Adventure: #FCA5A5 (Warm Coral)
```

### Shadow Progression

```
Normal card:      0 4px 12px rgba(0,0,0,0.08)
Hover:           0 8px 24px rgba(0,0,0,0.10)
Selected (min):  0 8px 24px + 0 0 20px glow
Selected (max):  0 12px 32px + 0 0 40px glow
```

### Animation Timings

```
Scale pulse:     0.3s  (Apple standard "quick response")
Glow cycle:      2.0s  (Breathing rhythm)
Auto-scroll:     0.5s  (Natural reading speed)
Slide-up:        0.7s  (Deliberate, not rushed)
```

---

## 🔮 Future Enhancements

### 1. Haptic Feedback (PWA)

```js
if ("vibrate" in navigator) {
  navigator.vibrate(10); // Subtle tap on mood selection
}
```

### 2. Scroll Progress Indicator

```jsx
// Show "swipe up to continue" hint on mobile
const [heroProgress, setHeroProgress] = useState(0);
// Progress bar: 0-200px scroll range
```

### 3. Reduced Motion Support

```css
@media (prefers-reduced-motion: reduce) {
  .moodCard.selectedMood {
    animation: none; /* Disable pulse */
  }

  * {
    scroll-behavior: auto !important;
  }
}
```

---

**Built with ❤️ for Triply**  
_Mobile-first, Apple-inspired, accessible_
