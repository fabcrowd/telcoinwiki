# avax.network Scroll Implementation Analysis

## Key Findings from HTML File

### 1. **Lenis Confirmed**
- HTML element has `class="lenis"` ✅
- This confirms Lenis is used for smooth scrolling

### 2. **GSAP ScrollTrigger**
- Found: `import { gsap } from "@lib/gsap"`
- Used for footer animation with `scrollTrigger`
- **NOT used for card stacking** - cards use pure CSS sticky

### 3. **Card Stacking Pattern**

#### CSS Sticky with Dynamic Offsets
Cards use `position: sticky` with dynamic CSS variables:

```html
<div class="insight sticky top-[calc(var(--navbar-height)+var(--padding-md)+var(--offset))] ...">
```

#### Offset Values Found:
- Card 1: `--offset: 0px`
- Card 2: `--offset: 87.1771240234375px` (~87px)
- Card 3: `--offset: 174.354248046875px` (~174px)
- Card 4: `--offset: 261.53125px` (~261px)

#### Pattern:
- Each card has an incremental offset (~87px per card)
- Offsets are set via inline `style` attribute
- Cards stack using `position: sticky` with different `top` values

### 4. **Implementation Summary**

**avax.network uses:**
1. **Lenis** - Smooth scrolling (adds `lenis` class to HTML)
2. **CSS Sticky** - Card stacking (NOT ScrollTrigger)
3. **Dynamic CSS Variables** - JavaScript calculates `--offset` values
4. **GSAP ScrollTrigger** - Only for specific animations (footer), NOT cards

### 5. **What We Need to Implement**

1. ✅ Lenis initialization (already done)
2. ✅ CSS sticky for cards (already done)
3. ❌ **Dynamic offset calculation** - Need to add JavaScript that calculates and sets `--offset` for each card
4. ✅ Media query for desktop-only (already done)

## Next Steps

We need to add JavaScript that:
- Calculates the offset for each card based on scroll position or card index
- Sets the `--offset` CSS variable on each card element
- Updates offsets dynamically (if needed)

The offset calculation likely:
- Starts at `0px` for first card
- Increments by ~87px (or calculated based on card height/spacing) for each subsequent card

