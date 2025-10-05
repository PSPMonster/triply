# 🛣️ Router Configuration - Static Assets

## Problem Fixed ✅

**Issue:** "Nasz router we frontendzie nie uwzględnia ścieżki /assets/."

**Root Cause:**

- Missing `/public/assets/` folder
- Misconception that React Router intercepts static asset paths

---

## How Vite Handles Static Assets

### Public Directory Strategy

```
/public/
├── vite.svg          → http://localhost:5173/vite.svg
├── assets/
│   ├── bg_video.mp4  → http://localhost:5173/assets/bg_video.mp4
│   └── video-poster.jpg → http://localhost:5173/assets/video-poster.jpg
```

**Key Points:**

1. Files in `/public/` are **copied as-is** to dist root during build
2. Available at **root URL** (no `/public/` prefix needed)
3. React Router **does NOT intercept** these paths
4. Dev server (Vite) handles them before React app loads

---

## Why This Works

### Request Flow

```
Browser Request: GET /assets/bg_video.mp4
         ↓
    Vite Dev Server
         ↓
   Check /public/assets/bg_video.mp4
         ↓
   File exists? → Serve directly (200 OK)
         ↓
   File missing? → Pass to React Router (404)
         ↓
    React Router: path="*" → LandingPage
```

**React Router Never Sees Static Assets** ✨

---

## Configuration

### vite.config.js

```javascript
export default defineConfig({
  plugins: [react()],
  publicDir: "public", // ← Default, explicit for clarity
});
```

### App.jsx (Router)

```jsx
<Routes>
  <Route path="/" element={<LandingPage />} />
  <Route path="/explore" element={<TripSelector />} />
  <Route path="/trip/:cityId" element={<TripView />} />
  <Route path="*" element={<LandingPage />} /> {/* Catch-all */}
</Routes>
```

**No conflicts!** Routes like `/explore` are handled by React Router, but `/assets/video.mp4` bypasses it entirely.

---

## Testing

### Verify Static Assets Work

1. **Add test file:**

   ```bash
   echo "test" > public/assets/test.txt
   ```

2. **Start dev server:**

   ```bash
   npm run dev
   ```

3. **Open in browser:**

   ```
   http://localhost:5173/assets/test.txt
   ```

   Should show "test" (not React app)

4. **Check Network tab:**
   - Status: `200 OK`
   - Type: `text/plain`
   - Source: Vite dev server (not React)

---

## Production Build

### Build Output

```bash
npm run build
```

**Result:**

```
dist/
├── index.html
├── assets/
│   ├── bg_video.mp4      ← Copied from /public/
│   ├── video-poster.jpg  ← Copied from /public/
│   ├── index-abc123.js   ← Bundled JS (with hash)
│   └── index-def456.css  ← Bundled CSS (with hash)
```

**In Production:**

- Static files: `/assets/bg_video.mp4` (from `/public/`)
- Bundled assets: `/assets/index-abc123.js` (from `/src/`)

No conflicts! Different files, same folder.

---

## Common Pitfalls

### ❌ Wrong: Importing from /src/assets/

```jsx
// DON'T DO THIS for large videos
import bgVideo from "../assets/bg_video.mp4";

<video src={bgVideo} />; // ← Video bundled into JS (huge file!)
```

**Problem:** Vite imports video into bundle → massive JS file

---

### ✅ Correct: Referencing from /public/

```jsx
// DO THIS for large files
<video src="/assets/bg_video.mp4" /> // ← Direct URL reference
```

**Benefit:** Video served separately, browser can stream it

---

## File Size Guidelines

### Use /public/ for:

- ✅ Videos (> 1 MB)
- ✅ Large images (> 500 KB)
- ✅ PDFs, downloadable files
- ✅ Static JSON data (> 100 KB)

### Use /src/assets/ for:

- ✅ Icons (< 50 KB)
- ✅ Component-specific images (< 200 KB)
- ✅ Logos, SVGs (< 100 KB)

**Rule of Thumb:** If it's big or needs a stable URL, use `/public/`

---

## Deployment Checklist

- [x] `/public/assets/` folder created
- [x] `vite.config.js` configured with `publicDir: 'public'`
- [x] React Router routes defined (no conflict with `/assets/`)
- [ ] Add `bg_video.mp4` to `/public/assets/`
- [ ] Add `video-poster.jpg` to `/public/assets/`
- [ ] Test locally: `npm run dev` → check `/assets/bg_video.mp4`
- [ ] Build: `npm run build` → verify files in `dist/assets/`
- [ ] Deploy to Vercel → test video loads on production

---

## Summary

**Fixed:**
✅ Created `/public/assets/` folder  
✅ Added explicit `publicDir` config in Vite  
✅ Documented routing behavior

**Ready for:**
🎥 Add video files to `/public/assets/`  
🧪 Test video playback in dev mode  
🚀 Deploy to production

**No router changes needed** - Vite handles this automatically! 🎉
