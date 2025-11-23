# Scroll Animation Performance Analysis

## Summary
Investigated scroll animation performance and potential memory leaks. Found several performance bottlenecks that could cause lower FPS, but **no memory leaks detected** - all event listeners, observers, and RAF calls are properly cleaned up.

## Performance Issues Found

### 1. **No Debouncing on Section Hooks Resize Handlers** ⚠️
**Location**: `useHomeScrollSections.ts` (sections 2-5)
**Issue**: Resize handlers call `getBoundingClientRect()` directly without debouncing
**Impact**: High - fires on every resize event, causing layout thrashing
**Current Code**:
```typescript
const handleResize = () => {
  measureAndSetOffset() // Calls getBoundingClientRect() immediately
}
window.addEventListener('resize', handleResize, { passive: true })
```
**Recommendation**: Add 150ms debounce like SlidingStack does

### 2. **Continuous RAF Loop in useScrollProgress Smoothing** ⚠️
**Location**: `useScrollProgress.ts` lines 61-78
**Issue**: Smoothing uses a continuous RAF loop that runs until convergence
**Impact**: Medium - could run continuously during active scrolling
**Current Behavior**: RAF loop continues until `Math.abs(target - nextValue) < 0.001`
**Note**: This is intentional for smooth interpolation, but could be optimized

### 3. **Offset Calculation on Every Resize** ⚠️
**Location**: `SlidingStack.tsx` lines 221-223
**Issue**: ResizeObserver triggers `calculateStickyOffsets()` which does multiple `getBoundingClientRect()` calls
**Impact**: Medium - expensive operation, but debounced (150ms)
**Current Code**: ResizeObserver → calculateOffsets() → multiple getBoundingClientRect() calls
**Note**: Already debounced, but could be optimized further

### 4. **Multiple ResizeObservers** ℹ️
**Location**: Each `SlidingStack` component creates a ResizeObserver
**Issue**: 5 sections = 5 ResizeObservers
**Impact**: Low - necessary for functionality, all properly cleaned up
**Status**: ✅ Properly disconnected in cleanup

### 5. **Lenis + GSAP Ticker Running Every Frame** ℹ️
**Location**: `lenisScroll.ts` lines 65-71
**Issue**: GSAP ticker runs on every frame for Lenis smooth scrolling
**Impact**: Low - this is expected behavior for smooth scrolling
**Status**: ✅ Properly cleaned up in destroyLenisScroll()

## Memory Leak Analysis

### ✅ **No Memory Leaks Detected**

All potential leak sources are properly cleaned up:

1. **Event Listeners**: All `addEventListener` calls have matching `removeEventListener` in cleanup
2. **ResizeObserver**: All instances are properly `disconnect()`ed
3. **RAF**: All `requestAnimationFrame` calls are `cancelAnimationFrame`d
4. **Timeouts**: All `setTimeout` calls are `clearTimeout`d
5. **Lenis**: Properly destroyed with all handlers removed
6. **GSAP Ticker**: Properly removed in cleanup

## Recommendations (Without Changing Functionality)

### High Priority
1. **Add debouncing to section hooks resize handlers** (sections 2-5)
   - Add 150ms debounce to match SlidingStack pattern
   - Reduces layout thrashing during window resize

### Medium Priority
2. **Optimize offset calculation frequency**
   - Consider throttling ResizeObserver callbacks
   - Cache measurements when possible

3. **Review smoothing RAF loop**
   - Consider reducing smoothing factor or adding max iterations
   - Current implementation is correct but could be optimized

### Low Priority
4. **Monitor ResizeObserver usage**
   - Current implementation is correct
   - Consider if all 5 observers are necessary (they are for now)

## Files Reviewed
- ✅ `telcoinwiki-react/src/utils/lenisScroll.ts` - Clean
- ✅ `telcoinwiki-react/src/hooks/useScrollProgress.ts` - Clean (smoothing RAF is intentional)
- ✅ `telcoinwiki-react/src/components/cinematic/SlidingStack.tsx` - Clean (minor optimization possible)
- ⚠️ `telcoinwiki-react/src/hooks/useHomeScrollSections.ts` - Needs debouncing on resize
- ✅ `telcoinwiki-react/src/utils/calculateStickyOffsets.ts` - Clean
- ✅ `telcoinwiki-react/src/utils/scroll.ts` - Clean

## Conclusion
**No memory leaks found.** Performance issues are primarily related to:
1. Missing debounce on section hooks resize handlers
2. Continuous RAF during scroll smoothing (intentional but could be optimized)
3. Multiple expensive operations during resize (mitigated by debouncing in most places)

The codebase is well-structured with proper cleanup. The main performance improvement would come from adding debouncing to the section hooks resize handlers.

