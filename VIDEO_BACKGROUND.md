# 🎬 Background Video Implementation - Triply Landing Page

## Overview

Subtle, Apple-like looping background video on the landing page hero section with advanced text legibility optimizations and responsive design.

---

## 🎯 Design Philosophy

### Apple-Inspired Principles

1. **Subtle Motion** - Video is secondary to content, not distracting
2. **Perfect Legibility** - Multi-layer overlay ensures text is always readable
3. **Performance First** - Optimized for mobile, respects user preferences
4. **Graceful Degradation** - Falls back to gradient if video fails

---

## 📐 Technical Implementation

### Video Element

```jsx
<video
  autoPlay
  loop
  muted
  playsInline
  preload="auto"
  className={styles.heroVideo}
  poster="/assets/video-poster.jpg"
  aria-hidden="true"
>
  <source src="/assets/bg_video.mp4" type="video/mp4" />
</video>
```

**Attributes Explained**:

- `autoPlay` - Starts automatically on page load
- `loop` - Infinite playback (no jarring restart)
- `muted` - Required for autoplay on most browsers
- `playsInline` - Prevents fullscreen on iOS
- `preload="auto"` - Loads video immediately for instant playback
- `poster` - Fallback image while video loads
- `aria-hidden="true"` - Hides from screen readers (decorative)

---

## 🎨 Visual Optimizations

### 1. Brightness & Blur

```css
.heroVideo {
  filter: brightness(1.3) blur(2px);
}
```

**Purpose**:

- `brightness(1.3)` - Lightens video by 30% for better text contrast
- `blur(2px)` - Subtle blur reduces visual noise, focuses attention on text

**Result**: Video feels more like a "texture" than a video - Apple Photos app style

---

### 2. Multi-Layer Overlay

```css
.videoOverlay {
  background: 
    /* Top: subtle white fade */ linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.85) 0%,
      rgba(255, 255, 255, 0.75) 30%,
      rgba(255, 255, 255, 0.8) 70%,
      rgba(255, 255, 255, 0.9) 100%
    ),
    /* Center: frosted glass effect */ radial-gradient(circle at center, rgba(
            255,
            255,
            255,
            0.6
          ) 0%, rgba(249, 250, 251, 0.7) 50%, rgba(243, 244, 246, 0.8) 100%);

  backdrop-filter: blur(8px) saturate(120%);
}
```

**Layer 1: Linear Gradient**

- Vertical fade from 85% → 75% → 80% → 90% opacity
- Ensures text at top and bottom has extra contrast

**Layer 2: Radial Gradient**

- Circular fade from center (60%) → edges (80%)
- Creates "spotlight" effect on hero content

**Layer 3: Backdrop Filter**

- `blur(8px)` - iOS-like frosted glass effect
- `saturate(120%)` - Enhances color vibrancy through overlay

**Inspiration**: Apple.com hero sections, iOS Control Center blur

---

### 3. Smooth Fade-In Animation

```css
@keyframes videoFadeIn {
  0% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(1.05);
  }
  100% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}

.heroVideo {
  animation: videoFadeIn 2s ease-out 0.5s forwards;
}
```

**Animation Breakdown**:

- **0s → 0.5s**: Video hidden (allows hero content to appear first)
- **0.5s → 2.5s**: Video fades in with subtle scale-down (1.05 → 1)
- **2.5s+**: Video fully visible at 100% opacity

**Why Scale 1.05 → 1?**

- Creates "zoom out" effect (Ken Burns micro-movement)
- Adds depth perception
- Prevents jarring pop-in

---

## 📱 Responsive Design

### Mobile Optimizations

```css
@media (max-width: 768px) {
  .heroVideo {
    filter: brightness(1.4) blur(3px);
  }

  .videoOverlay {
    background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.9) 0%,
      rgba(255, 255, 255, 0.85) 50%,
      rgba(255, 255, 255, 0.9) 100%
    );
  }
}
```

**Changes for Mobile**:

1. **Stronger Blur** (2px → 3px)

   - Compensates for smaller screens
   - Reduces bandwidth (less detail = smaller file)
   - Better performance on low-end devices

2. **Denser Overlay** (0.75-0.85 → 0.85-0.9 opacity)
   - Mobile screens are brighter (outdoor use)
   - Ensures text readability in sunlight
   - Prevents battery drain from high brightness

---

## ♿ Accessibility Features

### 1. Reduced Motion Support

```css
@media (prefers-reduced-motion: reduce) {
  .heroVideo {
    display: none;
  }

  .hero {
    background: linear-gradient(135deg, #ffffff, #f9fafb, #f3f4f6);
  }
}
```

**Respects User Preference**:

- Users with vestibular disorders can disable motion
- System setting: iOS "Reduce Motion", Windows "Show animations"
- Fallback to static gradient (no performance penalty)

---

### 2. Reduced Data Mode

```css
@media (prefers-reduced-data) {
  .heroVideo {
    display: none;
  }
}
```

**Bandwidth Consideration**:

- Users on mobile data can opt out of video
- Saves bandwidth and battery
- Progressive enhancement philosophy

---

### 3. Screen Reader Support

```jsx
<video aria-hidden="true">
```

**Why Hidden?**:

- Video is purely decorative (no informational content)
- Screen readers skip it entirely
- Prevents confusion for visually impaired users

---

## 🚀 Performance Optimizations

### 1. Lazy Loading Strategy

```jsx
preload = "auto";
```

**Why "auto" not "none"?**

- Video is above-the-fold (hero section)
- User sees it immediately, so preload is beneficial
- Browser decides optimal loading strategy

---

### 2. Object-Fit Cover

```css
.heroVideo {
  object-fit: cover;
  min-width: 100%;
  min-height: 100%;
}
```

**Ensures**:

- Video always fills container (no black bars)
- Maintains aspect ratio (no distortion)
- Works on any viewport size (16:9, 21:9, portrait, etc.)

---

### 3. GPU Acceleration

```css
.heroVideo {
  will-change: transform, opacity;
  transform: translate(-50%, -50%);
}
```

**will-change Hint**:

- Tells browser to optimize for transforms
- Creates separate GPU layer
- Smooth 60fps playback even during scroll

---

## 📊 Z-Index Layering

```
Hero Section
├─ Layer 0: Video Background (.videoBackground, z-index: 0)
│  └─ <video> element
│
├─ Layer 1: Overlay (.videoOverlay, z-index: 1)
│  └─ Multi-layer gradient + backdrop-filter
│
└─ Layer 10: Content (.heroContent, z-index: 10)
   ├─ Logo
   ├─ Title
   ├─ Tagline
   ├─ Subtitle
   └─ CTA Button
```

**Stacking Context**:

- Video at bottom (z-index: 0)
- Overlay above video (z-index: 1)
- Content on top (z-index: 10)
- Floating icons outside hero (absolute positioning)

---

## 🎥 Video Requirements

### File Specs

**Optimal Settings**:

- **Format**: MP4 (H.264 codec)
- **Resolution**: 1920x1080 (Full HD)
- **Frame Rate**: 24-30 fps
- **Bitrate**: 2-5 Mbps (balance quality/size)
- **Duration**: 10-20 seconds (seamless loop)
- **File Size**: < 5 MB (fast load)

**Compression Tips**:

```bash
# Example FFmpeg command for web optimization
ffmpeg -i input.mp4 \
  -vcodec libx264 \
  -crf 28 \
  -preset slow \
  -vf "scale=1920:1080" \
  -r 24 \
  bg_video.mp4
```

---

### Content Guidelines

**What Works**:

- ✅ Slow motion (clouds, ocean waves, people walking)
- ✅ Subtle movement (no fast pans or zooms)
- ✅ Neutral colors (easily overlayed)
- ✅ Loopable (seamless start/end)

**Avoid**:

- ❌ Fast motion (distracting)
- ❌ Text/logos in video (redundant)
- ❌ High contrast (competes with text)
- ❌ Sudden scene changes

**Inspiration**: Apple Event backgrounds, Airbnb hero videos

---

## 🧪 Testing Checklist

### Desktop

- [ ] Video loads and autoplays
- [ ] Smooth fade-in animation (0.5s delay → 2s fade)
- [ ] Text is readable at all times (no contrast issues)
- [ ] Video loops seamlessly (no flicker)
- [ ] Frosted glass overlay visible (blur + saturation)
- [ ] Hero content centered and responsive

### Mobile (iOS & Android)

- [ ] Video autoplays (muted + playsInline)
- [ ] Stronger blur visible (3px vs 2px desktop)
- [ ] Overlay darker (90% vs 85% desktop)
- [ ] No fullscreen takeover on tap
- [ ] Smooth scroll performance (60fps)
- [ ] Battery usage acceptable (< 5% drain per minute)

### Edge Cases

- [ ] **Slow Connection**: Poster image shows immediately
- [ ] **Video Fails to Load**: Gradient fallback appears
- [ ] **Reduced Motion**: Video hidden, static gradient
- [ ] **Reduced Data**: Video not loaded at all
- [ ] **Safari Private Mode**: Video plays (no restrictions)
- [ ] **Firefox**: backdrop-filter polyfill works

### Performance Metrics

- [ ] **LCP (Largest Contentful Paint)**: < 2.5s
- [ ] **FPS During Scroll**: 60fps (no janks)
- [ ] **Network Usage**: < 5 MB video file
- [ ] **CPU Usage**: < 20% during playback

---

## 🎨 Design Variants

### Light Theme (Current)

```css
/* White/light gray overlay */
rgba(255, 255, 255, 0.85)
brightness(1.3)
blur(2px)
```

**Result**: Video faintly visible, text perfectly readable

---

### Dark Theme (Future)

```css
/* If implementing dark mode */
.videoOverlay {
  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0.7) 0%,
    rgba(0, 0, 0, 0.6) 50%,
    rgba(0, 0, 0, 0.75) 100%
  );
}

.heroVideo {
  filter: brightness(0.7) blur(2px);
}
```

**Changes**:

- Darken video (1.3 → 0.7 brightness)
- Black overlay instead of white
- Still maintains text contrast

---

## 🐛 Troubleshooting

### Video Not Playing

**Check**:

1. File path: `/assets/bg_video.mp4` (must be in `public/assets/`)
2. MIME type: Server returns `video/mp4`
3. Browser console: No CORS errors
4. Format: H.264 codec (Safari requires this)

**Solution**:

```bash
# Verify file exists
ls public/assets/bg_video.mp4

# Test in browser directly
http://localhost:5173/assets/bg_video.mp4
```

---

### Low Performance

**Symptoms**: Video stutters, page lags, high CPU

**Solutions**:

1. **Reduce Resolution**: 1920x1080 → 1280x720
2. **Increase Compression**: Lower bitrate to 1-2 Mbps
3. **Disable on Mobile**: Add `display: none` for `max-width: 480px`
4. **Use Poster Only**: Remove video, keep static image

---

### Text Not Readable

**Symptoms**: Text blends with video, hard to read

**Solutions**:

1. **Increase Overlay Opacity**: 0.85 → 0.95
2. **Add Text Shadow**: `text-shadow: 0 2px 8px rgba(0,0,0,0.3)`
3. **Darken Video More**: `brightness(1.3)` → `brightness(1.5)`
4. **Increase Blur**: `blur(2px)` → `blur(4px)`

---

## 📚 References

### Inspiration

- **Apple.com**: Hero video backgrounds on product pages
- **Airbnb**: Subtle motion on landing pages
- **Stripe**: Gradient overlays over video
- **Linear**: Frosted glass effects

### Technical Docs

- [MDN: `<video>` element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video)
- [Can I Use: backdrop-filter](https://caniuse.com/css-backdrop-filter)
- [Web.dev: Video optimization](https://web.dev/fast/#optimize-your-videos)

---

## 🔮 Future Enhancements

### 1. Multiple Video Sources

```jsx
<video>
  <source src="/assets/bg_video.webm" type="video/webm" />
  <source src="/assets/bg_video.mp4" type="video/mp4" />
</video>
```

**Benefit**: WebM is smaller (better compression)

---

### 2. Adaptive Bitrate

```js
const [videoSrc, setVideoSrc] = useState("/assets/bg_video_hq.mp4");

useEffect(() => {
  if (navigator.connection?.effectiveType === "4g") {
    setVideoSrc("/assets/bg_video_hq.mp4"); // High quality
  } else {
    setVideoSrc("/assets/bg_video_lq.mp4"); // Low quality
  }
}, []);
```

**Benefit**: Better UX on slow connections

---

### 3. Intersection Observer

```js
const videoRef = useRef(null);

useEffect(() => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        videoRef.current?.play();
      } else {
        videoRef.current?.pause();
      }
    });
  });

  observer.observe(videoRef.current);
}, []);
```

**Benefit**: Pauses video when off-screen (saves battery)

---

## ✅ Completion Status

- [x] Video element implemented
- [x] Multi-layer overlay for text legibility
- [x] Brightness/blur filters applied
- [x] Smooth fade-in animation (2s)
- [x] Responsive design (mobile optimizations)
- [x] Accessibility (reduced motion, reduced data)
- [x] Performance optimizations (GPU acceleration)
- [x] Graceful degradation (gradient fallback)
- [x] Documentation complete

---

**Built with ❤️ for Triply**  
_Apple-like, accessible, performant_
