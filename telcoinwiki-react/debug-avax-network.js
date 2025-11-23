// Run these commands in avax.network console to get implementation details

console.log('=== AVAX.NETWORK SCROLL IMPLEMENTATION DEBUG ===\n');

// 1. Check if Lenis is initialized and get its config
console.log('1. LENIS INSTANCE:');
if (window.lenis || window.l) {
  const lenis = window.lenis || window.l;
  console.log('Lenis found:', lenis);
  console.log('Lenis options:', {
    autoRaf: lenis.options?.autoRaf,
    smoothWheel: lenis.options?.smoothWheel,
    syncTouch: lenis.options?.syncTouch,
    duration: lenis.options?.duration,
    easing: lenis.options?.easing,
    lerp: lenis.options?.lerp,
  });
} else {
  console.log('Lenis not found on window');
}

// 2. Check GSAP and ScrollTrigger
console.log('\n2. GSAP & SCROLLTRIGGER:');
if (window.gsap) {
  console.log('GSAP version:', window.gsap.version);
  console.log('ScrollTrigger registered:', !!window.gsap.plugins?.ScrollTrigger);
  
  if (window.gsap.plugins?.ScrollTrigger) {
    const st = window.gsap.plugins.ScrollTrigger;
    console.log('ScrollTrigger version:', st.version);
    console.log('Active ScrollTriggers:', st.getAll().length);
    
    // Get first few ScrollTriggers to see their config
    const triggers = st.getAll().slice(0, 5);
    triggers.forEach((trigger, i) => {
      console.log(`\nScrollTrigger ${i + 1}:`, {
        trigger: trigger.vars?.trigger,
        start: trigger.vars?.start,
        end: trigger.vars?.end,
        pin: trigger.vars?.pin,
        scrub: trigger.vars?.scrub,
        markers: trigger.vars?.markers,
      });
    });
  }
} else {
  console.log('GSAP not found');
}

// 3. Find scroll sections and check their structure
console.log('\n3. SCROLL SECTIONS STRUCTURE:');
const sections = document.querySelectorAll('section[id*="home-"], section[data-sticky-module]');
console.log(`Found ${sections.length} sections`);

sections.forEach((section, i) => {
  const sectionId = section.id || `section-${i}`;
  const mainCard = section.querySelector('[data-sticky-module-lead], .main-card, [class*="main"]');
  const cards = section.querySelectorAll('.sliding-stack__card, [class*="card"]:not([class*="main"])');
  
  console.log(`\nSection ${i + 1} (${sectionId}):`, {
    hasMainCard: !!mainCard,
    mainCardPosition: mainCard ? getComputedStyle(mainCard).position : 'N/A',
    mainCardTop: mainCard ? getComputedStyle(mainCard).top : 'N/A',
    cardCount: cards.length,
    cards: Array.from(cards).map((card, idx) => ({
      index: idx,
      position: getComputedStyle(card).position,
      top: getComputedStyle(card).top,
      transform: getComputedStyle(card).transform,
      opacity: getComputedStyle(card).opacity,
      zIndex: getComputedStyle(card).zIndex,
    })),
  });
});

// 4. Check for any scroll-related event listeners
console.log('\n4. SCROLL EVENT LISTENERS:');
const scrollListeners = getEventListeners?.(window)?.scroll || [];
console.log('Window scroll listeners:', scrollListeners.length);
if (scrollListeners.length > 0) {
  scrollListeners.forEach((listener, i) => {
    console.log(`Listener ${i + 1}:`, {
      type: listener.type,
      useCapture: listener.useCapture,
      passive: listener.passive,
    });
  });
}

// 5. Check for RAF (requestAnimationFrame) usage
console.log('\n5. ANIMATION FRAME SETUP:');
// Check if there's a RAF loop
console.log('Check manually: Look for requestAnimationFrame calls in Sources tab');

// 6. Get HTML structure of first scroll section
console.log('\n6. FIRST SECTION HTML STRUCTURE:');
const firstSection = document.querySelector('section[id*="home-"], section[data-sticky-module]');
if (firstSection) {
  console.log('Section HTML:', firstSection.outerHTML.substring(0, 500) + '...');
  console.log('Section classes:', firstSection.className);
  console.log('Section data attributes:', Array.from(firstSection.attributes)
    .filter(attr => attr.name.startsWith('data-'))
    .map(attr => `${attr.name}="${attr.value}"`));
}

// 7. Check CSS for scroll-related styles
console.log('\n7. CSS STYLES (first card):');
const firstCard = document.querySelector('.sliding-stack__card, [class*="card"]:not([class*="main"])');
if (firstCard) {
  const styles = getComputedStyle(firstCard);
  console.log({
    position: styles.position,
    top: styles.top,
    left: styles.left,
    transform: styles.transform,
    opacity: styles.opacity,
    zIndex: styles.zIndex,
    willChange: styles.willChange,
  });
}

// 8. Check for any scroll-related JavaScript files
console.log('\n8. SCRIPT SOURCES:');
const scripts = Array.from(document.querySelectorAll('script[src]'));
const scrollScripts = scripts.filter(s => 
  s.src.includes('lenis') || 
  s.src.includes('scroll') || 
  s.src.includes('gsap') ||
  s.src.includes('ScrollTrigger')
);
console.log('Scroll-related scripts:', scrollScripts.map(s => s.src));

console.log('\n=== END DEBUG ===');
console.log('\nCopy all this output and share it with me!');

