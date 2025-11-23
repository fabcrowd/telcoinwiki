// Run this in the browser console (F12) to diagnose Telcoin Model section pinning
// Copy and paste the entire script into the console

(function() {
  console.log('=== TELCOIN MODEL PINNING DIAGNOSTIC ===\n');
  
  // Find the Telcoin Model section
  const section = document.querySelector('#home-telcoin-model');
  if (!section) {
    console.error('❌ Could not find #home-telcoin-model section');
    return;
  }
  
  const mainCard = section.querySelector('[data-sticky-module-lead]');
  if (!mainCard) {
    console.error('❌ Could not find main card [data-sticky-module-lead]');
    return;
  }
  
  const header = document.querySelector('header, [role="banner"], .header, [class*="header"]');
  const headerHeight = header ? header.getBoundingClientRect().height : 0;
  
  // Get computed styles
  const sectionStyles = window.getComputedStyle(section);
  const mainCardStyles = window.getComputedStyle(mainCard);
  const container = section.querySelector('div > div[class*="grid"]');
  const containerStyles = container ? window.getComputedStyle(container) : null;
  
  // Get bounding boxes
  const sectionRect = section.getBoundingClientRect();
  const mainCardRect = mainCard.getBoundingClientRect();
  const containerRect = container ? container.getBoundingClientRect() : null;
  const viewportHeight = window.innerHeight;
  
  const data = {
    section: {
      id: section.id,
      hasDataStickyModule: section.hasAttribute('data-sticky-module'),
      hasDataStickyStack: section.hasAttribute('data-sticky-stack'),
      className: section.className,
      position: sectionStyles.position,
      isolation: sectionStyles.isolation,
      display: sectionStyles.display,
      height: sectionStyles.height,
      minHeight: sectionStyles.minHeight,
      computedHeight: sectionRect.height,
      rect: {
        top: sectionRect.top,
        bottom: sectionRect.bottom,
        height: sectionRect.height,
      },
    },
    mainCard: {
      hasDataStickyModuleLead: mainCard.hasAttribute('data-sticky-module-lead'),
      className: mainCard.className,
      position: mainCardStyles.position,
      top: mainCardStyles.top,
      computedTop: parseFloat(mainCardStyles.top) || 0,
      zIndex: mainCardStyles.zIndex,
      alignSelf: mainCardStyles.alignSelf,
      transform: mainCardStyles.transform,
      willChange: mainCardStyles.willChange,
      rect: {
        top: mainCardRect.top,
        bottom: mainCardRect.bottom,
        height: mainCardRect.height,
        distanceFromViewportTop: mainCardRect.top,
        distanceFromHeaderBottom: mainCardRect.top - headerHeight,
      },
    },
    container: container ? {
      className: container.className,
      position: containerStyles.position,
      height: containerStyles.height,
      minHeight: containerStyles.minHeight,
      computedHeight: containerRect.height,
      rect: {
        top: containerRect.top,
        bottom: containerRect.bottom,
        height: containerRect.height,
      },
    } : null,
    header: {
      element: header ? header.tagName : 'not found',
      height: headerHeight,
      top: header ? header.getBoundingClientRect().top : 0,
    },
    viewport: {
      height: viewportHeight,
      scrollY: window.scrollY,
    },
    cssVariables: {
      '--header-height': getComputedStyle(document.documentElement).getPropertyValue('--header-height').trim(),
      '--padding-md': getComputedStyle(document.documentElement).getPropertyValue('--padding-md').trim(),
      '--sticky-container-height': getComputedStyle(section).getPropertyValue('--sticky-container-height').trim(),
    },
    matchingRules: {
      generalRule: '[data-sticky-module][data-sticky-stack] [data-sticky-module-lead]',
      specificRule: '#home-telcoin-model[data-sticky-module][data-sticky-stack] [data-sticky-module-lead]',
    },
  };
  
  console.log('📊 SECTION:');
  console.log(`  ID: ${data.section.id}`);
  console.log(`  Has data-sticky-module: ${data.section.hasDataStickyModule}`);
  console.log(`  Has data-sticky-stack: ${data.section.hasDataStickyStack}`);
  console.log(`  Class: ${data.section.className}`);
  console.log(`  Position: ${data.section.position}`);
  console.log(`  Isolation: ${data.section.isolation}`);
  console.log(`  Display: ${data.section.display}`);
  console.log(`  Height: ${data.section.height} (computed: ${data.section.computedHeight}px)`);
  console.log(`  Min-height: ${data.section.minHeight}`);
  console.log(`  Section top: ${data.section.rect.top}px from viewport`);
  console.log('');
  
  console.log('📊 MAIN CARD:');
  console.log(`  Has data-sticky-module-lead: ${data.mainCard.hasDataStickyModuleLead}`);
  console.log(`  Class: ${data.mainCard.className}`);
  console.log(`  Position: ${data.mainCard.position} (should be sticky)`);
  console.log(`  Top: ${data.mainCard.top} (computed: ${data.mainCard.computedTop}px)`);
  console.log(`  Z-index: ${data.mainCard.zIndex}`);
  console.log(`  Align-self: ${data.mainCard.alignSelf}`);
  console.log(`  Transform: ${data.mainCard.transform}`);
  console.log(`  Will-change: ${data.mainCard.willChange}`);
  console.log(`  Card top: ${data.mainCard.rect.top}px from viewport`);
  console.log(`  Card distance from header bottom: ${data.mainCard.rect.distanceFromHeaderBottom}px`);
  console.log(`  Card height: ${data.mainCard.rect.height}px`);
  console.log('');
  
  if (data.container) {
    console.log('📊 CONTAINER (grid):');
    console.log(`  Class: ${data.container.className}`);
    console.log(`  Position: ${data.container.position}`);
    console.log(`  Height: ${data.container.height} (computed: ${data.container.computedHeight}px)`);
    console.log(`  Min-height: ${data.container.minHeight}`);
    console.log(`  Container top: ${data.container.rect.top}px from viewport`);
    console.log('');
  }
  
  console.log('📊 HEADER:');
  console.log(`  Height: ${data.header.height}px`);
  console.log(`  Top: ${data.header.top}px`);
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
  
  // Check for matching CSS rules
  console.log('🔍 CSS RULE MATCHING:');
  const stylesheets = Array.from(document.styleSheets);
  let foundGeneralRule = false;
  let foundSpecificRule = false;
  
  stylesheets.forEach((sheet, sheetIndex) => {
    try {
      const rules = Array.from(sheet.cssRules || sheet.rules || []);
      rules.forEach((rule, ruleIndex) => {
        if (rule.selectorText) {
          if (rule.selectorText.includes('[data-sticky-module][data-sticky-stack] [data-sticky-module-lead]')) {
            foundGeneralRule = true;
            console.log(`  ✅ Found general rule in stylesheet ${sheetIndex}, rule ${ruleIndex}`);
            console.log(`     Selector: ${rule.selectorText}`);
            console.log(`     Position: ${rule.style.position}`);
            console.log(`     Top: ${rule.style.top}`);
          }
          if (rule.selectorText.includes('#home-telcoin-model[data-sticky-module][data-sticky-stack] [data-sticky-module-lead]')) {
            foundSpecificRule = true;
            console.log(`  ✅ Found specific rule in stylesheet ${sheetIndex}, rule ${ruleIndex}`);
            console.log(`     Selector: ${rule.selectorText}`);
            console.log(`     Position: ${rule.style.position}`);
            console.log(`     Top: ${rule.style.top}`);
          }
        }
      });
    } catch (e) {
      // Cross-origin stylesheet, skip
    }
  });
  
  if (!foundGeneralRule) {
    console.log('  ⚠️  General rule not found in stylesheets');
  }
  if (!foundSpecificRule) {
    console.log('  ⚠️  Specific rule not found in stylesheets');
  }
  console.log('');
  
  // Analysis
  console.log('🔍 ANALYSIS:');
  const issues = [];
  
  if (!data.section.hasDataStickyModule) {
    issues.push('❌ Section missing data-sticky-module attribute');
  }
  if (!data.section.hasDataStickyStack) {
    issues.push('❌ Section missing data-sticky-stack attribute');
  }
  if (!data.mainCard.hasDataStickyModuleLead) {
    issues.push('❌ Main card missing data-sticky-module-lead attribute');
  }
  if (data.mainCard.position !== 'sticky') {
    issues.push(`❌ Main card position is "${data.mainCard.position}" but should be "sticky"`);
  }
  if (data.section.position !== 'relative') {
    issues.push(`⚠️  Section position is "${data.section.position}" but should be "relative" for sticky to work`);
  }
  if (parseFloat(data.section.height) === 0 || !data.section.height.includes('vh')) {
    issues.push(`⚠️  Section height might be too small: ${data.section.height}`);
  }
  
  if (issues.length === 0) {
    console.log('  ✅ All checks passed - structure looks correct');
    console.log(`  📌 Expected pin location: ${data.mainCard.computedTop}px from top`);
    console.log(`  📌 Current card position: ${data.mainCard.rect.top}px from viewport top`);
    if (data.mainCard.rect.top < data.mainCard.computedTop + headerHeight) {
      console.log('  ⚠️  Card might be above expected pin location - scroll down to see if it sticks');
    }
  } else {
    issues.forEach(issue => console.log(`  ${issue}`));
  }
  
  console.log('');
  console.log('=== COPY THIS JSON ===');
  console.log(JSON.stringify(data, null, 2));
  
  return data;
})();

