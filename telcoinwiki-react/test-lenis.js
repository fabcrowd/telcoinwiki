// Test Lenis initialization
// Run this in your site's console

console.log('=== LENIS TEST ===\n');

// 1. Check if lenis class exists on HTML
const hasLenisClass = document.documentElement.classList.contains('lenis');
console.log('1. HTML has "lenis" class:', hasLenisClass ? '✅' : '❌');

// 2. Check scroll behavior
let scrollDeltas = [];
let lastScroll = window.scrollY;
const scrollHandler = () => {
  const current = window.scrollY;
  const delta = Math.abs(current - lastScroll);
  scrollDeltas.push(delta);
  if (scrollDeltas.length <= 5) {
    console.log(`   Scroll ${scrollDeltas.length}: delta = ${delta.toFixed(2)}px`);
  }
  lastScroll = current;
};
window.addEventListener('scroll', scrollHandler, { once: false });
console.log('\n2. Scroll listener added - scroll the page to see behavior');

// 3. Check for smooth scrolling (small deltas = smooth)
setTimeout(() => {
  if (scrollDeltas.length > 0) {
    const avgDelta = scrollDeltas.reduce((a, b) => a + b, 0) / scrollDeltas.length;
    const isSmooth = avgDelta < 15; // Smooth scrolling has small deltas
    console.log(`\n3. Average scroll delta: ${avgDelta.toFixed(2)}px`);
    console.log('   Smooth scrolling:', isSmooth ? '✅' : '❌');
  }
}, 3000);

// 4. Check CSS sticky cards
console.log('\n4. CSS Sticky Cards:');
const sections = ['broken-money', 'telcoin-model', 'engine', 'experience', 'learn-more'];
sections.forEach((id) => {
  const section = document.querySelector(`#home-${id}`);
  if (section) {
    const cards = section.querySelectorAll('.sliding-stack__card');
    const stickyCards = Array.from(cards).filter((card) => {
      const styles = getComputedStyle(card);
      return styles.position === 'sticky';
    });
    console.log(`   ${id}: ${stickyCards.length}/${cards.length} cards sticky`);
  }
});

console.log('\n=== END TEST ===');
console.log('\nExpected:');
console.log('  - HTML should have "lenis" class');
console.log('  - Scroll deltas should be small (<15px) for smooth scrolling');
console.log('  - Cards should be position: sticky');

