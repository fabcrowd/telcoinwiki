// Verify Lenis is actually used on avax.network
// Run this in avax.network console

console.log('=== VERIFYING LENIS USAGE ===\n');

const results = {
  htmlClass: false,
  windowGlobal: false,
  networkFiles: [],
  sourceCode: false,
  initialization: false,
};

// 1. Check HTML class
results.htmlClass = document.documentElement.classList.contains('lenis');
console.log('1. HTML has "lenis" class:', results.htmlClass ? '✅' : '❌');

// 2. Check window globals
results.windowGlobal = typeof window.Lenis !== 'undefined' || 
                       typeof window.lenis !== 'undefined' ||
                       typeof window.l !== 'undefined';
console.log('2. Lenis on window object:', results.windowGlobal ? '✅' : '❌');

// 3. Check Network tab (requires manual inspection)
console.log('\n3. NETWORK FILES CHECK:');
console.log('   Open DevTools → Network tab → Filter by "lenis"');
console.log('   Look for files containing "lenis" in the name');
console.log('   Common patterns:');
console.log('     - *.lenis*.js');
console.log('     - *lenis*.js');
console.log('     - vendor-lenis.js');
console.log('     - chunk-lenis.js');

// 4. Check Sources tab for Lenis code
console.log('\n4. SOURCE CODE CHECK:');
console.log('   Open DevTools → Sources tab → Search for "lenis" or "Lenis"');
console.log('   Look for:');
console.log('     - import Lenis from');
console.log('     - new Lenis(');
console.log('     - lenis.raf(');
console.log('     - lenis.on(');

// 5. Check page source for Lenis
console.log('\n5. PAGE SOURCE CHECK:');
const pageSource = document.documentElement.innerHTML;
const hasLenisImport = pageSource.includes('lenis') || 
                       pageSource.includes('Lenis') ||
                       pageSource.toLowerCase().includes('lenis');
results.sourceCode = hasLenisImport;
console.log('   Page source mentions "lenis":', hasLenisImport ? '✅' : '❌');

// 6. Check for Lenis initialization patterns
console.log('\n6. INITIALIZATION PATTERNS:');
const scripts = Array.from(document.querySelectorAll('script'));
let foundInit = false;
scripts.forEach((script, i) => {
  const content = script.textContent || script.innerHTML || '';
  if (content.includes('new Lenis') || 
      content.includes('lenis.raf') ||
      content.includes('lenis.on') ||
      content.includes('Lenis(')) {
    foundInit = true;
    console.log(`   Found Lenis code in script ${i + 1}:`, script.src || 'inline');
  }
});
results.initialization = foundInit;
console.log('   Found Lenis initialization:', foundInit ? '✅' : '❌');

// 7. Check for Lenis in bundle names
console.log('\n7. BUNDLE FILES:');
const allScripts = Array.from(document.querySelectorAll('script[src]'));
allScripts.forEach(script => {
  const src = script.src.toLowerCase();
  if (src.includes('lenis') || 
      src.includes('vendor') ||
      src.includes('chunk') ||
      src.includes('bundle')) {
    console.log('   ', script.src);
  }
});

// 8. Try to find Lenis instance via prototype chain
console.log('\n8. INSTANCE DETECTION:');
try {
  // Check if any object has Lenis methods
  const testObj = {};
  const hasRaf = typeof testObj.raf === 'function';
  const hasScrollTo = typeof testObj.scrollTo === 'function';
  
  // Check document/window for Lenis-like properties
  const docProps = Object.getOwnPropertyNames(document).filter(p => 
    p.toLowerCase().includes('lenis') || p.toLowerCase().includes('scroll')
  );
  const winProps = Object.getOwnPropertyNames(window).filter(p => 
    p.toLowerCase().includes('lenis') || (p === 'lenisVersion')
  );
  
  console.log('   Document properties:', docProps.length > 0 ? docProps : 'none');
  console.log('   Window properties:', winProps.length > 0 ? winProps : 'none');
  console.log('   lenisVersion:', window.lenisVersion || 'not found');
} catch (e) {
  console.log('   Error checking properties:', e.message);
}

// 9. Check Performance API for Lenis-related entries
console.log('\n9. PERFORMANCE API:');
try {
  const perfEntries = performance.getEntriesByType('resource');
  const lenisResources = perfEntries.filter(entry => 
    entry.name.toLowerCase().includes('lenis')
  );
  if (lenisResources.length > 0) {
    console.log('   Found Lenis resources:');
    lenisResources.forEach(entry => {
      console.log('     -', entry.name);
    });
  } else {
    console.log('   No Lenis resources found in Performance API');
  }
} catch (e) {
  console.log('   Cannot access Performance API');
}

// 10. Manual verification steps
console.log('\n10. MANUAL VERIFICATION STEPS:');
console.log('   a) Open DevTools → Network tab');
console.log('   b) Filter by "JS" or search for "lenis"');
console.log('   c) Reload the page');
console.log('   d) Look for files with "lenis" in the name');
console.log('   e) Open DevTools → Sources tab');
console.log('   f) Press Cmd/Ctrl+F and search for "lenis"');
console.log('   g) Check if you see:');
console.log('      - import Lenis from "lenis"');
console.log('      - new Lenis({...})');
console.log('      - lenis.raf(time)');

// Summary
console.log('\n=== SUMMARY ===');
console.log('HTML class:', results.htmlClass ? '✅' : '❌');
console.log('Window global:', results.windowGlobal ? '✅' : '❌');
console.log('Source code mentions:', results.sourceCode ? '✅' : '❌');
console.log('Initialization found:', results.initialization ? '✅' : '❌');
console.log('\n⚠️  Note: Lenis may be bundled/minified, so it might not be easily detectable.');
console.log('   The "lenis" class on HTML is the strongest indicator.');
console.log('   Check Network tab manually for bundled files.');

// Export results
console.log('\n=== COPY THIS ===');
console.log(JSON.stringify({
  htmlClass: results.htmlClass,
  windowGlobal: results.windowGlobal,
  sourceCode: results.sourceCode,
  initialization: results.initialization,
  lenisVersion: window.lenisVersion || null,
}, null, 2));

