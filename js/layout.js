(function () {
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

  document.addEventListener('DOMContentLoaded', initLayout);

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
    container.innerHTML = '';
    items.forEach((item) => {
      const li = document.createElement('li');
      li.className = 'sidebar__item';
      const link = document.createElement('a');
      link.className = 'sidebar__link';
      link.href = item.href;
      link.textContent = item.label;
      if (item.id === activeId) {
        link.classList.add('is-active');
        link.setAttribute('aria-current', 'page');
        if (headings.length) {
          const sublist = document.createElement('ul');
          sublist.className = 'sidebar__sublist';
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
      li.appendChild(link);
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
})();
