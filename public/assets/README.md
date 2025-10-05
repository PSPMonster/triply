# 🎥 Assets Folder - Video Files

## Required Files

### 1. `bg_video.mp4`

**Background video for LandingPage hero section**

**Specifications:**

- Format: MP4 (H.264 codec)
- Resolution: 1920x1080 (Full HD)
- Duration: 10-20 seconds (seamless loop)
- Frame Rate: 24-30 fps
- Bitrate: 2-5 Mbps
- File Size: < 5 MB (web-optimized)

**Content Guidelines:**

- Subtle motion (slow camera movements, no fast action)
- Calm travel theme (nature, destinations, architecture)
- Neutral colors (will be brightened by 30% + blurred)
- Seamless loop (first and last frame should match)

**Where to Find:**

- Stock video sites: Pexels, Pixabay, Coverr (free)
- Paid: Envato Elements, Artgrid, Motion Array
- AI-generated: Runway, Pika Labs

**Example Keywords:**

- "aerial view city slow motion"
- "ocean waves calm travel"
- "mountains clouds timelapse"
- "peaceful landscape travel"

---

### 2. `video-poster.jpg`

**Fallback poster image (shown while video loads)**

**Specifications:**

- Format: JPG (optimized for web)
- Resolution: 1920x1080
- File Size: < 200 KB
- Quality: 80-85%

**Content:**

- Single frame from `bg_video.mp4` (for consistency)
- Or: Similar aesthetic (calm travel scene)

**How to Create:**

```bash
# Extract frame from video using FFmpeg
ffmpeg -i bg_video.mp4 -ss 00:00:05 -vframes 1 video-poster.jpg
```

---

## Compression Tips

### Optimize Video for Web

```bash
# FFmpeg command for web-optimized MP4
ffmpeg -i input.mp4 \
  -vcodec libx264 \
  -crf 28 \
  -preset slow \
  -vf "scale=1920:1080" \
  -r 24 \
  -movflags +faststart \
  bg_video.mp4
```

**Parameters Explained:**

- `-crf 28` - Compression quality (23=high, 28=balanced, 32=low)
- `-preset slow` - Better compression (takes longer)
- `-movflags +faststart` - Enables progressive playback
- `-r 24` - 24 fps (cinematic feel, smaller file)

---

### Optimize Poster Image

```bash
# ImageMagick command for optimized JPG
magick input.jpg \
  -resize 1920x1080 \
  -quality 85 \
  video-poster.jpg
```

---

## Testing

After adding files, verify in browser:

1. Run dev server: `npm run dev`
2. Navigate to: `http://localhost:5173/`
3. Open DevTools Network tab
4. Check video loads: `/assets/bg_video.mp4` (Status 200)
5. Verify poster loads: `/assets/video-poster.jpg` (Status 200)

---

## Current Status

- [x] Folder created: `/public/assets/`
- [ ] Video file: `bg_video.mp4` (MISSING - add here!)
- [ ] Poster image: `video-poster.jpg` (MISSING - add here!)

**Next Step:** Add video and poster files to this folder, then test in browser! 🚀
