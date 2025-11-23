// Test script for all 5 sections (broken-money, telcoin-model, engine, experience, learn-more)
// Copy and paste this into Chrome Console to test scrolling behavior

(function testAllSections() {
  console.log('=== TESTING ALL 5 SECTIONS ===\n');
  
  const sectionIds = ['broken-money', 'telcoin-model', 'engine', 'experience', 'learn-more'];
  const results = [];
  
  sectionIds.forEach((sectionId, index) => {
    const section = document.querySelector(`#home-${sectionId}[data-sticky-module]`);
    const stack = section?.querySelector('[data-sliding-stack]');
    const mainCard = section?.querySelector('[data-sticky-module-lead]');
    const deck = stack?.querySelector('.sliding-stack__deck');
    const grid = section?.querySelector('div[class*="grid"]');
    
    if (!section || !stack) {
      console.warn(`⚠️ Section ${index + 1} (${sectionId}): Not found`);
      results.push({ section: sectionId, status: 'NOT_FOUND' });
      return;
    }
    
    const sectionRect = section.getBoundingClientRect();
    const deckRect = deck?.getBoundingClientRect();
    const gridRect = grid?.getBoundingClientRect();
    const mainCardRect = mainCard?.getBoundingClientRect();
    
    const sectionStyles = getComputedStyle(section);
    const stackStyles = getComputedStyle(stack);
    const deckStyles = getComputedStyle(deck);
    const gridStyles = getComputedStyle(grid);
    const mainCardStyles = getComputedStyle(mainCard);
    
    const containerHeight = stackStyles.getPropertyValue('--sticky-container-height');
    const expectedDeckHeight = containerHeight ? `${(parseFloat(containerHeight) * 2.5).toFixed(0)}px` : 'N/A';
    
    const cards = stack.querySelectorAll('.sliding-stack__card');
    const cardInfo = Array.from(cards).map((card, i) => {
      const cardStyles = getComputedStyle(card);
      const cardRect = card.getBoundingClientRect();
      return {
        index: i + 1,
        title: card.querySelector('.sliding-stack__tab-text')?.textContent?.trim().substring(0, 25),
        position: cardStyles.position,
        isSticky: cardStyles.position === 'sticky',
        top: cardStyles.top,
        zIndex: cardStyles.zIndex,
        cardTop: cardRect.top.toFixed(0),
      };
    });
    
    const result = {
      section: sectionId,
      index: index + 1,
      hasStickyStack: section.hasAttribute('data-sticky-stack') && stack.hasAttribute('data-sticky-stack'),
      container: {
        cssVar: containerHeight,
        expectedDeckHeight,
      },
      deck: {
        computedHeight: deckStyles.height,
        actualHeight: deckRect?.height.toFixed(0),
        expectedHeight: expectedDeckHeight,
        heightMatch: deckStyles.height === expectedDeckHeight || Math.abs(parseFloat(deckStyles.height) - parseFloat(expectedDeckHeight)) < 100,
      },
      section: {
        computedHeight: sectionStyles.height,
        actualHeight: sectionRect.height.toFixed(0),
        expectedHeight: expectedDeckHeight,
        heightMatch: sectionStyles.height === expectedDeckHeight || Math.abs(parseFloat(sectionStyles.height) - parseFloat(expectedDeckHeight)) < 100,
      },
      grid: {
        computedHeight: gridStyles.height,
        actualHeight: gridRect?.height.toFixed(0),
        expectedHeight: expectedDeckHeight,
        heightMatch: gridStyles.height === expectedDeckHeight || Math.abs(parseFloat(gridStyles.height) - parseFloat(expectedDeckHeight)) < 100,
      },
      mainCard: {
        position: mainCardStyles.position,
        isSticky: mainCardStyles.position === 'sticky',
        top: mainCardStyles.top,
        rectTop: mainCardRect?.top.toFixed(0),
      },
      cards: cardInfo,
      allCardsSticky: cardInfo.every(c => c.isSticky),
      status: 'OK',
    };
    
    // Validate
    if (!result.hasStickyStack) {
      result.status = 'FAIL: Missing data-sticky-stack attribute';
    } else if (!result.deck.heightMatch) {
      result.status = `FAIL: Deck height mismatch (got ${result.deck.computedHeight}, expected ${result.deck.expectedHeight})`;
    } else if (!result.section.heightMatch) {
      result.status = `FAIL: Section height mismatch (got ${result.section.computedHeight}, expected ${result.section.expectedHeight})`;
    } else if (!result.grid.heightMatch) {
      result.status = `FAIL: Grid height mismatch (got ${result.grid.computedHeight}, expected ${result.grid.expectedHeight})`;
    } else if (!result.mainCard.isSticky) {
      result.status = 'FAIL: Main card is not sticky';
    } else if (!result.allCardsSticky) {
      result.status = 'FAIL: Some subcards are not sticky';
    }
    
    results.push(result);
    
    console.log(`\n📋 Section ${index + 1}: ${sectionId}`);
    console.log(`   Status: ${result.status === 'OK' ? '✅ PASS' : '❌ ' + result.status}`);
    console.log(`   Has sticky-stack: ${result.hasStickyStack ? '✅' : '❌'}`);
    console.log(`   Deck height: ${result.deck.computedHeight} (expected: ${result.deck.expectedHeight}) ${result.deck.heightMatch ? '✅' : '❌'}`);
    console.log(`   Section height: ${result.section.computedHeight} (expected: ${result.section.expectedHeight}) ${result.section.heightMatch ? '✅' : '❌'}`);
    console.log(`   Grid height: ${result.grid.computedHeight} (expected: ${result.grid.expectedHeight}) ${result.grid.heightMatch ? '✅' : '❌'}`);
    console.log(`   Main card: ${result.mainCard.position} ${result.mainCard.isSticky ? '✅' : '❌'}`);
    console.log(`   Cards sticky: ${result.allCardsSticky ? `${cards.length} cards ✅` : '❌'}`);
  });
  
  // Summary
  const passed = results.filter(r => r.status === 'OK').length;
  const failed = results.filter(r => r.status !== 'OK').length;
  
  console.log('\n\n=== SUMMARY ===');
  console.log(`✅ Passed: ${passed}/5`);
  console.log(`❌ Failed: ${failed}/5`);
  
  if (failed === 0) {
    console.log('\n🎉 All sections are configured correctly!');
    console.log('Scroll test: As you scroll, cards should:');
    console.log('  1. Pin in place (main card)');
    console.log('  2. Stack on top of each other (subcards)');
    console.log('  3. Unstick together when section/deck bottom reaches viewport top');
  } else {
    console.log('\n⚠️ Some sections have issues. Check details above.');
  }
  
  return results;
})();

