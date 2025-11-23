// Simple quick checks for avax.network
// Run this first, then share output

console.log('=== QUICK AVAX.NETWORK CHECKS ===\n');

// 1. Check what's actually on the page
console.log('1. PAGE STRUCTURE:');
console.log('Body classes:', document.body.className);
console.log('HTML classes:', document.documentElement.className);

// 2. Find scroll sections
const sections = document.querySelectorAll('section, [class*="section"]');
console.log(`\n2. SECTIONS: Found ${sections.length}`);
sections.forEach((s, i) => {
  if (i < 5) {
    console.log(`  Section ${i}:`, {
      id: s.id,
      classes: s.className,
      hasCards: s.querySelectorAll('[class*="card"]').length,
    });
  }
});

// 3. Check scroll behavior
console.log('\n3. SCROLL BEHAVIOR:');
let lastScroll = window.scrollY;
let scrollCount = 0;
const scrollHandler = () => {
  scrollCount++;
  const current = window.scrollY;
  const delta = current - lastScroll;
  if (scrollCount <= 3) {
    console.log(`Scroll ${scrollCount}:`, {
      from: lastScroll,
      to: current,
      delta,
      smooth: Math.abs(delta) < 10 ? 'possibly smooth' : 'jumpy',
    });
  }
  lastScroll = current;
};
window.addEventListener('scroll', scrollHandler, { once: false });
console.log('Scroll listener added - scroll the page to see behavior');

// 4. Check for any animation libraries
console.log('\n4. LIBRARIES:');
const libs = {
  gsap: typeof window.gsap !== 'undefined',
  lenis: typeof window.Lenis !== 'undefined' || typeof window.lenis !== 'undefined',
  jquery: typeof window.$ !== 'undefined',
  react: typeof window.React !== 'undefined',
};
console.log('Detected libraries:', libs);

// 5. Get actual HTML of first scrollable section
console.log('\n5. FIRST SECTION HTML:');
const firstSection = document.querySelector('section, [class*="section"]');
if (firstSection) {
  console.log('HTML (first 1000 chars):');
  console.log(firstSection.outerHTML.substring(0, 1000));
}

console.log('\n=== SCROLL THE PAGE NOW TO SEE BEHAVIOR ===');

