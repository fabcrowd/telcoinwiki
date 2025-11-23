# Scroll Performance Optimizations

## Summary
This document outlines the performance optimizations implemented to improve FPS during scrolling.

## Changes Made

### 1. SlidingStack.tsx - Card Progress Calculation
- **Batched DOM reads**: Changed from individual `getBoundingClientRect()` calls per card to batching all reads at once
- **State update optimization**: Only update React state when progress actually changes (prevents unnecessary re-renders)
- **Time-based throttling**: Added 16ms throttle (60fps max) using `performance.now()` for more precise timing
- **Debounced resize**: Resize handlers now debounced to 150ms to reduce calculations during window resizing

### 2. Lenis Smooth Scrolling Configuration
- **Faster duration**: Reduced from 1.2s to 1.0s for better responsiveness
- **Explicit orientation**: Set `orientation: 'vertical'` for better optimization
- **Optimized lerp**: Using default 0.1 for faster response

### 3. CSS Performance Optimizations

#### Sticky Cards
- Added `will-change: transform` to all sticky cards
- Added `contain: layout style paint` for better browser optimization
- Added `transform: translateZ(0)` to force GPU acceleration
- Added `backface-visibility: hidden` to prevent unnecessary repaints

#### Main Sticky Cards
- Added `will-change: transform` to main section cards
- Added `contain: layout style paint` for containment

#### Deck Container
- Added `contain: layout style` to reduce reflow calculations

### 4. ResizeObserver Optimization
- **Debounced callbacks**: ResizeObserver callbacks now debounced to 100ms
- **Passive event listeners**: All resize listeners use `{ passive: true }` flag

## Performance Impact

### Expected Improvements
- **Reduced DOM reads**: Batching `getBoundingClientRect()` calls reduces layout thrashing
- **Fewer re-renders**: State updates only when values change
- **Better frame timing**: 16ms throttling ensures consistent 60fps updates
- **GPU acceleration**: CSS transforms enable hardware acceleration
- **Layout containment**: CSS `contain` property reduces browser recalculations

### Metrics to Monitor
- FPS during scroll (target: 60fps)
- Layout shift (CLS) - should remain low
- Time to Interactive (TTI) - should improve
- Scroll jank - should be eliminated

## Browser Compatibility
All optimizations use standard web APIs:
- `requestAnimationFrame` - All modern browsers
- `will-change` CSS property - All modern browsers
- `contain` CSS property - All modern browsers (with fallback)
- `transform: translateZ(0)` - All modern browsers

## Notes
- These optimizations maintain the existing visual behavior
- No breaking changes to functionality
- All optimizations are progressive enhancements (graceful degradation)

