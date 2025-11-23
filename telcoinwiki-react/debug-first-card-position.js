// Run this in the browser console (F12) to diagnose first card positioning
// Copy and paste the entire script into the console

(function() {
  console.log('=== FIRST CARD POSITIONING DIAGNOSTIC ===\n');
  
  // Find the first section
  const firstSection = document.querySelector('#home-broken-money');
  if (!firstSection) {
    console.error('❌ Could not find #home-broken-money section');
    return;
  }
  
  const deck = firstSection.querySelector('[data-sliding-stack][data-sticky-stack] .sliding-stack__deck');
  if (!deck) {
    console.error('❌ Could not find deck');
    return;
  }
  
  const firstCard = deck.querySelector(':first-child');
  if (!firstCard) {
    console.error('❌ Could not find first card');
    return;
  }
  
  const header = document.querySelector('header, [role="banner"], .header, [class*="header"]');
  const headerHeight = header ? header.getBoundingClientRect().height : 0;
  
  // Get computed styles
  const cardStyles = window.getComputedStyle(firstCard);
  const deckStyles = window.getComputedStyle(deck);
  const sectionStyles = window.getComputedStyle(firstSection);
  
  // Get bounding boxes
  const cardRect = firstCard.getBoundingClientRect();
  const deckRect = deck.getBoundingClientRect();
  const sectionRect = firstSection.getBoundingClientRect();
  const viewportHeight = window.innerHeight;
  
  const data = {
    header: {
      element: header ? header.tagName : 'not found',
      height: headerHeight,
      top: header ? header.getBoundingClientRect().top : 0,
    },
    firstCard: {
      marginTop: cardStyles.marginTop,
      marginTopComputed: parseFloat(cardStyles.marginTop) || 0,
      paddingTop: cardStyles.paddingTop,
      position: cardStyles.position,
      top: cardStyles.top,
      transform: cardStyles.transform,
      rect: {
        top: cardRect.top,
        bottom: cardRect.bottom,
        height: cardRect.height,
        distanceFromViewportTop: cardRect.top,
        distanceFromHeaderBottom: cardRect.top - headerHeight,
      },
    },
    deck: {
      marginTop: deckStyles.marginTop,
      marginTopComputed: parseFloat(deckStyles.marginTop) || 0,
      paddingTop: deckStyles.paddingTop,
      position: deckStyles.position,
      rect: {
        top: deckRect.top,
        bottom: deckRect.bottom,
        height: deckRect.height,
      },
    },
    section: {
      marginTop: sectionStyles.marginTop,
      paddingTop: sectionStyles.paddingTop,
      position: sectionStyles.position,
      rect: {
        top: sectionRect.top,
        bottom: sectionRect.bottom,
        height: sectionRect.height,
      },
    },
    viewport: {
      height: viewportHeight,
      scrollY: window.scrollY,
    },
    cssVariables: {
      '--header-height': getComputedStyle(document.documentElement).getPropertyValue('--header-height').trim(),
      '--padding-md': getComputedStyle(document.documentElement).getPropertyValue('--padding-md').trim(),
      '--sticky-container-height': getComputedStyle(firstCard).getPropertyValue('--sticky-container-height').trim(),
    },
  };
  
  console.log('📊 HEADER:');
  console.log(`  Height: ${data.header.height}px`);
  console.log(`  Top: ${data.header.top}px`);
  console.log('');
  
  console.log('📊 FIRST CARD:');
  console.log(`  margin-top: ${data.firstCard.marginTop} (computed: ${data.firstCard.marginTopComputed}px)`);
  console.log(`  padding-top: ${data.firstCard.paddingTop}`);
  console.log(`  position: ${data.firstCard.position}`);
  console.log(`  top: ${data.firstCard.top}`);
  console.log(`  transform: ${data.firstCard.transform}`);
  console.log(`  Card top edge: ${data.firstCard.rect.top}px from viewport top`);
  console.log(`  Card distance from header bottom: ${data.firstCard.rect.distanceFromHeaderBottom}px`);
  console.log(`  Card height: ${data.firstCard.rect.height}px`);
  console.log('');
  
  console.log('📊 DECK:');
  console.log(`  margin-top: ${data.deck.marginTop} (computed: ${data.deck.marginTopComputed}px)`);
  console.log(`  padding-top: ${data.deck.paddingTop}`);
  console.log(`  position: ${data.deck.position}`);
  console.log(`  Deck top edge: ${data.deck.rect.top}px from viewport top`);
  console.log(`  Deck height: ${data.deck.rect.height}px`);
  console.log('');
  
  console.log('📊 SECTION:');
  console.log(`  margin-top: ${data.section.marginTop}`);
  console.log(`  padding-top: ${data.section.paddingTop}`);
  console.log(`  position: ${data.section.position}`);
  console.log(`  Section top edge: ${data.section.rect.top}px from viewport top`);
  console.log(`  Section height: ${data.section.rect.height}px`);
  console.log('');
  
  console.log('📊 VIEWPORT:');
  console.log(`  Height: ${data.viewport.height}px`);
  console.log(`  Scroll Y: ${data.viewport.scrollY}px`);
  console.log('');
  
  console.log('📊 CSS VARIABLES:');
  Object.entries(data.cssVariables).forEach(([key, value]) => {
    console.log(`  ${key}: ${value || '(not set)'}`);
  });
  console.log('');
  
  // Analysis
  console.log('🔍 ANALYSIS:');
  const cardTopFromViewport = data.firstCard.rect.top;
  const headerBottom = data.header.height;
  const desiredSpacing = 50; // pixels below header
  
  if (cardTopFromViewport < headerBottom) {
    console.log(`  ⚠️  Card is COVERED by header!`);
    console.log(`     Card top: ${cardTopFromViewport}px, Header bottom: ${headerBottom}px`);
    console.log(`     Need to move card down by: ${headerBottom - cardTopFromViewport + desiredSpacing}px`);
  } else {
    console.log(`  ✅ Card is visible below header`);
    console.log(`     Card top: ${cardTopFromViewport}px, Header bottom: ${headerBottom}px`);
    console.log(`     Current spacing: ${cardTopFromViewport - headerBottom}px`);
  }
  
  console.log('');
  console.log('=== COPY THIS JSON ===');
  console.log(JSON.stringify(data, null, 2));
  
  return data;
})();

