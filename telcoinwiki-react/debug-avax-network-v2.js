// Comprehensive avax.network scroll implementation analysis
// Run this in avax.network console

console.log('=== AVAX.NETWORK SCROLL ANALYSIS ===\n');

// 1. Check all global variables that might be scroll-related
console.log('1. GLOBAL VARIABLES:');
const scrollGlobals = Object.keys(window).filter(key => 
  key.toLowerCase().includes('scroll') || 
  key.toLowerCase().includes('lenis') ||
  key.toLowerCase().includes('smooth') ||
  key === 'l' || key === 'b' || key === 'A'
);
console.log('Scroll-related globals:', scrollGlobals);
scrollGlobals.forEach(key => {
  try {
    const val = window[key];
    if (typeof val === 'object' && val !== null) {
      console.log(`  ${key}:`, {
        type: typeof val,
        constructor: val.constructor?.name,
        hasRaf: typeof val.raf === 'function',
        hasScrollTo: typeof val.scrollTo === 'function',
        hasOn: typeof val.on === 'function',
      });
    }
  } catch (e) {}
});

// 2. Check all script tags and their sources
console.log('\n2. LOADED SCRIPTS:');
const scripts = Array.from(document.querySelectorAll('script[src]'));
console.log(`Total scripts: ${scripts.length}`);
scripts.forEach((script, i) => {
  const src = script.src;
  if (src.includes('lenis') || src.includes('gsap') || src.includes('scroll') || 
      src.includes('avax') || src.includes('chunk') || src.includes('index')) {
    console.log(`  Script ${i + 1}:`, src);
  }
});

// 3. Check inline scripts
console.log('\n3. INLINE SCRIPTS:');
const inlineScripts = Array.from(document.querySelectorAll('script:not([src])'));
console.log(`Found ${inlineScripts.length} inline scripts`);
inlineScripts.forEach((script, i) => {
  const content = script.textContent || script.innerHTML;
  if (content.includes('lenis') || content.includes('Lenis') || 
      content.includes('ScrollTrigger') || content.includes('scroll')) {
    console.log(`  Inline script ${i + 1} (first 200 chars):`, content.substring(0, 200));
  }
});

// 4. Find actual scroll sections by inspecting DOM
console.log('\n4. DOM STRUCTURE ANALYSIS:');
const allSections = document.querySelectorAll('section, [class*="section"], [id*="section"]');
console.log(`Found ${allSections.length} potential sections`);

// Look for sections with cards or scrollable content
allSections.forEach((section, i) => {
  const hasCards = section.querySelectorAll('[class*="card"], [class*="stack"]').length > 0;
  const hasSticky = section.querySelectorAll('[style*="sticky"], [style*="fixed"]').length > 0;
  const id = section.id || `section-${i}`;
  const classes = section.className || '';
  const classesStr = typeof classes === 'string' ? classes : classes.toString();
  
  if (hasCards || hasSticky || id.includes('home') || classesStr.includes('scroll')) {
    console.log(`\n  Section ${i} (${id}):`, {
      classes: classesStr,
      hasCards,
      hasSticky,
      children: section.children.length,
      cards: section.querySelectorAll('[class*="card"]').length,
    });
    
    // Check main card
    const mainCard = section.querySelector('[class*="main"], [class*="lead"], [data-sticky-module-lead]');
    if (mainCard) {
      const styles = getComputedStyle(mainCard);
      console.log('    Main card:', {
        position: styles.position,
        top: styles.top,
        transform: styles.transform,
      });
    }
    
    // Check subcards
    const cards = section.querySelectorAll('[class*="card"]:not([class*="main"])');
    if (cards.length > 0) {
      console.log(`    Subcards (${cards.length}):`);
      Array.from(cards).slice(0, 3).forEach((card, idx) => {
        const styles = getComputedStyle(card);
        console.log(`      Card ${idx + 1}:`, {
          position: styles.position,
          top: styles.top,
          transform: styles.transform,
          opacity: styles.opacity,
          zIndex: styles.zIndex,
        });
      });
    }
  }
});

// 5. Check for any scroll event handlers on document/body
console.log('\n5. SCROLL EVENT HANDLERS:');
try {
  const docListeners = getEventListeners?.(document)?.scroll || [];
  const bodyListeners = getEventListeners?.(document.body)?.scroll || [];
  const winListeners = getEventListeners?.(window)?.scroll || [];
  console.log('Document scroll listeners:', docListeners.length);
  console.log('Body scroll listeners:', bodyListeners.length);
  console.log('Window scroll listeners:', winListeners.length);
} catch (e) {
  console.log('Cannot access event listeners (need DevTools)');
}

// 6. Check for requestAnimationFrame usage
console.log('\n6. ANIMATION FRAME:');
// Override RAF to detect usage
let rafCount = 0;
const originalRAF = window.requestAnimationFrame;
window.requestAnimationFrame = function(...args) {
  rafCount++;
  if (rafCount <= 5) {
    console.log(`RAF call ${rafCount}:`, args[0]?.toString().substring(0, 100));
  }
  return originalRAF.apply(this, args);
};
console.log('Monitoring RAF calls (scroll to trigger)...');

// 7. Check scroll behavior
console.log('\n7. SCROLL BEHAVIOR:');
console.log('Current scroll:', {
  scrollY: window.scrollY,
  pageYOffset: window.pageYOffset,
  documentHeight: document.documentElement.scrollHeight,
  viewportHeight: window.innerHeight,
});

// 8. Look for any data attributes that might indicate scroll setup
console.log('\n8. DATA ATTRIBUTES:');
const elementsWithData = document.querySelectorAll('[data-scroll], [data-lenis], [data-gsap], [data-trigger]');
console.log(`Found ${elementsWithData.length} elements with scroll-related data attributes`);
elementsWithData.forEach((el, i) => {
  if (i < 5) {
    const attrs = Array.from(el.attributes)
      .filter(attr => attr.name.startsWith('data-'))
      .map(attr => `${attr.name}="${attr.value}"`);
    console.log(`  Element ${i + 1}:`, attrs);
  }
});

// 9. Check CSS for scroll-related classes
console.log('\n9. CSS CLASSES:');
const scrollClasses = Array.from(document.querySelectorAll('[class*="scroll"], [class*="lenis"], [class*="smooth"]'));
console.log(`Found ${scrollClasses.length} elements with scroll-related classes`);
scrollClasses.slice(0, 5).forEach((el, i) => {
  console.log(`  Element ${i + 1}:`, el.className);
});

// 10. Check for any scroll-related modules in the page
console.log('\n10. MODULE INSPECTION:');
// Try to find the actual scroll implementation
const pageText = document.documentElement.innerHTML;
const hasLenis = pageText.includes('lenis') || pageText.includes('Lenis');
const hasScrollTrigger = pageText.includes('ScrollTrigger') || pageText.includes('scroll-trigger');
const hasSmoothScroll = pageText.includes('smooth') && pageText.includes('scroll');

console.log('Code analysis:', {
  mentionsLenis: hasLenis,
  mentionsScrollTrigger: hasScrollTrigger,
  mentionsSmoothScroll: hasSmoothScroll,
});

// 11. Check network requests for scroll libraries
console.log('\n11. NETWORK REQUESTS:');
console.log('Check Network tab in DevTools for:');
console.log('  - Files containing "lenis", "gsap", "scroll", "smooth"');
console.log('  - Look at the Sources tab for bundled code');

// 12. Try to find the actual scroll implementation by checking common patterns
console.log('\n12. IMPLEMENTATION PATTERNS:');
// Check if there's a scroll container
const scrollContainer = document.documentElement.scrollHeight > window.innerHeight 
  ? document.documentElement 
  : document.body;
console.log('Scroll container:', {
  element: scrollContainer.tagName,
  scrollHeight: scrollContainer.scrollHeight,
  clientHeight: scrollContainer.clientHeight,
  overflow: getComputedStyle(scrollContainer).overflow,
});

// Check for any transform/translate on scroll
let transformElements = [];
document.querySelectorAll('*').forEach(el => {
  const transform = getComputedStyle(el).transform;
  if (transform && transform !== 'none') {
    transformElements.push({
      tag: el.tagName,
      class: el.className,
      transform: transform.substring(0, 50),
    });
  }
});
if (transformElements.length > 0) {
  console.log(`Found ${transformElements.length} elements with transforms (first 3):`);
  transformElements.slice(0, 3).forEach(item => console.log('  ', item));
}

console.log('\n=== END ANALYSIS ===');
console.log('\nNext steps:');
console.log('1. Check Network tab for loaded JavaScript files');
console.log('2. Check Sources tab for scroll-related code');
console.log('3. Scroll the page and watch for RAF calls above');
console.log('4. Inspect elements while scrolling to see style changes');

