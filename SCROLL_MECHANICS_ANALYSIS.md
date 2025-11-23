# Scroll Mechanics Analysis

## Current Structure

```
StickyModule Section (data-sticky-module)
├── Inner Container (div with padding)
│   └── Grid (2 columns)
│       ├── Main Card Column (data-sticky-module-lead)
│       │   └── Main Card (position: sticky)
│       └── Content Column (data-sticky-module-content)
│           └── SlidingStack (data-sliding-stack)
│               └── Deck (sliding-stack__deck)
│                   ├── Card 1: Cost & Delay (position: sticky, z-index: 10, offset: 0px)
│                   ├── Card 2: Inclusion (position: sticky, z-index: 20, offset: 15px)
│                   └── Card 3: Trust (position: sticky, z-index: 30, offset: 30px)
```

## Key CSS Properties

### StickyModule Section
- **Height**: `min-height: var(--sticky-container-height, 400vh)` (calculated as `viewportHeight * (1 + (cardCount * 2.5) + 1)`)
- **Overflow**: `visible`
- **Position**: `relative`

### Main Card (The Problem)
- **Position**: `sticky`
- **Top**: `calc(var(--navbar-height) + var(--padding-md) + var(--stack-extra, 120px) + 0px)`
- **Z-index**: `5`
- **Containing Block**: StickyModule Section

### SlidingStack Deck
- **Height**: `min-height: var(--sticky-container-height, 400vh)` (same as section)
- **Height**: `height: auto` (grows with content)
- **Position**: `relative`

### Subcards (Cost & Delay, Inclusion, Trust)
- **Position**: `sticky`
- **Top**: `calc(var(--navbar-height) + var(--padding-md) + var(--stack-extra, 120px) + var(--card-offset, 0px))`
- **Margin-bottom**: `calc(100vh * 1.5)` (each card)
- **Z-index**: 10, 20, 30 (increasing)
- **Containing Block**: SlidingStack Deck

## How Sticky Positioning Works

**Critical Rule**: A `position: sticky` element unsticks when its **containing block** (the nearest scrolling ancestor) scrolls completely out of view.

1. **Main Card** is sticky within the **StickyModule Section**
   - It unsticks when the section's bottom edge scrolls past the viewport top

2. **Subcards** are sticky within the **SlidingStack Deck**
   - They unstick when the deck's bottom edge scrolls past the viewport top

## Current Scroll Sequence (What Actually Happens)

### Phase 1: Initial Scroll
- User scrolls down to the section
- Section enters viewport

### Phase 2: Main Card Pins
- Main card reaches its sticky threshold (`top` value)
- Main card becomes sticky and locks in place
- Main card stays pinned at `top: calc(var(--navbar-height) + var(--padding-md) + 120px)`

### Phase 3: Subcards Stack at Bottom
- First card (Cost & Delay) has `margin-top: calc(100vh - var(--navbar-height) - var(--padding-md) - 200px)`
- All 3 subcards start stacked at the bottom of the viewport (only tabs visible)

### Phase 4: Subcards Pin Sequentially
- **Cost & Delay** (Card 1): 
  - Reaches sticky threshold (`top: calc(... + 0px)`)
  - Pins and locks in place
  - Z-index: 10

- **Inclusion** (Card 2):
  - Scrolls up behind Cost & Delay
  - Reaches sticky threshold (`top: calc(... + 15px)`)
  - Pins 15px below Cost & Delay
  - Z-index: 20 (appears on top)

- **Trust** (Card 3):
  - Scrolls up behind Inclusion
  - Reaches sticky threshold (`top: calc(... + 30px)`)
  - Pins 30px below Inclusion
  - Z-index: 30 (appears on top)

### Phase 5: Release (Current Problem)

**The Problem**: Main card and subcards have different containing blocks:
- **Main Card** unsticks when: Section's bottom edge scrolls out of view
- **Subcards** unstick when: Deck's bottom edge scrolls out of view

**Current Behavior**:
1. Deck's actual height = `min-height` + content height (including card margins)
2. Each card has `margin-bottom: calc(100vh * 1.5)`
3. Deck's bottom edge = `min-height` + `margin-bottom` of last card = `var(--sticky-container-height) + 1.5vh`
4. Section's bottom edge = `min-height` = `var(--sticky-container-height)` (unless content extends it)
5. **Result**: Deck's bottom edge is LOWER than section's bottom edge
6. **Result**: Subcards unstick FIRST (when deck scrolls out), then main card unsticks later (when section scrolls out)

## Why They Don't Unstick Together

The deck's bottom edge is determined by:
- Deck's `min-height`: `var(--sticky-container-height)` (e.g., 400vh)
- Last card's `margin-bottom`: `calc(100vh * 1.5)` (e.g., 150vh)
- **Total deck height**: ~550vh

The section's bottom edge is determined by:
- Section's `min-height`: `var(--sticky-container-height)` (e.g., 400vh)
- **Total section height**: ~400vh (unless content extends it)

**The deck extends 150vh beyond the section**, so the subcards unstick 150vh of scroll before the main card.

## Questions to Answer

To fix the synchronized release, I need to know:

1. **What should happen when Trust finishes pinning?**
   - Should all cards (main + 3 subcards) release immediately?
   - Or should they stay pinned for a moment, then release together?

2. **What should the release behavior look like?**
   - Should all cards scroll up together as one unit?
   - Should they maintain their stacked positions while scrolling up?
   - Should they fade out or transform in any way?

3. **How much scroll space should there be after Trust pins?**
   - Should there be immediate release (no extra scroll)?
   - Should there be a brief pause (e.g., 50vh of scroll)?
   - Should there be a longer pause (e.g., 100vh of scroll)?

4. **What should determine when release happens?**
   - When Trust card finishes pinning (last subcard locks in place)?
   - After a specific scroll distance past Trust pinning?
   - When the deck's bottom edge reaches a certain point?

5. **Should the section height match the deck height exactly?**
   - Should section height = deck's actual height (including margins)?
   - Or should we adjust the deck height to match section height?
   - Or use a different approach?

6. **Visual expectation:**
   - When you scroll past the pinned cards, do you want them to:
     - Disappear immediately?
     - Scroll up together smoothly?
     - Stay in view briefly, then release?






