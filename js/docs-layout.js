(function () {
  const SITE_PAGES = [
    { id: 'index', path: 'index.html' },
    { id: 'deep-dive', path: 'deep-dive.html' },
    { id: 'links', path: 'links.html' },
    { id: 'pools', path: 'pools.html' },
    { id: 'portfolio', path: 'portfolio.html' },
    { id: 'about', path: 'about.html' }
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

    pages.forEach((page, index) => {
      const isCurrent = page.id === currentPageId;
      const label = page.title || fallbackLabel(page.id) || page.path;

      if (sidebarNav) {
        const section = createNavSection(page, label, isCurrent, `docs-nav-${index}`, false);
        if (section) sidebarNav.appendChild(section);
      }

      if (mobileNav) {
        const section = createNavSection(page, label, isCurrent, `mobile-nav-${index}`, true);
        if (section) mobileNav.appendChild(section);
      }
    });
  }

  function createNavSection(page, label, isCurrent, idPrefix, isMobile) {
    const section = document.createElement('section');
    section.className = 'docs-nav-section';

    const trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.className = 'docs-nav-trigger focus-ring';
    trigger.setAttribute('aria-expanded', isCurrent ? 'true' : 'false');
    const panelId = `${idPrefix}-panel`;
    trigger.setAttribute('aria-controls', panelId);

    const triggerLabel = document.createElement('span');
    triggerLabel.textContent = label;
    const triggerIcon = document.createElement('span');
    triggerIcon.className = 'docs-nav-trigger-icon';
    triggerIcon.setAttribute('aria-hidden', 'true');
    triggerIcon.textContent = '▾';

    trigger.appendChild(triggerLabel);
    trigger.appendChild(triggerIcon);

    const panel = document.createElement('div');
    panel.className = 'docs-nav-panel';
    panel.id = panelId;
    if (!isCurrent) {
      panel.hidden = true;
    }

    const headings = page.headings || [];
    headings.forEach((heading) => {
      if (!heading || heading.level > 3) return;
      const link = document.createElement('a');
      link.className = 'docs-nav-link focus-ring';
      if (heading.level === 3) {
        link.classList.add('docs-nav-link--child');
      }
      const targetHref = page.id === currentPageId ? `#${heading.id}` : `${page.path}#${heading.id}`;
      link.href = targetHref;
      link.textContent = heading.text;
      link.dataset.page = page.id;
      if (page.id === currentPageId) {
        link.dataset.targetId = heading.id;
        addNavLinkReference(heading.id, link);
      }
      panel.appendChild(link);
    });

    if (!panel.children.length) {
      return null;
    }

    section.appendChild(trigger);
    section.appendChild(panel);

    if (isMobile) {
      section.dataset.navSection = page.id;
    }

    return section;
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
    triggers.forEach((trigger) => {
      trigger.addEventListener('click', () => {
        const expanded = trigger.getAttribute('aria-expanded') === 'true';
        triggers.forEach((other) => {
          if (other === trigger) return;
          const otherPanel = document.getElementById(other.getAttribute('aria-controls'));
          if (!otherPanel) return;
          other.setAttribute('aria-expanded', 'false');
          otherPanel.hidden = true;
        });
        const panelId = trigger.getAttribute('aria-controls');
        const panel = document.getElementById(panelId);
        if (!panel) return;
        trigger.setAttribute('aria-expanded', expanded ? 'false' : 'true');
        panel.hidden = expanded;
      });
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

  function fallbackLabel(pageId) {
    switch (pageId) {
      case 'index':
        return 'Telcoin Community Q&A';
      case 'deep-dive':
        return 'Telcoin Deep Dive';
      case 'links':
        return 'Telcoin Links';
      case 'pools':
        return 'TELx Pools';
      case 'portfolio':
        return 'TELx Portfolio';
      case 'about':
        return 'About TELx';
      default:
        return '';
    }
  }
})();
