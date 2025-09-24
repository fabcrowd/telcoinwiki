(function () {
  const SITE_PAGES = [
    { id: 'index', path: 'index.html' },
    { id: 'deep-dive', path: 'deep-dive.html' },
    { id: 'links', path: 'links.html' },
    { id: 'pools', path: 'pools.html' },
    { id: 'portfolio', path: 'portfolio.html' },
    { id: 'about', path: 'about.html' }
  ];

  const HEADER_NAV = [
    {
      id: 'qa',
      label: 'Q&A',
      items: [
        { label: 'Quick Answers', pageId: 'index', targetId: 'quick-facts' },
        { label: 'Wallet Basics', pageId: 'index', targetId: 'wallet-basics' },
        { label: 'Troubleshooting', pageId: 'index', targetId: 'faq-troubleshooting' }
      ]
    },
    {
      id: 'getting-started',
      label: 'Getting Started',
      items: [
        { label: 'Create Account', pageId: 'index', targetId: 'create-account' },
        { label: 'Fund Wallet', pageId: 'index', targetId: 'fund-wallet' },
        { label: 'Security Checklist', pageId: 'index', targetId: 'security-checklist' }
      ]
    },
    {
      id: 'telx-defi',
      label: 'TELx DeFi',
      items: [
        { label: 'Pools Overview', pageId: 'pools', targetId: 'pools-overview' },
        { label: 'LP Guides', pageId: 'deep-dive', targetId: 'deep-dive-liquidity' },
        { label: 'Portfolio Tracker', pageId: 'portfolio', targetId: 'portfolio-overview' }
      ]
    },
    {
      id: 'community-support',
      label: 'Community & Support',
      items: [
        { label: 'Official Links', pageId: 'links', targetId: 'official-resources' },
        { label: 'Governance', pageId: 'deep-dive', targetId: 'deep-dive-governance' },
        { label: 'Contact', pageId: 'links', targetId: 'contact' }
      ]
    }
  ];

  const currentPageId = document.body?.dataset?.page || '';
  const navLinkTargets = new Map();
  const tocLinkTargets = new Map();
  let observer = null;

  document.addEventListener('DOMContentLoaded', initDocsLayout);

  function initDocsLayout() {
    const sidebarNav = document.querySelector('[data-docs-nav]');
    const mobileNav = document.querySelector('[data-mobile-nav]');
    const tocContainer = document.querySelector('[data-toc]');

    if (!sidebarNav && !mobileNav && !tocContainer) {
      return;
    }

    const pagePromises = SITE_PAGES.map((page) => {
      if (!page || !page.id || !page.path) return Promise.resolve(null);
      if (page.id === currentPageId) {
        return Promise.resolve({ ...page, ...collectHeadings(document, { assign: true }) });
      }
      return fetchPageData(page).catch(() => null);
    });

    Promise.allSettled(pagePromises).then((results) => {
      const pagesData = results
        .map((result) => (result.status === 'fulfilled' ? result.value : null))
        .filter(Boolean);

      if (!pagesData.length) return;

      const currentPageData = pagesData.find((page) => page.id === currentPageId) || null;

      renderNavigation(pagesData, sidebarNav, mobileNav);
      setupAccordion(sidebarNav);
      setupAccordion(mobileNav);

      if (currentPageData && tocContainer) {
        renderTOC(currentPageData, tocContainer);
        setupScrollSpy(currentPageData);
      }

      setInitialActiveState(currentPageData);
    });
  }

  function fetchPageData(page) {
    return fetch(page.path)
      .then((response) => {
        if (!response.ok) throw new Error('Failed to load');
        return response.text();
      })
      .then((html) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const pageData = collectHeadings(doc, { assign: false });

        if (page.id === 'deep-dive') {
          const dynamicHeadings = collectDeepDiveVirtualHeadings(doc);
          if (dynamicHeadings.length) {
            const existingIds = new Set((pageData.headings || []).map((heading) => heading.id));
            dynamicHeadings.forEach((heading) => {
              if (!existingIds.has(heading.id)) {
                pageData.headings.push(heading);
              }
            });
          }
        }

        return { ...page, ...pageData };
      });
  }

  function collectHeadings(root, options = {}) {
    const { assign = false } = options;
    const headings = [];
    const slugCounts = Object.create(null);
    let title = '';

    const nodes = root.querySelectorAll('main h1, main h2, main h3');
    nodes.forEach((node) => {
      if (!(node instanceof HTMLElement)) return;
      const level = Number(node.tagName.replace('H', ''));
      if (!level || level > 3) return;

      const text = normalise(node.textContent);
      if (!text) return;

      if (!title && level === 1) {
        title = text;
      }

      let id = node.getAttribute('id');
      if (!id) {
        const base = slugify(text) || `section-${level}`;
        id = uniqueId(base, slugCounts);
        if (assign) {
          node.id = id;
        }
      } else if (!slugCounts[id]) {
        slugCounts[id] = 0;
      }

      headings.push({ level, text, id });
    });

    return {
      title,
      headings
    };
  }

  function collectDeepDiveVirtualHeadings(doc) {
    if (!doc) return [];
    const scripts = Array.from(doc.querySelectorAll('script'));
    const source = scripts.find((el) => (el.textContent || '').includes('const deepDiveData'));
    if (!source) return [];

    const text = source.textContent || '';
    const matches = [];
    const seen = new Set();
    const pattern = /["']?([a-zA-Z0-9_-]+)["']?\s*:\s*{\s*title:\s*"([^"\n]+)"/g;
    let match;

    while ((match = pattern.exec(text)) !== null) {
      const key = match[1];
      const rawTitle = match[2];
      const title = normalise(rawTitle);
      if (!key || !title) continue;

      const id = `deep-dive-${key}`;
      if (seen.has(id)) continue;
      seen.add(id);

      matches.push({ level: 2, text: title, id });
    }

    return matches;
  }

  function renderNavigation(pages, sidebarNav, mobileNav) {
    if (sidebarNav) sidebarNav.innerHTML = '';
    if (mobileNav) mobileNav.innerHTML = '';

    const pagePathMap = new Map();
    pages.forEach((page) => {
      if (!page || !page.id || !page.path) return;
      pagePathMap.set(page.id, page.path);
    });

    HEADER_NAV.forEach((group, index) => {
      if (!group || !group.items || !group.items.length) return;
      const isCurrentGroup = group.items.some((item) => item?.pageId === currentPageId);

      if (sidebarNav) {
        const section = createNavSection(group, isCurrentGroup, `docs-nav-${index}`, false, pagePathMap);
        if (section) sidebarNav.appendChild(section);
      }

      if (mobileNav) {
        const section = createNavSection(group, isCurrentGroup, `mobile-nav-${index}`, true, pagePathMap);
        if (section) mobileNav.appendChild(section);
      }
    });
  }

  function createNavSection(group, isCurrent, idPrefix, isMobile, pagePathMap) {
    if (!group || !Array.isArray(group.items)) return null;
    const section = document.createElement('section');
    section.className = 'docs-nav-section';

    const trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.className = 'docs-nav-trigger focus-ring';
    const shouldStartOpen = isMobile && isCurrent;

    trigger.setAttribute('aria-expanded', shouldStartOpen ? 'true' : 'false');
    const panelId = `${idPrefix}-panel`;
    trigger.setAttribute('aria-controls', panelId);

    const triggerLabel = document.createElement('span');
    triggerLabel.textContent = group.label || '';
    const triggerIcon = document.createElement('span');
    triggerIcon.className = 'docs-nav-trigger-icon';
    triggerIcon.setAttribute('aria-hidden', 'true');
    triggerIcon.textContent = '▾';

    trigger.appendChild(triggerLabel);
    trigger.appendChild(triggerIcon);

    const panel = document.createElement('div');
    panel.className = 'docs-nav-panel';
    panel.id = panelId;
    if (!shouldStartOpen) {
      panel.hidden = true;
    }

    group.items.forEach((item) => {
      if (!item || !item.label) return;
      const link = document.createElement('a');
      link.className = 'docs-nav-link focus-ring';
      link.href = resolveNavHref(item, pagePathMap);
      link.textContent = item.label;
      if (item.pageId) {
        link.dataset.page = item.pageId;
      }
      if (item.pageId === currentPageId && item.targetId) {
        link.dataset.targetId = item.targetId;
        addNavLinkReference(item.targetId, link);
      }
      panel.appendChild(link);
    });

    if (!panel.children.length) {
      return null;
    }

    section.appendChild(trigger);
    section.appendChild(panel);

    if (isMobile && group.id) {
      section.dataset.navSection = group.id;
    }

    return section;
  }

  function resolveNavHref(item, pagePathMap) {
    if (!item) return '#';
    if (item.href) return item.href;

    const targetId = item.targetId ? `#${item.targetId}` : '';
    if (item.pageId) {
      if (item.pageId === currentPageId) {
        return targetId || '#';
      }
      const path = pagePathMap.get(item.pageId) || SITE_PAGES.find((page) => page.id === item.pageId)?.path;
      if (path) {
        return targetId ? `${path}${targetId}` : path;
      }
    }

    return targetId || '#';
  }

  function renderTOC(page, tocContainer) {
    tocContainer.innerHTML = '';
    tocContainer.style.display = '';
    const relevant = (page.headings || []).filter((heading) => heading.level >= 2 && heading.level <= 3);
    if (!relevant.length) {
      tocContainer.style.display = 'none';
      return;
    }

    const headingEl = document.createElement('p');
    headingEl.className = 'toc-heading';
    headingEl.textContent = 'On this page';

    const list = document.createElement('ul');
    list.className = 'toc-list';

    relevant.forEach((heading) => {
      const item = document.createElement('li');
      const link = document.createElement('a');
      link.className = 'toc-link focus-ring';
      link.href = `#${heading.id}`;
      link.textContent = heading.text;
      link.dataset.targetId = heading.id;
      link.dataset.level = String(heading.level);
      addTocLinkReference(heading.id, link);
      item.appendChild(link);
      list.appendChild(item);
    });

    const backToTop = document.createElement('a');
    backToTop.className = 'toc-backtotop focus-ring';
    backToTop.href = '#top';
    backToTop.textContent = 'Back to top';

    tocContainer.appendChild(headingEl);
    tocContainer.appendChild(list);
    tocContainer.appendChild(backToTop);
  }

  function setupAccordion(container) {
    if (!container) return;
    const triggers = Array.from(container.querySelectorAll('.docs-nav-trigger'));
    if (!triggers.length) return;

    const isHeader = container.classList.contains('docs-nav--header');
    const prefersReducedMotion =
      typeof window !== 'undefined' && window.matchMedia
        ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
        : false;

    const revealPanel = (panel) => {
      if (!panel) return;
      if (!isHeader) {
        panel.hidden = false;
        return;
      }

      if (!panel.hidden && panel.classList.contains('is-visible')) return;

      if (panel._accordionTransitionHandler) {
        panel.removeEventListener('transitionend', panel._accordionTransitionHandler);
        panel._accordionTransitionHandler = null;
      }

      panel.hidden = false;
      panel.classList.remove('is-closing');

      if (prefersReducedMotion) {
        panel.classList.add('is-visible');
        return;
      }

      requestAnimationFrame(() => {
        panel.classList.add('is-visible');
      });
    };

    const concealPanel = (panel) => {
      if (!panel) return;
      if (!isHeader) {
        panel.hidden = true;
        return;
      }

      if (panel.hidden || panel.classList.contains('is-closing')) {
        panel.hidden = true;
        panel.classList.remove('is-closing');
        panel.classList.remove('is-visible');
        if (panel._accordionTransitionHandler) {
          panel.removeEventListener('transitionend', panel._accordionTransitionHandler);
          panel._accordionTransitionHandler = null;
        }
        return;
      }

      if (!panel.classList.contains('is-visible')) {
        panel.hidden = true;
        if (panel._accordionTransitionHandler) {
          panel.removeEventListener('transitionend', panel._accordionTransitionHandler);
          panel._accordionTransitionHandler = null;
        }
        return;
      }

      if (prefersReducedMotion) {
        panel.classList.remove('is-visible');
        panel.hidden = true;
        if (panel._accordionTransitionHandler) {
          panel.removeEventListener('transitionend', panel._accordionTransitionHandler);
          panel._accordionTransitionHandler = null;
        }
        return;
      }

      panel.classList.remove('is-visible');
      panel.classList.add('is-closing');

      const handleTransitionEnd = (event) => {
        if (event.target !== panel) return;
        panel.hidden = true;
        panel.classList.remove('is-closing');
        panel._accordionTransitionHandler = null;
        panel.removeEventListener('transitionend', handleTransitionEnd);
      };

      panel._accordionTransitionHandler = handleTransitionEnd;
      panel.addEventListener('transitionend', handleTransitionEnd);
    };

    const closeOthers = (activeTrigger) => {
      triggers.forEach((other) => {
        if (other === activeTrigger) return;
        const otherPanelId = other.getAttribute('aria-controls');
        if (!otherPanelId) return;
        const otherPanel = document.getElementById(otherPanelId);
        if (!otherPanel) return;
        other.setAttribute('aria-expanded', 'false');
        concealPanel(otherPanel);
      });
    };

    triggers.forEach((trigger) => {
      const panelId = trigger.getAttribute('aria-controls');
      if (!panelId) return;
      const panel = document.getElementById(panelId);
      if (!panel) return;

      const section = trigger.closest('.docs-nav-section');

      const openPanel = () => {
        closeOthers(trigger);
        trigger.setAttribute('aria-expanded', 'true');
        revealPanel(panel);
      };

      const closePanel = () => {
        trigger.setAttribute('aria-expanded', 'false');
        concealPanel(panel);
      };

      trigger.addEventListener('click', () => {
        const expanded = trigger.getAttribute('aria-expanded') === 'true';
        if (expanded) {
          closePanel();
        } else {
          openPanel();
        }
      });

      trigger.addEventListener('focus', openPanel);

      if (isHeader) {
        trigger.addEventListener('mouseenter', openPanel);
        if (section) {
          section.addEventListener('mouseleave', () => {
            if (section.contains(document.activeElement)) return;
            closePanel();
          });
          section.addEventListener('focusout', (event) => {
            if (!section.contains(event.relatedTarget)) {
              closePanel();
            }
          });
        }
      }
    });
  }

  function setupScrollSpy(page) {
    const targets = (page.headings || []).filter((heading) => heading.level >= 2 && heading.level <= 3);
    if (!targets.length) return;

    const elements = targets
      .map((heading) => document.getElementById(heading.id))
      .filter((el) => el instanceof HTMLElement);

    if (!elements.length) return;

    observer = new IntersectionObserver(handleIntersections, {
      rootMargin: '-55% 0px -35% 0px',
      threshold: [0, 0.25, 0.5, 0.75, 1]
    });

    elements.forEach((el) => observer.observe(el));

    window.addEventListener('hashchange', () => {
      const id = decodeURIComponent(window.location.hash.replace('#', ''));
      if (id) {
        setActiveAnchor(id);
      }
    });
  }

  function handleIntersections(entries) {
    let bestEntry = null;
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        if (!bestEntry || entry.intersectionRatio > bestEntry.intersectionRatio) {
          bestEntry = entry;
        }
      }
    });

    if (bestEntry && bestEntry.target && bestEntry.target.id) {
      setActiveAnchor(bestEntry.target.id);
    }
  }

  let activeAnchorId = null;

  function setActiveAnchor(id) {
    if (!id || activeAnchorId === id) return;
    activeAnchorId = id;

    navLinkTargets.forEach((links, key) => {
      links.forEach((link) => {
        if (key === id) {
          link.classList.add('is-active');
        } else {
          link.classList.remove('is-active');
        }
      });
    });

    tocLinkTargets.forEach((links, key) => {
      links.forEach((link) => {
        if (key === id) {
          link.classList.add('is-active');
        } else {
          link.classList.remove('is-active');
        }
      });
    });
  }

  function setInitialActiveState(currentPageData) {
    if (!currentPageData) return;
    const hashId = decodeURIComponent(window.location.hash.replace('#', ''));
    if (hashId) {
      setActiveAnchor(hashId);
      return;
    }

    const firstHeading = (currentPageData.headings || []).find((heading) => heading.level >= 2 && heading.level <= 3);
    if (firstHeading) {
      setActiveAnchor(firstHeading.id);
    }
  }

  function addNavLinkReference(id, element) {
    if (!id || !element) return;
    if (!navLinkTargets.has(id)) {
      navLinkTargets.set(id, []);
    }
    navLinkTargets.get(id).push(element);
  }

  function addTocLinkReference(id, element) {
    if (!id || !element) return;
    if (!tocLinkTargets.has(id)) {
      tocLinkTargets.set(id, []);
    }
    tocLinkTargets.get(id).push(element);
  }

  function uniqueId(base, store) {
    const normalised = base.toLowerCase().replace(/[^a-z0-9\-]/g, '');
    if (!store[normalised]) {
      store[normalised] = 0;
      return normalised;
    }
    store[normalised] += 1;
    return `${normalised}-${store[normalised]}`;
  }

  function slugify(text) {
    return text
      .toLowerCase()
      .trim()
      .replace(/['"&]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }

  function normalise(text) {
    return text ? text.trim().replace(/\s+/g, ' ') : '';
  }

})();
