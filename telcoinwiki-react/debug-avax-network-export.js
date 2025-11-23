// Better export format for avax.network analysis
// Run this in avax.network console, then copy the output

console.log('=== AVAX.NETWORK SCROLL ANALYSIS (EXPORT FORMAT) ===\n');

const exportData = {
  timestamp: new Date().toISOString(),
  url: window.location.href,
  lenis: {
    hasClass: document.documentElement.classList.contains('lenis'),
    version: window.lenisVersion || 'not found',
  },
  sections: [],
  scrollBehavior: {
    scrollY: window.scrollY,
    documentHeight: document.documentElement.scrollHeight,
    viewportHeight: window.innerHeight,
  },
};

// Find scroll sections with cards
const allSections = document.querySelectorAll('section, [class*="section"]');
allSections.forEach((section, i) => {
  const hasCards = section.querySelectorAll('[class*="card"], [class*="stack"]').length > 0;
  const id = section.id || `section-${i}`;
  const classes = section.className || '';
  const classesStr = typeof classes === 'string' ? classes : classes.toString();
  
  if (hasCards || id.includes('home') || classesStr.includes('scroll') || classesStr.includes('insight')) {
    const mainCard = section.querySelector('[class*="main"], [class*="lead"], [data-sticky-module-lead]');
    const cards = section.querySelectorAll('[class*="card"]');
    
    const sectionData = {
      id: id || `section-${i}`,
      classes: classesStr,
      hasCards: cards.length > 0,
      cardCount: cards.length,
      mainCard: null,
      subcards: [],
    };
    
    if (mainCard) {
      const styles = getComputedStyle(mainCard);
      sectionData.mainCard = {
        position: styles.position,
        top: styles.top,
        transform: styles.transform,
      };
    }
    
    if (cards.length > 0) {
      Array.from(cards).slice(0, 5).forEach((card, idx) => {
        const styles = getComputedStyle(card);
        sectionData.subcards.push({
          index: idx + 1,
          position: styles.position,
          top: styles.top,
          transform: styles.transform,
          opacity: styles.opacity,
          zIndex: styles.zIndex,
        });
      });
    }
    
    exportData.sections.push(sectionData);
  }
});

// Export as JSON (easy to copy)
console.log('\n=== COPY THIS JSON ===\n');
console.log(JSON.stringify(exportData, null, 2));

// Also export as readable text
console.log('\n=== READABLE FORMAT ===\n');
console.log(`Lenis class on HTML: ${exportData.lenis.hasClass ? '✅' : '❌'}`);
console.log(`Lenis version: ${exportData.lenis.version}`);
console.log(`\nFound ${exportData.sections.length} scroll sections:\n`);

exportData.sections.forEach((section, i) => {
  console.log(`${i + 1}. ${section.id}`);
  console.log(`   Classes: ${section.classes.substring(0, 100)}${section.classes.length > 100 ? '...' : ''}`);
  console.log(`   Cards: ${section.cardCount}`);
  if (section.mainCard) {
    console.log(`   Main card: position=${section.mainCard.position}, top=${section.mainCard.top}`);
  }
  if (section.subcards.length > 0) {
    console.log(`   Subcards (first ${section.subcards.length}):`);
    section.subcards.forEach(card => {
      console.log(`     - position=${card.position}, top=${card.top}, transform=${card.transform !== 'none' ? card.transform.substring(0, 30) : 'none'}`);
    });
  }
  console.log('');
});

console.log('\n=== END EXPORT ===');
console.log('\n💡 Tip: Copy the JSON section above for easy sharing!');

