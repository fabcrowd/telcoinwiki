# How to Verify Lenis Usage on avax.network

## Quick Check (Run in Console)

1. Copy and paste `verify-lenis-usage.js` into the console
2. Check the output

## Manual Network Tab Check

1. Open DevTools (F12)
2. Go to **Network** tab
3. Filter by **JS** (JavaScript files)
4. **Reload the page** (Ctrl+R / Cmd+R)
5. Look for files containing:
   - `lenis`
   - `vendor`
   - `chunk`
   - `bundle`

## Manual Sources Tab Check

1. Open DevTools (F12)
2. Go to **Sources** tab
3. Press **Ctrl+F** (or Cmd+F on Mac)
4. Search for: `lenis` or `Lenis`
5. Look for:
   - `import Lenis from`
   - `new Lenis(`
   - `lenis.raf(`
   - `lenis.on(`

## What to Look For

### Strong Indicators:
- ✅ HTML element has `lenis` class
- ✅ Network tab shows a file with "lenis" in the name
- ✅ Sources tab shows Lenis import/initialization code

### Weak Indicators:
- ⚠️ Smooth scrolling (could be CSS or other library)
- ⚠️ `lenisVersion` on window (could be from other code)

## Share Results

After checking, share:
1. Screenshot of Network tab (filtered by JS)
2. Screenshot of Sources tab (showing Lenis code if found)
3. Output from `verify-lenis-usage.js`

