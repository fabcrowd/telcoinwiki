(function () {
  const SEARCH_DATA_URL = '/data/search-index.json';
  const FAQ_DATA_URL = '/data/faq.json';
  const MAX_RESULTS_PER_GROUP = 5;

  const state = {
    index: null,
    documents: new Map(),
    query: ''
  };

  document.addEventListener('DOMContentLoaded', initSearch);

  function initSearch() {
    const inputs = Array.from(document.querySelectorAll('[data-site-search]'));
    if (!inputs.length || typeof elasticlunr === 'undefined') {
      return;
    }

    Promise.all([fetchJson(SEARCH_DATA_URL), fetchJson(FAQ_DATA_URL)])
      .then(([pageData, faqData]) => {
        buildIndex(pageData || [], faqData || []);
        exposeFaqData(faqData || []);
        setupInputs(inputs);
      })
      .catch(() => {
        setupInputs(inputs);
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
      .catch((error) => {
        console.warn('[search] Unable to load', url, error);
        return [];
      });
  }

  function buildIndex(pages, faqEntries) {
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

    state.index = index;
    state.documents = documents;
  }

  function exposeFaqData(faqEntries) {
    if (!faqEntries || !faqEntries.length) return;
    if (!window.TelcoinWikiData) {
      window.TelcoinWikiData = {};
    }
    window.TelcoinWikiData.faq = faqEntries;
  }

  function setupInputs(inputs) {
    inputs.forEach((input) => {
      const panel = input.parentElement?.querySelector('[data-search-results]');
      if (!panel) return;
      panel.setAttribute('aria-hidden', 'true');
      panel.innerHTML = '';

      input.addEventListener('input', (event) => {
        const value = event.target.value || '';
        state.query = value.trim();
        renderResults(panel, state.query);
      });

      input.addEventListener('focus', () => {
        if (state.query) {
          renderResults(panel, state.query);
        }
      });

      input.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
          hidePanel(panel);
          input.blur();
        }
      });

      document.addEventListener('click', (event) => {
        if (event.target === input || panel.contains(event.target)) {
          return;
        }
        hidePanel(panel);
      });
    });
  }

  function renderResults(panel, query) {
    if (!panel) return;
    panel.innerHTML = '';

    if (!query || !state.index) {
      hidePanel(panel);
      return;
    }

    const results = searchDocuments(query);
    if (!results.length) {
      const empty = document.createElement('div');
      empty.className = 'empty-state';
      empty.textContent = 'No matches yet. Try another keyword or check the FAQ.';
      panel.appendChild(empty);
      panel.setAttribute('aria-hidden', 'false');
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

      group.items.slice(0, MAX_RESULTS_PER_GROUP).forEach((item) => {
        const doc = state.documents.get(item.ref);
        if (!doc) return;
        const link = document.createElement('a');
        link.className = 'search-result';
        link.href = doc.url;
        const snippet = buildSnippet(doc, query);
        link.innerHTML = `<strong>${escapeHtml(doc.title)}</strong><br>${snippet}`;
        wrapper.appendChild(link);
      });

      panel.appendChild(wrapper);
    });

    panel.setAttribute('aria-hidden', panel.children.length ? 'false' : 'true');
  }

  function hidePanel(panel) {
    if (!panel) return;
    panel.setAttribute('aria-hidden', 'true');
  }

  function searchDocuments(query) {
    if (!state.index) return [];
    const trimmed = query.trim();
    if (!trimmed) return [];
    try {
      return state.index.search(trimmed, {
        expand: true
      });
    } catch (error) {
      console.warn('[search] Unable to query index', error);
      return [];
    }
  }

  function groupResults(results) {
    const grouped = {
      page: [],
      faq: []
    };
    results.forEach((result) => {
      const doc = state.documents.get(result.ref);
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
