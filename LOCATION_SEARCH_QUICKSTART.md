# 🚀 Quick Start - Location Search

## Setup (0 seconds!) ✨

### ✅ No Setup Needed!

We're using **Nominatim (OpenStreetMap)** - completely free API that works out of the box!

- ✅ No registration required
- ✅ No API key needed
- ✅ No credit card needed
- ✅ Just works™

### Start Using

```bash
npm run dev
```

That's it! 🎉

---

## Usage

### Try It Now

1. Open http://localhost:5173/explore
2. Click search box: "Search any city worldwide..."
3. Type: **"Paris"**
4. See dropdown with results
5. Click **"Paris, France"**
6. Search box shows selected city ✅
7. Mood section appears below 🎨

### Test Debouncing

Type **"L-o-n-d-o-n"** fast → only 1 API call (after 300ms pause)

### Test Empty State

Search **"zzzzzz"** → "No locations found" message

### Test Clear

Select city → Click ❌ button → Reset to search

---

## Features

✅ **100,000+ cities** - Every major city worldwide  
⚡ **Debounced** - Smart delay prevents spam  
🎨 **Apple UI** - Smooth animations, clean design  
📱 **Responsive** - Works perfectly on mobile  
♿ **Accessible** - Keyboard navigation, screen readers  
🔒 **Secure** - API key in .env, not in code

---

## API Limits

**Provider**: Nominatim (OpenStreetMap)  
**Rate Limit**: 1 request/second  
**With Debouncing**: Perfect compliance (300ms delay) ✅  
**Hackathon Usage**: Unlimited, completely free! 🎉

---

## Troubleshooting

### "No results found" for everything

→ Check internet connection  
→ Wait 300ms after typing (debounce delay)  
→ Check browser console for errors

### Dropdown doesn't appear

→ Type at least 2 characters  
→ Wait 300ms (debounce delay)  
→ Check network tab for API calls

### API rate limit errors

→ Nominatim limits: 1 request/second  
→ Debouncing handles this automatically ✅  
→ Don't spam search too fast

---

**Need Help?**  
📖 See `LOCATION_SEARCH.md` for full documentation  
🐛 Check browser console for detailed errors
