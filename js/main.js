/* global elasticlunr */
(function () {
  'use strict';

  const NAV_ITEMS = [
    { id: 'start-here', label: 'Start Here', href: '/start-here.html' },
    { id: 'faq', label: 'FAQ', href: '/faq/' },
    { id: 'wallet', label: 'Wallet', href: '/wallet.html' },
    { id: 'digital-cash', label: 'Digital Cash', href: '/digital-cash.html' },
    { id: 'remittances', label: 'Remittances', href: '/remittances.html' },
    { id: 'tel-token', label: 'TEL Token', href: '/tel-token.html' },
    { id: 'network', label: 'Telcoin Network', href: '/network.html' },
    { id: 'telx', label: 'TELx', href: '/telx.html' },
    { id: 'governance', label: 'Governance & Association', href: '/governance.html' },
    { id: 'builders', label: 'Builders', href: '/builders.html' },
    { id: 'links', label: 'Links', href: '/links.html' }
  ];

  const PAGE_META = {
    home: { label: 'Home', url: '/index.html', parent: null, navId: null },
    'start-here': { label: 'Start Here', url: '/start-here.html', parent: 'home', navId: 'start-here' },
    faq: { label: 'FAQ', url: '/faq/', parent: 'home', navId: 'faq' },
    wallet: { label: 'Telcoin Wallet', url: '/wallet.html', parent: 'home', navId: 'wallet' },
    'digital-cash': { label: 'Digital Cash', url: '/digital-cash.html', parent: 'home', navId: 'digital-cash' },
    remittances: { label: 'Remittances', url: '/remittances.html', parent: 'home', navId: 'remittances' },
    'tel-token': { label: 'TEL Token', url: '/tel-token.html', parent: 'home', navId: 'tel-token' },
    network: { label: 'Telcoin Network', url: '/network.html', parent: 'home', navId: 'network' },
    telx: { label: 'TELx Liquidity', url: '/telx.html', parent: 'home', navId: 'telx' },
    governance: { label: 'Governance & Association', url: '/governance.html', parent: 'home', navId: 'governance' },
    builders: { label: 'Builders', url: '/builders.html', parent: 'home', navId: 'builders' },
    links: { label: 'Official Links', url: '/links.html', parent: 'home', navId: 'links' },
    'deep-dive': { label: 'Deep Dive', url: '/deep-dive.html', parent: 'telx', navId: 'telx' },
    pools: { label: 'TELx Pools Dashboard', url: '/pools.html', parent: 'builders', navId: 'builders' },
    portfolio: { label: 'TELx Portfolio Explorer', url: '/portfolio.html', parent: 'builders', navId: 'builders' },
    about: { label: 'About this project', url: '/about.html', parent: 'home', navId: null },
    '404': { label: 'Page not found', url: '/404.html', parent: 'home', navId: null }
  };

  const SEARCH_CONFIG = {
    dataUrl: '/data/search-index.json',
    faqUrl: '/data/faq.json',
    maxResultsPerGroup: 5
  };

  const searchState = {
    index: null,
    documents: new Map(),
    query: ''
  };

  const searchInstances = [];

  document.addEventListener('DOMContentLoaded', () => {
    initLayout();
    initSearch();
  });

  function initLayout() {
    const currentPageId = document.body?.dataset?.page || 'home';
    const currentMeta = PAGE_META[currentPageId] || PAGE_META.home;
    const currentNavId = currentMeta.navId || currentPageId;

    const navList = document.querySelector('[data-nav]');
    const sidebarList = document.querySelector('[data-sidebar-list]');
    const breadcrumbsContainer = document.querySelector('[data-breadcrumbs]');
    const sidebar = document.querySelector('[data-sidebar]');
    const overlay = document.querySelector('[data-sidebar-overlay]');
    const toggleButtons = Array.from(document.querySelectorAll('[data-sidebar-toggle]'));

    if (navList) {
      renderNav(navList, NAV_ITEMS, currentNavId);
    }
    if (sidebarList) {
      const headings = collectHeadings();
      renderSidebar(sidebarList, NAV_ITEMS, currentNavId, headings);
    }
    if (breadcrumbsContainer) {
      renderBreadcrumbs(breadcrumbsContainer, currentPageId);
    }

    if (sidebar && toggleButtons.length) {
      setupSidebarToggle({ sidebar, overlay, toggleButtons });
    }
  }

  function renderNav(container, items, activeId) {
    const existing = Array.from(container.querySelectorAll('a'));
    if (existing.length) {
      existing.forEach((link) => {
        const href = link.getAttribute('href');
        const item = items.find((candidate) => candidate.href === href);
        if (!item) {
          return;
        }
        if (item.id === activeId) {
          link.classList.add('is-active');
          link.setAttribute('aria-current', 'page');
        } else {
          link.classList.remove('is-active');
          link.removeAttribute('aria-current');
        }
      });
      return;
    }

    container.innerHTML = '';
    items.forEach((item) => {
      const li = document.createElement('li');
      const link = document.createElement('a');
      link.className = 'top-nav__link';
      link.href = item.href;
      link.textContent = item.label;
      if (item.id === activeId) {
        link.classList.add('is-active');
        link.setAttribute('aria-current', 'page');
      }
      li.appendChild(link);
      container.appendChild(li);
    });
  }

  function renderSidebar(container, items, activeId, headings) {
    const existingLinks = Array.from(container.querySelectorAll('a.sidebar__link'));
    if (existingLinks.length) {
      existingLinks.forEach((link) => {
        const href = link.getAttribute('href');
        const item = items.find((candidate) => candidate.href === href);
        const parentItem = link.closest('.sidebar__item');
        if (!item || !parentItem) {
          return;
        }

        link.id = `sidebar-link-${item.id}`;
        if (item.id === activeId) {
          link.classList.add('is-active');
          link.setAttribute('aria-current', 'page');
          let sublist = parentItem.querySelector('.sidebar__sublist');
          if (!sublist) {
            sublist = document.createElement('ul');
            sublist.className = 'sidebar__sublist';
            parentItem.appendChild(sublist);
          }
          sublist.setAttribute('aria-labelledby', link.id);
          sublist.innerHTML = '';
          headings.forEach((heading) => {
            const subItem = document.createElement('li');
            subItem.className = 'sidebar__subitem';
            const subLink = document.createElement('a');
            subLink.className = 'sidebar__sublink';
            subLink.href = `#${heading.id}`;
            subLink.textContent = heading.text;
            subItem.appendChild(subLink);
            sublist.appendChild(subItem);
          });
        } else {
          link.classList.remove('is-active');
          link.removeAttribute('aria-current');
          const sublist = parentItem.querySelector('.sidebar__sublist');
          if (sublist) {
            sublist.remove();
          }
        }
      });
      return;
    }

    container.innerHTML = '';
    items.forEach((item) => {
      const li = document.createElement('li');
      li.className = 'sidebar__item';
      const link = document.createElement('a');
      link.className = 'sidebar__link';
      link.href = item.href;
      link.textContent = item.label;
      link.id = `sidebar-link-${item.id}`;
      li.appendChild(link);

      if (item.id === activeId) {
        link.classList.add('is-active');
        link.setAttribute('aria-current', 'page');
        if (headings.length) {
          const sublist = document.createElement('ul');
          sublist.className = 'sidebar__sublist';
          sublist.setAttribute('aria-labelledby', link.id);
          headings.forEach((heading) => {
            const subItem = document.createElement('li');
            subItem.className = 'sidebar__subitem';
            const subLink = document.createElement('a');
            subLink.className = 'sidebar__sublink';
            subLink.href = `#${heading.id}`;
            subLink.textContent = heading.text;
            subItem.appendChild(subLink);
            sublist.appendChild(subItem);
          });
          li.appendChild(sublist);
        }
      }

      container.appendChild(li);
    });
  }

  function renderBreadcrumbs(container, pageId) {
    const trail = [];
    let pointerId = pageId;

    while (pointerId) {
      const node = PAGE_META[pointerId];
      if (!node) break;
      trail.unshift({ id: pointerId, ...node });
      pointerId = node.parent;
    }

    if (!trail.length || trail[0].id !== 'home') {
      trail.unshift({ id: 'home', ...PAGE_META.home });
    }

    container.innerHTML = '';
    trail.forEach((node, index) => {
      if (index > 0) {
        const separator = document.createElement('span');
        separator.className = 'breadcrumbs__separator';
        separator.textContent = '/';
        container.appendChild(separator);
      }

      if (index === trail.length - 1) {
        const span = document.createElement('span');
        span.textContent = node.label;
        span.setAttribute('aria-current', 'page');
        container.appendChild(span);
      } else {
        const link = document.createElement('a');
        link.href = node.url;
        link.textContent = node.label;
        container.appendChild(link);
      }
    });
  }

  function collectHeadings() {
    const main = document.querySelector('main');
    if (!main) return [];

    const sections = Array.from(main.querySelectorAll('section[id]'));
    return sections
      .map((section) => {
        const heading = section.querySelector('h2, h3, h1');
        const id = section.id;
        const text = normalise(heading?.textContent || '');
        if (!id || !text) {
          return null;
        }
        return { id, text };
      })
      .filter(Boolean);
  }

  function normalise(value) {
    return value ? value.trim().replace(/\s+/g, ' ') : '';
  }

  function setupSidebarToggle(options) {
    const { sidebar, overlay, toggleButtons } = options;
    let isOpen = false;

    function openSidebar(origin) {
      if (isOpen) return;
      isOpen = true;
      sidebar.classList.add('is-open');
      overlay?.classList.add('is-active');
      toggleButtons.forEach((btn) => btn.setAttribute('aria-expanded', 'true'));
      document.body.classList.add('sidebar-open');
      if (origin instanceof HTMLElement) {
        origin.dataset.returnFocus = 'true';
      }
      document.addEventListener('keydown', handleKeydown);
    }

    function closeSidebar() {
      if (!isOpen) return;
      isOpen = false;
      sidebar.classList.remove('is-open');
      overlay?.classList.remove('is-active');
      toggleButtons.forEach((btn) => btn.setAttribute('aria-expanded', 'false'));
      document.body.classList.remove('sidebar-open');
      const returnTarget = toggleButtons.find((btn) => btn.dataset.returnFocus === 'true');
      if (returnTarget) {
        returnTarget.removeAttribute('data-return-focus');
        returnTarget.focus();
      }
      document.removeEventListener('keydown', handleKeydown);
    }

    function handleKeydown(event) {
      if (event.key === 'Escape') {
        closeSidebar();
      }
    }

    toggleButtons.forEach((button) => {
      button.addEventListener('click', (event) => {
        event.preventDefault();
        if (isOpen) {
          closeSidebar();
        } else {
          openSidebar(button);
        }
      });
    });

    overlay?.addEventListener('click', closeSidebar);
  }

  function initSearch() {
    const inputs = Array.from(document.querySelectorAll('[data-site-search]'));
    if (!inputs.length) {
      return;
    }

    const results = [];
    Promise.all([fetchJson(SEARCH_CONFIG.dataUrl), fetchJson(SEARCH_CONFIG.faqUrl)])
      .then(([pageData, faqData]) => {
        buildSearchIndex(pageData || [], faqData || []);
        exposeFaqData(faqData || []);
        inputs.forEach((input) => {
          const instance = setupSearchInput(input);
          if (instance) {
            results.push(instance);
          }
        });
        if (results.length) {
          document.addEventListener('click', handleDocumentClick, true);
        }
      })
      .catch(() => {
        inputs.forEach((input) => {
          const instance = setupSearchInput(input);
          if (instance) {
            results.push(instance);
          }
        });
        if (results.length) {
          document.addEventListener('click', handleDocumentClick, true);
        }
      });
  }

  function fetchJson(url) {
    return fetch(url, { credentials: 'omit', cache: 'no-store' })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch search data');
        }
        return response.json();
      })
      .catch(() => []);
  }

  function buildSearchIndex(pages, faqEntries) {
    if (typeof elasticlunr === 'undefined') {
      return;
    }

    const index = elasticlunr(function () {
      this.setRef('ref');
      this.addField('title');
      this.addField('summary');
      this.addField('body');
      this.addField('tags');
    });

    const documents = new Map();

    (pages || []).forEach((page) => {
      if (!page || !page.id) return;
      const doc = {
        ref: `page:${page.id}`,
        type: 'page',
        title: page.title || '',
        summary: page.summary || '',
        body: buildPageBody(page),
        url: page.url || '#',
        tags: page.tags || []
      };
      index.addDoc(doc);
      documents.set(doc.ref, doc);
    });

    (faqEntries || []).forEach((entry) => {
      if (!entry || !entry.id) return;
      const body = stripHtml(entry.answer || '');
      const doc = {
        ref: `faq:${entry.id}`,
        type: 'faq',
        title: entry.question || '',
        summary: body.slice(0, 220),
        body,
        url: `/faq/#${entry.id}`,
        tags: entry.tags || [],
        sources: entry.sources || []
      };
      index.addDoc(doc);
      documents.set(doc.ref, doc);
    });

    searchState.index = index;
    searchState.documents = documents;
  }

  function exposeFaqData(faqEntries) {
    if (!faqEntries || !faqEntries.length) return;
    if (!window.TelcoinWikiData) {
      window.TelcoinWikiData = {};
    }
    window.TelcoinWikiData.faq = faqEntries;
  }

  function setupSearchInput(input) {
    const panel = input.parentElement?.querySelector('[data-search-results]');
    if (!panel) return null;

    const panelId = panel.id || `${input.id || 'site-search'}-panel`;
    panel.id = panelId;
    panel.setAttribute('role', 'region');
    panel.setAttribute('aria-live', 'polite');
    panel.hidden = true;
    panel.innerHTML = '';

    input.setAttribute('aria-controls', panelId);
    input.setAttribute('aria-expanded', 'false');

    const instance = { input, panel };
    searchInstances.push(instance);

    input.addEventListener('input', (event) => {
      const value = event.target.value || '';
      searchState.query = value.trim();
      renderResults(instance, searchState.query);
    });

    input.addEventListener('focus', () => {
      if (searchState.query) {
        renderResults(instance, searchState.query);
      }
    });

    input.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        hidePanel(instance);
        input.blur();
      }
    });

    return instance;
  }

  function handleDocumentClick(event) {
    for (const instance of searchInstances) {
      if (!instance.panel) continue;
      if (instance.input === event.target || instance.panel.contains(event.target)) {
        continue;
      }
      hidePanel(instance);
    }
  }

  function renderResults(instance, query) {
    if (!instance || !instance.panel) return;
    const { panel, input } = instance;
    panel.innerHTML = '';

    if (!query || !searchState.index) {
      hidePanel(instance);
      return;
    }

    const results = searchDocuments(query);
    if (!results.length) {
      const empty = document.createElement('div');
      empty.className = 'empty-state';
      empty.textContent = 'No matches yet. Try another keyword or check the FAQ.';
      panel.appendChild(empty);
      panel.hidden = false;
      input.setAttribute('aria-expanded', 'true');
      return;
    }

    const groups = groupResults(results);
    groups.forEach((group) => {
      if (!group.items.length) return;
      const wrapper = document.createElement('div');
      wrapper.className = 'search-panel__group';

      const title = document.createElement('p');
      title.className = 'search-panel__title';
      title.textContent = group.label;
      wrapper.appendChild(title);

      group.items.slice(0, SEARCH_CONFIG.maxResultsPerGroup).forEach((item) => {
        const doc = searchState.documents.get(item.ref);
        if (!doc) return;
        const link = document.createElement('a');
        link.className = 'search-result';
        link.href = doc.url;
        link.innerHTML = `<strong>${escapeHtml(doc.title)}</strong><br>${buildSnippet(doc, query)}`;
        wrapper.appendChild(link);
      });

      panel.appendChild(wrapper);
    });

    panel.hidden = panel.children.length === 0;
    input.setAttribute('aria-expanded', panel.hidden ? 'false' : 'true');
  }

  function hidePanel(instance) {
    if (!instance || !instance.panel) return;
    instance.panel.hidden = true;
    instance.input?.setAttribute('aria-expanded', 'false');
  }

  function searchDocuments(query) {
    if (!searchState.index) return [];
    const trimmed = query.trim();
    if (!trimmed) return [];
    try {
      return searchState.index.search(trimmed, { expand: true });
    } catch (error) {
      return [];
    }
  }

  function groupResults(results) {
    const grouped = {
      page: [],
      faq: []
    };
    results.forEach((result) => {
      const doc = searchState.documents.get(result.ref);
      if (!doc) return;
      if (!grouped[doc.type]) {
        grouped[doc.type] = [];
      }
      grouped[doc.type].push(result);
    });
    return [
      { label: 'Pages', items: grouped.page || [] },
      { label: 'FAQ', items: grouped.faq || [] }
    ];
  }

  function buildPageBody(page) {
    const headings = Array.isArray(page.headings) ? page.headings.map((heading) => heading.title || '').join(' ') : '';
    const summary = page.summary || '';
    const extra = Array.isArray(page.highlights) ? page.highlights.join(' ') : '';
    return `${summary} ${headings} ${extra}`.trim();
  }

  function buildSnippet(doc, query) {
    const source = doc.summary || doc.body || '';
    if (!source) return '';
    const cleaned = source.replace(/\s+/g, ' ');
    const lower = cleaned.toLowerCase();
    const needles = buildNeedles(query);
    let matchIndex = -1;
    let matchLength = 0;

    needles.forEach((needle) => {
      const index = lower.indexOf(needle.toLowerCase());
      if (index !== -1 && (matchIndex === -1 || index < matchIndex)) {
        matchIndex = index;
        matchLength = needle.length;
      }
    });

    let snippet;
    if (matchIndex === -1) {
      snippet = cleaned.slice(0, 160);
    } else {
      const start = Math.max(0, matchIndex - 60);
      const end = Math.min(cleaned.length, matchIndex + matchLength + 80);
      snippet = `${start > 0 ? '…' : ''}${cleaned.slice(start, end)}${end < cleaned.length ? '…' : ''}`;
    }

    return highlightTerms(snippet, needles);
  }

  function buildNeedles(query) {
    return (query || '')
      .split(/\s+/)
      .filter((word) => word.length > 1)
      .slice(0, 5);
  }

  function highlightTerms(text, terms) {
    if (!text || !terms.length) return escapeHtml(text);
    const escaped = terms.map((term) => escapeRegExp(term)).filter(Boolean);
    if (!escaped.length) return escapeHtml(text);
    const pattern = new RegExp(`(${escaped.join('|')})`, 'gi');
    return escapeHtml(text).replace(pattern, '<mark>$1</mark>');
  }

  function stripHtml(value) {
    if (!value) return '';
    const temp = document.createElement('div');
    temp.innerHTML = value;
    return temp.textContent || temp.innerText || '';
  }

  function escapeHtml(value) {
    const input = value == null ? '' : String(value);
    return input
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function escapeRegExp(value) {
    const input = value == null ? '' : String(value);
    return input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
})();
