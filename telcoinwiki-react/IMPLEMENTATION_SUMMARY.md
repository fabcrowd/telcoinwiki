# avax.network Scroll Implementation - Complete

## Implementation Summary

Based on thorough analysis of avax.network's implementation, we've implemented their exact scroll pattern:

### ✅ What We Implemented

1. **Lenis Smooth Scrolling**
   - Initialized on desktop only (>1024px)
   - Adds `lenis` class to HTML element
   - Synced with GSAP ScrollTrigger (for other animations, not cards)
   - Uses GSAP ticker for RAF

2. **CSS Sticky Card Stacking**
   - Cards use `position: sticky` (NOT ScrollTrigger)
   - Dynamic `--offset` CSS variables calculated by JavaScript
   - First card is `position: static`
   - Subsequent cards use `top: calc(header + padding + var(--offset))`

3. **Dynamic Offset Calculation**
   - Calculates offsets based on card content positions
   - Matches avax.network's pattern: `(referenceTop - cardTop) + currentOffset`
   - Recalculates on resize
   - Uses double RAF to ensure layout is complete

4. **Main Card Sticky**
   - Uses CSS `position: sticky`
   - Sticks at `top: calc(header + padding)`
   - Unsticks when section scrolls out

### ✅ What We Removed

1. **Deleted `useLenisScrollSections.ts`**
   - This was trying to use ScrollTrigger for cards (wrong approach)
   - avax.network uses CSS sticky, not ScrollTrigger for cards

2. **Removed Debug Logging**
   - Cleaned up console.log statements
   - Production-ready code

### ✅ Architecture

**avax.network pattern:**
- Lenis = Smooth scrolling only
- CSS Sticky = Card stacking
- ScrollTrigger = Only for specific animations (footer, links, etc.) - NOT cards

**Our implementation:**
- ✅ Lenis for smooth scrolling
- ✅ CSS sticky for cards with dynamic offsets
- ✅ ScrollTrigger synced with Lenis (for future animations if needed)
- ✅ Desktop-only (mobile uses native scroll)

### Files Modified

1. `src/utils/lenisScroll.ts` - Lenis initialization (matches avax.network)
2. `src/components/cinematic/SlidingStack.tsx` - Dynamic offset calculation
3. `src/styles/site.css` - CSS sticky with dynamic offsets
4. `src/components/layout/CinematicLayout.tsx` - Lenis initialization via hook

### Files Deleted

1. `src/hooks/useLenisScrollSections.ts` - Conflicted with CSS sticky approach

### Testing

All 5 sections should work correctly:
1. broken-money
2. telcoin-model
3. engine
4. experience
5. learn-more

Each section:
- Main card sticks at header + padding
- Subcards stack with dynamic offsets
- All cards unstick together when section scrolls out
- Smooth scrolling via Lenis (desktop only)

