<!-- dfcda45d-8d1b-4276-9d63-525888731bc9 ae1ff97b-42a4-4f0b-b76d-ffdce7d11dfb -->
# Session-based Accordion Mode After Scroll Completion

## Overview

After a user scrolls through all 5 sections for the first time, switch all sections to accordion mode (collapsed by default, click to expand). This state persists in `sessionStorage` so returning users don't need to scroll again in the same session.

## Implementation Plan

### 1. Create Session Storage Hook (`telcoinwiki-react/src/hooks/useScrollCompletion.ts`)

- Create `useScrollCompletion()` hook that:
- Checks `sessionStorage.getItem('telcoin-scroll-completed')` on mount
- Returns `{ isCompleted: boolean, markCompleted: () => void }`
- `markCompleted()` sets `sessionStorage.setItem('telcoin-scroll-completed', 'true')`

### 2. Add Completion Detection in HomePage (`telcoinwiki-react/src/pages/HomePage.tsx`)

- Import and use `useScrollCompletion()` hook
- Add `useEffect` to detect when section 5's bottom passes viewport:
- Use `IntersectionObserver` on section 5's last element (footer or last card)
- When section 5 bottom enters viewport, call `markCompleted()`
- Only detect if `!isCompleted` (don't re-detect if already completed)

### 3. Create Accordion Component (`telcoinwiki-react/src/components/cinematic/AccordionStack.tsx`)

- New component that renders cards in accordion format:
- Main card (with bullet points) as first accordion item
- Each subcard as subsequent accordion items
- All collapsed by default
- Click to expand/collapse individual items
- Use `useState` to track which items are expanded
- Match existing card styling (gradients, fonts, etc.)

### 4. Modify HomePage to Conditionally Render (`telcoinwiki-react/src/pages/HomePage.tsx`)

- In sections mapping, check `isCompleted` from `useScrollCompletion()`
- If `isCompleted === true`:
- Render `AccordionStack` instead of `SlidingStack`
- Render main card as first accordion item
- Disable sticky behavior (set `enabled={false}` on StickyModule)
- If `isCompleted === false`:
- Render existing `SlidingStack` with scroll behavior
- Keep existing sticky behavior

### 5. Update SlidingStack Props (Optional - for consistency)

- Ensure `SlidingStack` gracefully handles being disabled when accordion mode is active
- No changes needed if we completely replace it with `AccordionStack`

## Files to Create/Modify

1. **New File**: `telcoinwiki-react/src/hooks/useScrollCompletion.ts`

- Hook for sessionStorage-based completion tracking

2. **New File**: `telcoinwiki-react/src/components/cinematic/AccordionStack.tsx`

- Accordion component for expanded card view

3. **Modify**: `telcoinwiki-react/src/pages/HomePage.tsx`

- Add completion detection logic
- Add conditional rendering (accordion vs scroll mode)

4. **Optional CSS**: `telcoinwiki-react/src/styles/site.css`

- Add accordion-specific styles if needed (expand/collapse animations, etc.)

## Technical Details

- **Session Storage Key**: `'telcoin-scroll-completed'`
- **Detection Method**: `IntersectionObserver` on section 5's bottom boundary
- **Accordion Behavior**: 
- Main card + 3 subcards = 4 accordion items per section
- Independent expand/collapse per item
- Smooth expand/collapse animation
- **State Management**: React `useState` for accordion open/closed state per section

## Edge Cases

- User scrolls very fast past section 5: `IntersectionObserver` should still catch it
- User navigates away before completing: State resets (session-based, not persistent)
- User clears sessionStorage: Returns to scroll mode
- Reduced motion preference: Accordion should still work, just without animations

### To-dos

- [ ] Fix memory leaks: SlidingStack resize handler, lenisScroll event listeners, HeroEntrance MutationObserver
- [ ] Optimize scroll performance: debounce resize handlers, reduce RAF calls, optimize Lenis config
- [ ] Remove unused components, hooks, and utilities not used by homepage
- [ ] Optimize React renders: memoize expensive calculations, reduce re-renders
- [ ] Remove unused config files and clean up build config
- [ ] Refactor offset calculation in SlidingStack.tsx to match avax.network pattern
- [ ] Optimize CSS sticky positioning values in site.css
- [ ] Reduce DOM queries and optimize React renders
- [ ] Extract offset calculation logic to utility function
- [ ] Fix memory leaks: SlidingStack resize handler, lenisScroll event listeners, HeroEntrance MutationObserver
- [ ] Optimize scroll performance: debounce resize handlers, reduce RAF calls, optimize Lenis config
- [ ] Remove unused components, hooks, and utilities not used by homepage
- [ ] Optimize React renders: memoize expensive calculations, reduce re-renders
- [ ] Remove unused config files and clean up build config
- [ ] Fix memory leaks: SlidingStack resize handler, lenisScroll event listeners, HeroEntrance MutationObserver
- [ ] Optimize scroll performance: debounce resize handlers, reduce RAF calls, optimize Lenis config
- [ ] Remove unused components, hooks, and utilities not used by homepage
- [ ] Optimize React renders: memoize expensive calculations, reduce re-renders
- [ ] Remove unused config files and clean up build config
- [ ] Fix memory leaks: SlidingStack resize handler, lenisScroll event listeners, HeroEntrance MutationObserver
- [ ] Optimize scroll performance: debounce resize handlers, reduce RAF calls, optimize Lenis config
- [ ] Remove unused components, hooks, and utilities not used by homepage
- [ ] Optimize React renders: memoize expensive calculations, reduce re-renders
- [ ] Remove unused config files and clean up build config
- [ ] Refactor offset calculation in SlidingStack.tsx to match avax.network pattern
- [ ] Optimize CSS sticky positioning values in site.css
- [ ] Reduce DOM queries and optimize React renders
- [ ] Extract offset calculation logic to utility function
- [ ] Fix memory leaks: SlidingStack resize handler, lenisScroll event listeners, HeroEntrance MutationObserver
- [ ] Optimize scroll performance: debounce resize handlers, reduce RAF calls, optimize Lenis config
- [ ] Remove unused components, hooks, and utilities not used by homepage
- [ ] Optimize React renders: memoize expensive calculations, reduce re-renders
- [ ] Remove unused config files and clean up build config
- [ ] Fix memory leaks: SlidingStack resize handler, lenisScroll event listeners, HeroEntrance MutationObserver
- [ ] Optimize scroll performance: debounce resize handlers, reduce RAF calls, optimize Lenis config
- [ ] Remove unused components, hooks, and utilities not used by homepage
- [ ] Optimize React renders: memoize expensive calculations, reduce re-renders
- [ ] Remove unused config files and clean up build config
- [ ] Create useScrollCompletion hook for sessionStorage-based completion tracking
- [ ] Add IntersectionObserver in HomePage to detect when section 5's bottom is reached
- [ ] Create AccordionStack component that renders cards in accordion format (main card + subcards)
- [ ] Modify HomePage to conditionally render AccordionStack vs SlidingStack based on completion state
- [ ] Add CSS for accordion expand/collapse animations and styling