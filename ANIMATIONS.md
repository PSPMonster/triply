# 🎬 Triply Animation Guide

## Apple-Inspired UX Animations

### 🎯 Animation Philosophy

Following Apple's design principles, our animations are:

- **Purposeful** - Every animation serves a UX purpose
- **Subtle** - Never distracting, always enhancing
- **Natural** - Mimics real-world physics
- **Fast** - Responsive, not sluggish (200-600ms)
- **Smooth** - Custom easing curves for fluid motion

---

## 📐 Easing Curves

We use Apple's signature **cubic-bezier(0.4, 0, 0.2, 1)** throughout:

```css
/* Standard Apple Ease */
transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
```

**Why?** This curve feels natural - fast start, smooth deceleration.

---

## 🧭 Universal Header Animations

### 1. **Initial Load**

- **Animation**: Slide down from top
- **Duration**: 600ms
- **Easing**: Cubic bezier (0.4, 0, 0.2, 1)
- **Purpose**: Welcomes user without jarring

```jsx
initial={{ y: -100, opacity: 0 }}
animate={{ y: 0, opacity: 1 }}
transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
```

### 2. **Scroll-Triggered Title**

- **Trigger**: User scrolls past 100px
- **Animation**: Fade in + slight upward movement
- **Duration**: 300ms
- **Purpose**: Contextual info (city name) appears when hero is hidden

```jsx
// Opacity: 0 → 1 (between 80-120px scroll)
const titleOpacity = useTransform(scrollY, [80, 120], [0, 1]);
// Y position: 10px → 0px
const titleY = useTransform(scrollY, [80, 120], [10, 0]);
```

**User feels**: Seamless transition, no jarring pop-ins

### 3. **Back Button Hover**

- **Animation**: Shift left 4px
- **Duration**: 200ms
- **Purpose**: Visual feedback, invites click

```jsx
whileHover={{ x: -4, transition: { duration: 0.2 } }}
```

### 4. **Glassmorphism Effect**

- **Effect**: Frosted glass background
- **Purpose**: Content behind header remains subtly visible
- **Apple signature**: `backdrop-filter: saturate(180%) blur(20px)`

---

## 🏔️ Hero Section Animations

### 1. **Parallax Scroll**

- **Effect**: Hero moves slower than page scroll (32% speed)
- **Range**: 0-250px scroll → 0-80px movement
- **Purpose**: Depth perception, premium feel

```jsx
const heroY = useTransform(scrollY, [0, 250], [0, -80]);
```

**User feels**: Immersive, 3D-like depth

### 2. **Dynamic Height Collapse** ⭐ NEW

- **Problem**: Empty space remains when content fades out
- **Solution**: Hero shrinks smoothly from ~400px to 0px
- **Range**: 0-200px scroll
- **Method**: `maxHeight` transform (better than `scaleY`)

```jsx
const heroMaxHeight = useTransform(
  scrollY,
  [0, 100, 200],
  ["800px", "200px", "0px"]
);
```

**Why maxHeight?**

- Natural collapse (content flows up)
- No distortion (unlike `scaleY`)
- Smooth with padding animation
- iOS Safari-inspired

**User feels**: Content seamlessly transitions to activities, no awkward gaps

### 3. **Content Fade & Scale**

- **Opacity**: 1 → 0.5 → 0 (0-120-180px scroll)
- **Scale**: 1 → 0.92 (0-180px scroll)
- **Purpose**: Smooth disappearance with depth effect

```jsx
const contentOpacity = useTransform(scrollY, [0, 120, 180], [1, 0.5, 0]);
const contentScale = useTransform(scrollY, [0, 180], [1, 0.92]);
```

**Three-stage fade**: Ensures content is invisible before hero collapses

### 4. **Padding Compression**

- **Top padding**: `64px + 3rem` → `64px + 1rem` → `0px`
- **Bottom padding**: `3rem` → `1.5rem` → `0px`
- **Range**: 0-120-180px scroll
- **Purpose**: Smooth vertical collapse

```jsx
const heroPaddingTop = useTransform(
  scrollY,
  [0, 120, 180],
  ["calc(64px + 3rem)", "calc(64px + 1rem)", "0px"]
);
```

**Result**: No sudden jumps, buttery smooth transition

### 5. **Staggered Entry**

- **Title**: Appears first (delay: 200ms)
- **Tagline**: Follows (delay: 400ms)
- **Meta cards**: Last (delays: 500ms, 600ms, 700ms)
- **Purpose**: Guides eye naturally, tells a story

```jsx
transition={{ duration: 0.8, delay: 0.2 }}  // Title
transition={{ duration: 0.6, delay: 0.4 }}  // Tagline
transition={{ duration: 0.4, delay: 0.5 }}  // Card 1
```

### 6. **Meta Card Hover**

- **Animation**: Scale 1 → 1.05
- **Duration**: 200ms
- **Purpose**: Playful interactivity without being clickable

---

## 🎓 Hero Collapse Philosophy

### Why This Approach Works

**Problem Solved:**
When hero content fades out (opacity → 0), empty white space remained, creating an awkward gap between header and day tabs.

**Apple-Inspired Solution:**
Dynamic height compression inspired by iOS Safari's address bar behavior:

1. **Progressive Collapse**: Hero doesn't disappear instantly—it shrinks gradually
2. **Multi-layered Animation**:
   - Content fades first (0-180px)
   - Padding compresses simultaneously
   - Height collapses last (0-200px)
3. **No Distortion**: Using `maxHeight` instead of `scaleY` prevents content squishing
4. **Smooth Transition**: Three breakpoints (0, 100, 200px) ensure no sudden jumps

**UX Benefits:**

- ✅ No wasted vertical space
- ✅ Seamless flow to content below
- ✅ Users don't notice the transition (it just "feels right")
- ✅ Matches iOS native app behavior

**Technical Excellence:**

```jsx
// Three synchronized transforms:
maxHeight: 800px → 200px → 0px    // Container shrinks
opacity: 1 → 0.5 → 0              // Content fades
padding: 3rem → 1.5rem → 0px      // Space compresses
```

**Timing Strategy:**

- Content becomes invisible at 180px scroll
- Hero fully collapses at 200px scroll
- 20px buffer prevents flickering

---

## 📅 Day Tabs Animations

### 1. **Hover Effect**

- **Animation**: Lift up 2px
- **Duration**: Fast (implicit in Framer Motion)
- **Purpose**: Affordance - shows it's clickable

```jsx
whileHover={{ y: -2 }}
```

### 2. **Tap Feedback**

- **Animation**: Scale 0.98
- **Purpose**: Tactile feedback, confirms interaction

```jsx
whileTap={{ scale: 0.98 }}
```

### 3. **Active State**

- **Animation**: None (instant)
- **Visual**: Border color change + shadow
- **Purpose**: Clear state indication

---

## 🎴 Activity Card Animations

### 1. **Initial Load (Staggered)**

- **Animation**: Fade in + slide up + scale
- **Stagger**: 80ms between cards
- **Duration**: 500ms per card
- **Purpose**: Progressive disclosure, less overwhelming

```jsx
initial={{ opacity: 0, y: 20, scale: 0.95 }}
animate={{ opacity: 1, y: 0, scale: 1 }}
transition={{
  delay: index * 0.08,
  duration: 0.5,
  ease: [0.4, 0, 0.2, 1]
}}
```

**Why stagger?**

- Draws attention sequentially
- Feels more natural than all-at-once
- Apple uses this in App Store, Settings, etc.

### 2. **Hover Effect**

- **Animation**: Scale 1 → 1.02
- **Duration**: 200ms
- **Shadow**: Soft → stronger
- **Purpose**: Lift effect, invites exploration

```jsx
whileHover={{
  scale: 1.02,
  transition: { duration: 0.2 }
}}
```

**Detail**: We use scale instead of translateY for better performance (GPU-accelerated)

### 3. **Image Zoom on Hover**

- **Animation**: Image scales 1 → 1.08 inside container (overflow hidden)
- **Duration**: 600ms (slower than card for smoothness)
- **Purpose**: Ken Burns effect, adds life

```css
.activityImage img {
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}
.activityCard:hover .activityImage img {
  transform: scale(1.08);
}
```

### 4. **Click/Tap Feedback**

- **Animation**: Scale 0.98
- **Purpose**: Tactile, responsive

```jsx
whileTap={{ scale: 0.98 }}
```

### 5. **Selected State**

- **Animation**: Smooth border color transition
- **Duration**: 300ms
- **Purpose**: Clear visual feedback

---

## 📊 Summary Panel Animations

### 1. **Initial Fade In**

- **Animation**: Opacity + Y translate
- **Delay**: 300ms (after first activity card)
- **Purpose**: Appears naturally, not competing for attention

```jsx
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ delay: 0.3 }}
```

### 2. **Sticky Behavior**

- **Animation**: None (uses CSS position: sticky)
- **Purpose**: Always accessible while scrolling
- **Note**: Top position adjusts based on header + tabs height

---

## 🎨 Color Transitions

All color changes use smooth transitions:

```css
transition: box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.3s
    cubic-bezier(0.4, 0, 0.2, 1), background 0.3s cubic-bezier(0.4, 0, 0.2, 1);
```

**Applies to:**

- Border colors on hover
- Shadow intensity
- Background colors

---

## ⚡ Performance Optimizations

### 1. **GPU Acceleration**

We use `transform` and `opacity` (GPU-accelerated) instead of:

- `top`, `left`, `right`, `bottom` (CPU)
- `width`, `height` (causes reflow)

### 2. **Will-Change Hint**

```css
.activityCard {
  will-change: transform;
}
```

Tells browser to optimize for transform animations.

### 3. **Reduced Motion Support** (Future Enhancement)

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 📱 Responsive Adjustments

### Mobile

- **Faster animations**: 200-300ms (vs 300-600ms desktop)
- **Simpler effects**: Less parallax, fewer transforms
- **Touch feedback**: Tap animations more prominent

### Tablet

- **Mid-range**: Balanced between mobile/desktop

---

## 🎭 Animation Timing Reference

| Element                   | Duration | Delay        | Scroll Range | Easing |
| ------------------------- | -------- | ------------ | ------------ | ------ |
| **Header Initial**        | 600ms    | 0            | -            | Cubic  |
| **Header Title (scroll)** | 300ms    | 0            | 80-120px     | Cubic  |
| **Hero Collapse**         | Dynamic  | 0            | 0-200px      | Cubic  |
| **Hero Content Fade**     | Dynamic  | 0            | 0-180px      | Cubic  |
| **Hero Parallax**         | Dynamic  | 0            | 0-250px      | Cubic  |
| **Hero Title**            | 800ms    | 200ms        | -            | Cubic  |
| **Hero Tagline**          | 600ms    | 400ms        | -            | Cubic  |
| **Meta Cards**            | 400ms    | 500-700ms    | -            | Cubic  |
| **Day Tabs Hover**        | Instant  | 0            | -            | Cubic  |
| **Activity Cards**        | 500ms    | 80ms × index | -            | Cubic  |
| **Activity Hover**        | 200ms    | 0            | -            | Cubic  |
| **Image Zoom**            | 600ms    | 0            | -            | Cubic  |
| **Summary Panel**         | 600ms    | 300ms        | -            | Cubic  |

---

## 🔄 Animation Flow (User Journey)

```
1. Page loads
   ├─ Header slides down (600ms)
   └─ Hero fades in
       ├─ Title appears (800ms, delay 200ms)
       ├─ Tagline appears (600ms, delay 400ms)
       └─ Meta cards stagger (400ms each, 100ms apart)

2. User scrolls down (0-50px)
   ├─ Hero starts parallax movement
   ├─ Content begins to fade (opacity 1 → 0.9)
   └─ Padding starts compressing

3. User scrolls (50-120px)
   ├─ Hero height reduces (800px → 200px)
   ├─ Content continues fading (opacity 0.9 → 0.5)
   ├─ Header title starts appearing (80px+)
   └─ Parallax continues

4. User scrolls (120-180px)
   ├─ Content fully fades (opacity 0.5 → 0)
   ├─ Padding minimizes
   └─ City name fully visible in header

5. User scrolls (180-200px)
   ├─ Hero collapses to 0px height
   └─ Day tabs move up smoothly (no gap)

6. Day tabs become sticky
   └─ User hovers → lifts 2px

7. Activities load
   └─ Stagger in (500ms each, 80ms apart)

8. User hovers activity
   ├─ Card scales up (1.02, 200ms)
   └─ Image zooms (1.08, 600ms)

9. User clicks activity
   └─ Tap feedback (scale 0.98)
```

**Key Insight**: Hero collapse happens in 3 stages (0-120-180px), ensuring smooth visual flow without awkward gaps.

---

## 💡 Apple-Inspired Principles Applied

### 1. **Deference**

- Animations never overshadow content
- Subtle, not showy
- User focuses on trip info, not effects

### 2. **Clarity**

- Every animation has a purpose
- State changes are obvious (hover, selected, etc.)
- No confusion about what's interactive

### 3. **Depth**

- Parallax creates layers
- Shadows suggest elevation
- Scale transforms imply Z-axis movement

### 4. **Feedback**

- Hover states confirm interactivity
- Tap animations acknowledge input
- Smooth transitions prevent jarring

### 5. **Consistency**

- Same easing curve throughout
- Predictable timing (200ms, 300ms, 600ms)
- Unified animation language

---

## 🚀 Future Enhancements

### Planned Animations

1. **Confetti on Trip Creation**

   - Celebration moment
   - Framer Motion's confetti component

2. **Route Drawing Animation**

   - When adding maps (Mapbox)
   - SVG path animation

3. **Progress Indicator**

   - Scroll progress bar
   - Shows position in itinerary

4. **Micro-interactions**

   - Button ripples
   - Success checkmarks
   - Loading skeletons

5. **Page Transitions**
   - Between Landing → Selector → Trip
   - Shared element transitions

---

## 🧪 Testing Animations

### Checklist

- [ ] Smooth at 60fps (no jank)
- [ ] Works on slow devices (test on older phones)
- [ ] No layout shifts (animations don't affect page flow)
- [ ] Feels natural (not too fast/slow)
- [ ] Consistent across browsers
- [ ] Respects `prefers-reduced-motion`

### Tools

- **Chrome DevTools**: Performance tab, FPS meter
- **React DevTools**: Component render tracking
- **Framer Motion DevTools**: Animation inspector (future)

---

## 📚 References

- [Apple Human Interface Guidelines - Motion](https://developer.apple.com/design/human-interface-guidelines/motion)
- [Framer Motion Docs](https://www.framer.com/motion/)
- [Material Design Motion](https://m3.material.io/styles/motion/overview)
- [Web Animation API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API)

---

**Remember**: The best animation is one you don't notice. It just feels right.

_– Apple Design Philosophy_
