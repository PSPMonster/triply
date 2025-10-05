# 🔄 Hero Collapse: Problem & Solution

## 📊 Before & After Comparison

### ❌ BEFORE (Problem)

```
┌─────────────────────────────────┐
│         Header (64px)           │ ← Sticky
├─────────────────────────────────┤
│                                 │
│        Hero Section             │
│   City: "Lisbon"                │
│   Tagline: "Breathe..."         │
│                                 │
│   [Duration] [Eco] [Stress]    │ ← Meta cards
│                                 │
└─────────────────────────────────┘

        User scrolls ↓

┌─────────────────────────────────┐
│    Header + "Lisbon" (64px)     │ ← Sticky, city name appears
├─────────────────────────────────┤
│                                 │
│                                 │
│        EMPTY SPACE              │ ← PROBLEM!
│      (Meta cards faded)         │    White gap remains
│                                 │
│                                 │
└─────────────────────────────────┘
│        Day Tabs                 │ ← Stuck below gap
└─────────────────────────────────┘
│      Activity Cards             │
```

**Issues:**

- 🔴 ~200px of wasted vertical space
- 🔴 Awkward gap between header and tabs
- 🔴 Breaks visual flow
- 🔴 Feels unpolished, amateurish

---

### ✅ AFTER (Solution)

```
┌─────────────────────────────────┐
│         Header (64px)           │ ← Sticky
├─────────────────────────────────┤
│                                 │
│        Hero Section             │
│   City: "Lisbon"                │
│   Tagline: "Breathe..."         │
│                                 │
│   [Duration] [Eco] [Stress]    │ ← Meta cards
│                                 │
└─────────────────────────────────┘

        User scrolls ↓
        (0-120px)

┌─────────────────────────────────┐
│    Header + "Lisbon" (64px)     │ ← Sticky, city name appearing
├─────────────────────────────────┤
│      Hero (shrinking)           │
│   City: "Lisbon" (fading)       │ ← Opacity 1 → 0.5
│                                 │ ← Height 800px → 200px
│   [Fading cards]                │ ← Padding compressing
└─────────────────────────────────┘

        User scrolls ↓
        (120-180px)

┌─────────────────────────────────┐
│  Header + "Lisbon" (64px) ✓     │ ← Sticky, city fully visible
├─────────────────────────────────┤
│   Hero (tiny, invisible)        │ ← Opacity 0, height → 50px
└─────────────────────────────────┘

        User scrolls ↓
        (180-200px)

┌─────────────────────────────────┐
│  Header + "Lisbon" (64px) ✓     │ ← Sticky
├─────────────────────────────────┤ ← NO GAP!
│        Day Tabs                 │ ← Seamless flow
└─────────────────────────────────┘
│      Activity Cards             │
```

**Improvements:**

- ✅ Zero wasted space
- ✅ Seamless transition
- ✅ Professional, iOS-like polish
- ✅ Content flows naturally

---

## 🎬 Animation Breakdown

### Stage 1: Subtle Start (0-50px scroll)

```
Height:  800px → 700px     (gradual)
Opacity: 1.0 → 0.95        (barely noticeable)
Padding: 3rem → 2.7rem     (slight compression)
```

**User feels:** Natural, imperceptible start

---

### Stage 2: Active Collapse (50-120px scroll)

```
Height:  700px → 200px     (accelerated)
Opacity: 0.95 → 0.5        (visible fade)
Padding: 2.7rem → 1.5rem   (noticeable shrink)
Parallax: -20px → -50px    (depth enhances)
```

**User feels:** Content is deliberately disappearing

---

### Stage 3: Final Fade (120-180px scroll)

```
Height:  200px → 50px      (rapid collapse)
Opacity: 0.5 → 0.0         (fully invisible)
Padding: 1.5rem → 0rem     (complete compression)
```

**User feels:** Hero is gone, ready for content

---

### Stage 4: Complete Removal (180-200px scroll)

```
Height:  50px → 0px        (final squeeze)
Opacity: 0.0               (already invisible)
Padding: 0rem              (already compressed)
```

**User feels:** Nothing—perfect! Transition complete.

---

## 🔬 Technical Deep Dive

### Why `maxHeight` Instead of `scaleY`?

#### ❌ `scaleY` Approach (Bad)

```jsx
scaleY: heroScale,  // 1 → 0
transformOrigin: 'top'
```

**Problems:**

- Content gets squished vertically (looks distorted)
- Text becomes unreadable mid-scroll
- Images stretch weirdly
- Feels janky, not natural

#### ✅ `maxHeight` Approach (Good)

```jsx
maxHeight: heroMaxHeight,  // 800px → 0px
```

**Benefits:**

- Content maintains aspect ratio
- Natural "accordion" collapse
- Browser handles overflow elegantly
- Matches native iOS behavior

---

### Why Three Breakpoints (0, 120, 180px)?

#### Single Breakpoint (Bad)

```jsx
const heroHeight = useTransform(scrollY, [0, 200], [800, 0]);
```

- Linear collapse feels mechanical
- No easing control
- Abrupt at start/end

#### Three Breakpoints (Good)

```jsx
const heroHeight = useTransform(scrollY, [0, 100, 200], [800, 200, 0]);
```

- Creates natural S-curve (slow → fast → slow)
- Mimics real-world physics
- Apple's signature "ease in-ease out"

**Visualization:**

```
Height
800px │●
      │ ╲
      │  ╲
      │   ╲      ← Gentle start
600px │    ╲
      │     ●
      │      ╲╲
      │        ╲╲  ← Fast middle
400px │          ╲╲
      │            ●
      │             ╲
      │              ╲ ← Gentle end
200px │               ●
      │                ╲
0px   │                 ●────────
      └─────────────────────────────
      0    50   100   150   200  scroll (px)
```

---

## 🎯 Scroll Range Strategy

### Why Content Fades BEFORE Hero Collapses?

**Timing:**

- Content opacity: 0-180px (fully invisible at 180px)
- Hero height: 0-200px (fully collapsed at 200px)

**20px buffer (180-200px):**

- Prevents "flickering" (content visible during collapse)
- Ensures smooth visual flow
- User never sees half-faded content in shrinking container

**Alternative (Bad):**

```jsx
// If both ended at same time (200px):
contentOpacity: [0, 200], [1, 0]; // Fades simultaneously
heroMaxHeight: [0, 200], [800, 0]; // Collapses simultaneously
// Result: User sees ghostly, squished content → janky!
```

---

## 📐 Padding Compression Math

### Why Synchronized Padding Reduction?

**Without padding compression:**

```
Hero shrinks, but padding stays → content "floats" → looks broken
```

**With synchronized padding:**

```
Hero: 800px → 0px     (4x reduction)
Padding: 3rem → 0px   (4x reduction)
Result: Content stays proportionally positioned ✓
```

**Formula:**

```
Padding % at scroll X = (1 - X/180) × 100%

At 0px:   (1 - 0/180)   = 100% → 3rem
At 90px:  (1 - 90/180)  = 50%  → 1.5rem
At 180px: (1 - 180/180) = 0%   → 0rem
```

---

## 🍎 Apple Design Principles Applied

### 1. Deference

- Hero doesn't compete with content—it gets out of the way
- Collapse is subtle, not attention-grabbing

### 2. Clarity

- City name appears in header as hero disappears
- User always knows where they are (context preserved)

### 3. Depth

- Parallax effect creates Z-axis illusion
- Multi-layered fade (content → padding → container)

### 4. Feedback

- Smooth, predictable motion (no surprises)
- User controls pace via scroll speed

### 5. Consistency

- Matches iOS Safari, Apple Music hero behaviors
- Familiar pattern, reduced cognitive load

---

## 🧪 A/B Testing Results (Hypothetical)

| Metric                  | Before | After  | Improvement    |
| ----------------------- | ------ | ------ | -------------- |
| Time to first activity  | 3.2s   | 2.1s   | **34% faster** |
| Scroll depth            | 65%    | 82%    | **26% deeper** |
| "Feels polished" rating | 6.8/10 | 9.1/10 | **34% higher** |
| Perceived performance   | 7.2/10 | 9.3/10 | **29% better** |

---

## 🔮 Future Enhancements

### Potential Improvements:

1. **Scroll Velocity Dampening**

   ```jsx
   // Slow down collapse if user scrolls fast
   const velocity = scrollY.getVelocity();
   const dampFactor = Math.min(velocity / 1000, 1);
   ```

2. **Gesture-Based Expansion**

   ```jsx
   // Pull down to re-expand hero (iOS Safari style)
   onPanDown={() => expandHero()}
   ```

3. **Reduced Motion Support**

   ```css
   @media (prefers-reduced-motion: reduce) {
     .hero {
       transition: none;
       max-height: 0; /* Skip animation */
     }
   }
   ```

4. **Blur Effect on Collapse**
   ```jsx
   const heroBlur = useTransform(scrollY, [0, 200], [0, 10]);
   // backdrop-filter: blur(heroBlur)
   ```

---

## 📚 References

- [Apple HIG - Motion](https://developer.apple.com/design/human-interface-guidelines/motion)
- [iOS Safari Address Bar Behavior](https://webkit.org/blog/8450/ios-safari-scrolling-improvements/)
- [Framer Motion - useTransform](https://www.framer.com/motion/use-transform/)
- [Material Design - Navigation Transitions](https://m3.material.io/styles/motion/transitions)

---

## 💡 Key Takeaways

1. **Empty space is wasted opportunity**

   - Every pixel should serve user's journey

2. **Multi-layered animations feel natural**

   - Single transforms feel mechanical

3. **Content should fade before container**

   - Prevents flickering and visual glitches

4. **iOS is the gold standard**

   - Users are trained by Apple's native behaviors

5. **Smooth > flashy**
   - User shouldn't notice the animation—just feel it

---

**Built with ❤️ for Triply**  
_Because great UX is invisible UX_
