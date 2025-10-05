# ✅ Quick Verification Guide

## Test 1: Static Assets Routing

**Open in browser:**

```
http://localhost:5173/assets/test.txt
```

**Expected Result:**

- ✅ Shows plain text: "Static assets routing works!"
- ✅ Does NOT show React app (no Triply page)
- ✅ Network tab shows: Status 200, Type: text/plain

**If this works:** Routing is fixed! ✨

---

## Test 2: Video Placeholder

**After adding bg_video.mp4, open:**

```
http://localhost:5173/assets/bg_video.mp4
```

**Expected Result:**

- ✅ Video starts downloading/playing
- ✅ Status: 206 Partial Content (video streaming)
- ✅ Content-Type: video/mp4

---

## Test 3: Full Page Test

**Navigate to:**

```
http://localhost:5173/
```

**Expected Result:**

- ✅ LandingPage loads
- ✅ Video background appears (if bg_video.mp4 exists)
- ✅ Console: No 404 errors for /assets/bg_video.mp4
- ✅ Network tab: Video loaded successfully

---

## Debugging

### If test.txt shows React app instead:

**Problem:** Vite not serving static files correctly

**Fix:**

```bash
# Restart dev server
npm run dev
```

### If video shows 404:

**Problem:** File not in /public/assets/

**Fix:**

```bash
# Check file exists
ls public/assets/bg_video.mp4

# Add file if missing
```

### If video loads but doesn't play:

**Problem:** Browser autoplay policy

**Fix:** Add user interaction (button click) or check:

- Video has `muted` attribute ✓
- Video has `playsInline` attribute ✓
- Browser allows autoplay (check browser console)

---

## Quick Commands

```powershell
# Check public folder structure
Get-ChildItem -Path "public" -Recurse

# Test file access directly
curl http://localhost:5173/assets/test.txt

# Check dev server logs
# (look in terminal where npm run dev is running)
```

---

**Current Status:**

- ✅ Router fixed (no interception of /assets/)
- ✅ Folder created: /public/assets/
- ✅ Test file: /public/assets/test.txt
- ⏳ Video file: /public/assets/bg_video.mp4 (NEEDED)
- ⏳ Poster: /public/assets/video-poster.jpg (NEEDED)

**Next:** Add video files and test! 🚀
