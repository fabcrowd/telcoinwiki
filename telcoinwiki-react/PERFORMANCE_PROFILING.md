# Performance Profiling Commands

## Quick Start - Copy/Paste These in Browser Console

### All-in-One Performance Monitor
```javascript
// Run this first - monitors FPS, memory, and scroll performance
(function() {
  // FPS Monitor
  let lastTime = performance.now();
  let frameCount = 0;
  let fps = 0;
  const fpsEl = document.createElement('div');
  fpsEl.style.cssText = 'position:fixed;top:10px;right:10px;background:rgba(0,0,0,0.8);color:#0f0;padding:10px;z-index:99999;font-family:monospace;';
  document.body.appendChild(fpsEl);
  
  function measureFPS() {
    frameCount++;
    const currentTime = performance.now();
    if (currentTime >= lastTime + 1000) {
      fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
      fpsEl.textContent = `FPS: ${fps}`;
      if (fps < 30) fpsEl.style.color = '#f00';
      else if (fps < 50) fpsEl.style.color = '#ff0';
      else fpsEl.style.color = '#0f0';
      frameCount = 0;
      lastTime = currentTime;
    }
    requestAnimationFrame(measureFPS);
  }
  measureFPS();
  
  // Memory Monitor (Chrome only)
  if (performance.memory) {
    setInterval(() => {
      const mem = performance.memory;
      console.log('Memory:', {
        used: (mem.usedJSHeapSize / 1048576).toFixed(2) + ' MB',
        total: (mem.totalJSHeapSize / 1048576).toFixed(2) + ' MB'
      });
    }, 5000);
  }
  
  // Scroll Performance
  let scrollCount = 0;
  let lastScrollTime = performance.now();
  window.addEventListener('scroll', () => {
    scrollCount++;
    const now = performance.now();
    if (now - lastScrollTime > 1000) {
      console.log('Scroll events/sec:', scrollCount);
      scrollCount = 0;
      lastScrollTime = now;
    }
  }, { passive: true });
  
  console.log('Performance monitor started! FPS counter in top-right corner.');
})();
```

## Browser Console Commands

### 1. Monitor FPS
```javascript
// Create FPS monitor
let lastTime = performance.now();
let frameCount = 0;
let fps = 0;

function measureFPS() {
  frameCount++;
  const currentTime = performance.now();
  if (currentTime >= lastTime + 1000) {
    fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
    console.log('FPS:', fps);
    frameCount = 0;
    lastTime = currentTime;
  }
  requestAnimationFrame(measureFPS);
}
measureFPS();
```

### 2. Monitor Layout Thrashing (Forced Reflows)
```javascript
// Detect forced synchronous layouts
const originalGetBoundingClientRect = Element.prototype.getBoundingClientRect;
let layoutCount = 0;
Element.prototype.getBoundingClientRect = function() {
  layoutCount++;
  if (layoutCount > 10) {
    console.warn('Potential layout thrashing detected:', layoutCount, 'layouts in one frame');
  }
  return originalGetBoundingClientRect.apply(this, arguments);
};
```

### 3. Monitor Paint/Composite Operations
```javascript
// Check for expensive paint operations
performance.getEntriesByType('measure').forEach(entry => {
  if (entry.duration > 16) {
    console.warn('Slow operation:', entry.name, entry.duration + 'ms');
  }
});
```

### 4. Memory Usage
```javascript
// Check memory usage (Chrome only)
if (performance.memory) {
  console.log('Memory:', {
    used: (performance.memory.usedJSHeapSize / 1048576).toFixed(2) + ' MB',
    total: (performance.memory.totalJSHeapSize / 1048576).toFixed(2) + ' MB',
    limit: (performance.memory.jsHeapSizeLimit / 1048576).toFixed(2) + ' MB'
  });
}
```

### 5. Find Elements with Will-Change
```javascript
// Find all elements using will-change (can be expensive)
Array.from(document.querySelectorAll('*')).forEach(el => {
  const style = window.getComputedStyle(el);
  if (style.willChange !== 'auto') {
    console.log('will-change:', el, style.willChange);
  }
});
```

### 6. Find Elements with Transform/Opacity Animations
```javascript
// Find elements with CSS animations
Array.from(document.querySelectorAll('*')).forEach(el => {
  const style = window.getComputedStyle(el);
  if (style.animationName !== 'none' || style.transitionProperty !== 'none') {
    console.log('Animation:', el, {
      animation: style.animationName,
      transition: style.transitionProperty
    });
  }
});
```

### 7. Monitor Scroll Performance
```javascript
// Track scroll event frequency
let scrollCount = 0;
let lastScrollTime = performance.now();
window.addEventListener('scroll', () => {
  scrollCount++;
  const now = performance.now();
  if (now - lastScrollTime > 1000) {
    console.log('Scroll events per second:', scrollCount);
    scrollCount = 0;
    lastScrollTime = now;
  }
}, { passive: true });
```

### 8. Find Heavy Event Listeners
```javascript
// Count event listeners (approximate)
const listeners = getEventListeners(window);
console.log('Window event listeners:', Object.keys(listeners).length);
```

### 9. Performance Timeline
```javascript
// Record performance timeline
performance.mark('start');
// ... do something ...
performance.mark('end');
performance.measure('operation', 'start', 'end');
console.log(performance.getEntriesByType('measure'));
```

### 10. Check for Large DOM Nodes
```javascript
// Find large DOM subtrees
function getNodeSize(node) {
  let size = 1;
  for (let child = node.firstChild; child; child = child.nextSibling) {
    size += getNodeSize(child);
  }
  return size;
}

Array.from(document.querySelectorAll('*'))
  .map(el => ({ el, size: getNodeSize(el) }))
  .sort((a, b) => b.size - a.size)
  .slice(0, 10)
  .forEach(({ el, size }) => {
    console.log('Large DOM node:', el, size, 'nodes');
  });
```

## Chrome DevTools

### Performance Panel
1. Open DevTools (F12)
2. Go to Performance tab
3. Click Record
4. Scroll/interact with the page
5. Stop recording
6. Look for:
   - Long tasks (>50ms)
   - Layout shifts
   - Paint operations
   - JavaScript execution time

### Rendering Panel
1. Open DevTools (F12)
2. Press `Ctrl+Shift+P` (Cmd+Shift+P on Mac)
3. Type "Show Rendering"
4. Enable:
   - "Paint flashing" - shows what's being repainted
   - "Layer borders" - shows compositor layers
   - "FPS meter" - shows real-time FPS

### Lighthouse Audit
1. Open DevTools (F12)
2. Go to Lighthouse tab
3. Select "Performance"
4. Click "Analyze page load"
5. Review:
   - Performance score
   - First Contentful Paint
   - Largest Contentful Paint
   - Cumulative Layout Shift
   - Total Blocking Time

## Network Analysis
```javascript
// Check for large resources
performance.getEntriesByType('resource')
  .filter(r => r.transferSize > 100000) // >100KB
  .sort((a, b) => b.transferSize - a.transferSize)
  .forEach(r => {
    console.log('Large resource:', r.name, (r.transferSize / 1024).toFixed(2) + ' KB');
  });
```

## Mobile-Specific Profiling

### Remote Debugging (Chrome DevTools)
1. **Android (Chrome)**:
   - Enable USB debugging on device
   - Connect via USB
   - Open `chrome://inspect` in desktop Chrome
   - Click "inspect" on your device

2. **iOS (Safari)**:
   - Enable Web Inspector: Settings → Safari → Advanced → Web Inspector
   - Connect via USB
   - Open Safari on Mac → Develop → [Your Device] → [Your Page]

3. **Wireless Debugging (Android)**:
   - Enable "Wireless debugging" in Developer Options
   - Use Chrome's `chrome://inspect` with "Discover network targets"

### Mobile Console Commands
```javascript
// Mobile-friendly FPS monitor (works on both desktop and mobile)
(function() {
  const monitor = {
    fps: 0,
    frameCount: 0,
    lastTime: performance.now(),
    start() {
      const update = () => {
        this.frameCount++;
        const now = performance.now();
        if (now >= this.lastTime + 1000) {
          this.fps = Math.round((this.frameCount * 1000) / (now - this.lastTime));
          console.log('FPS:', this.fps);
          this.frameCount = 0;
          this.lastTime = now;
        }
        requestAnimationFrame(() => update());
      };
      update();
    }
  };
  monitor.start();
  window.perfMonitor = monitor; // Access via window.perfMonitor
})();
```

### Mobile Performance API
```javascript
// Check if Performance API is available (works on mobile)
if ('PerformanceObserver' in window) {
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.duration > 16) { // > 1 frame
        console.warn('Slow operation:', entry.name, entry.duration.toFixed(2) + 'ms');
      }
    }
  });
  observer.observe({ entryTypes: ['measure', 'navigation', 'resource'] });
}
```

## React Profiler (if using React DevTools)
1. Install React DevTools extension
2. Open DevTools → Profiler tab
3. Click Record
4. Interact with the page
5. Stop recording
6. Review component render times

## Quick Performance Report
```javascript
// Run this to get a quick performance overview
(function() {
  const report = {
    fps: 0,
    memory: null,
    resources: [],
    layoutShifts: 0,
    longTasks: 0
  };
  
  // FPS
  let frameCount = 0;
  let lastTime = performance.now();
  const checkFPS = () => {
    frameCount++;
    const now = performance.now();
    if (now >= lastTime + 1000) {
      report.fps = Math.round((frameCount * 1000) / (now - lastTime));
      frameCount = 0;
      lastTime = now;
    }
    requestAnimationFrame(checkFPS);
  };
  checkFPS();
  
  // Memory
  if (performance.memory) {
    report.memory = {
      used: (performance.memory.usedJSHeapSize / 1048576).toFixed(2) + ' MB',
      total: (performance.memory.totalJSHeapSize / 1048576).toFixed(2) + ' MB'
    };
  }
  
  // Resources
  report.resources = performance.getEntriesByType('resource')
    .filter(r => r.transferSize > 50000)
    .sort((a, b) => b.transferSize - a.transferSize)
    .slice(0, 10)
    .map(r => ({
      name: r.name.split('/').pop(),
      size: (r.transferSize / 1024).toFixed(2) + ' KB',
      duration: r.duration.toFixed(2) + ' ms'
    }));
  
  setTimeout(() => {
    console.table(report);
    console.log('Full report:', report);
  }, 2000);
})();
```

