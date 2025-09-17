(function () {
  const FOCUSABLE_SELECTORS = [
    'a[href]',
    'button:not([disabled])',
    'textarea:not([disabled])',
    'input:not([type="hidden"]):not([disabled])',
    'select:not([disabled])',
    '[tabindex]:not([tabindex="-1"])'
  ].join(',');

  function normalise(text) {
    return text ? text.trim().replace(/\s+/g, ' ') : '';
  }

  function buildDataset() {
    const nodes = document.querySelectorAll('main h1, main h2, main h3, main h4, main p, main li');
    const dataset = [];
    let counter = 0;

    nodes.forEach((node) => {
      const text = normalise(node.textContent || '');
      if (!text || text.length < 12) return;

      let target = node.id;
      if (!target) {
        const parentWithId = node.closest('[id]');
        if (parentWithId) {
          target = parentWithId.id;
        } else {
          counter += 1;
          target = `section-${counter}`;
          node.id = target;
        }
      }

      dataset.push({
        node,
        text,
        lowercase: text.toLowerCase(),
        anchor: `#${target}`
      });
    });

    return dataset;
  }

  function highlight(text, query) {
    const index = text.toLowerCase().indexOf(query.toLowerCase());
    if (index === -1) return text;
    const before = text.slice(0, index);
    const match = text.slice(index, index + query.length);
    const after = text.slice(index + query.length);
    return `${before}<mark>${match}</mark>${after}`;
  }

  function initSearch() {
    const inputs = Array.from(document.querySelectorAll('[data-site-search]'));
    if (!inputs.length) return null;

    const dataset = buildDataset();

    function renderResults(panel, value) {
      const term = (value || '').trim().toLowerCase();
      panel.innerHTML = '';

      if (!term) {
        panel.setAttribute('aria-hidden', 'true');
        return;
      }

      const matches = dataset.filter((item) => item.lowercase.includes(term)).slice(0, 8);

      if (!matches.length) {
        const empty = document.createElement('div');
        empty.className = 'px-5 py-4 text-sm text-white/60';
        empty.textContent = 'No matches yet. Try a different keyword.';
        panel.appendChild(empty);
        panel.setAttribute('aria-hidden', 'false');
        return;
      }

      matches.forEach((item) => {
        const link = document.createElement('a');
        link.className = 'search-result-item focus-ring';
        link.href = item.anchor;
        link.innerHTML = `${highlight(item.text.slice(0, 160), term)}${item.text.length > 160 ? '…' : ''}`;
        panel.appendChild(link);
      });

      panel.setAttribute('aria-hidden', 'false');
    }

    const pairs = inputs.map((input) => {
      const panel = input.parentElement?.querySelector('[data-search-results]');
      if (!panel) return null;

      const debouncedRender = debounce((value) => renderResults(panel, value), 80);

      input.addEventListener('input', (event) => {
        debouncedRender(event.target.value);
      });

      input.addEventListener('focus', () => {
        if (input.value.trim()) {
          renderResults(panel, input.value);
        }
      });

      input.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
          panel.setAttribute('aria-hidden', 'true');
          input.blur();
        }
        if (event.key === 'ArrowDown') {
          const firstResult = panel.querySelector('a');
          if (firstResult) {
            event.preventDefault();
            firstResult.focus();
          }
        }
      });

      panel.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
          panel.setAttribute('aria-hidden', 'true');
          input.focus();
        }
      });

      return { input, panel };
    }).filter(Boolean);

    if (!pairs.length) return null;

    document.addEventListener('click', (event) => {
      pairs.forEach(({ input, panel }) => {
        if (!panel.contains(event.target) && event.target !== input) {
          panel.setAttribute('aria-hidden', 'true');
        }
      });
    });

    return pairs[0].input;
  }

  function debounce(fn, delay) {
    let timer = null;
    return function debounced(...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  }

  function initMobileNavigation() {
    const triggers = Array.from(document.querySelectorAll('[data-mobile-toggle]'));
    const drawer = document.querySelector('[data-mobile-drawer]');
    const overlay = document.querySelector('[data-mobile-overlay]');
    if (!triggers.length || !drawer) return;

    let previousFocus = null;
    let focusables = [];

    function setExpanded(state) {
      triggers.forEach((btn) => {
        if (btn.hasAttribute('aria-expanded')) {
          btn.setAttribute('aria-expanded', state ? 'true' : 'false');
        }
      });
      drawer.setAttribute('aria-hidden', state ? 'false' : 'true');
      if (overlay) overlay.setAttribute('aria-hidden', state ? 'false' : 'true');
    }

    function trapFocus(event) {
      if (event.key !== 'Tab' || !focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    }

    function handleKeydown(event) {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeDrawer();
      } else {
        trapFocus(event);
      }
    }

    function openDrawer(trigger) {
      previousFocus = trigger || document.activeElement;
      drawer.classList.add('active');
      overlay?.classList.add('active');
      focusables = Array.from(drawer.querySelectorAll(FOCUSABLE_SELECTORS)).filter((el) => {
        return !el.hasAttribute('disabled') && el.tabIndex !== -1;
      });
      setExpanded(true);
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleKeydown);
      (focusables[0] || drawer).focus();
    }

    function closeDrawer() {
      drawer.classList.remove('active');
      overlay?.classList.remove('active');
      setExpanded(false);
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKeydown);
      previousFocus?.focus?.();
    }

    triggers.forEach((trigger) => {
      trigger.addEventListener('click', (event) => {
        event.preventDefault();
        if (drawer.classList.contains('active')) {
          closeDrawer();
        } else {
          openDrawer(trigger);
        }
      });
    });

    overlay?.addEventListener('click', closeDrawer);

    drawer.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        closeDrawer();
      });
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    initSearch();
    initMobileNavigation();
  });
})();
