(function () {
  const FAQ_CONTAINER_SELECTOR = '[data-faq-list]';
  const TAG_CONTAINER_SELECTOR = '[data-faq-tags]';
  const SEARCH_INPUT_SELECTOR = '[data-faq-search]';
  const JSON_LD_TARGET_SELECTOR = '[data-faq-schema]';
  const FAQ_DATA_URL = '/data/faq.json';

  const state = {
    entries: [],
    index: null,
    query: '',
    tag: 'all'
  };

  document.addEventListener('DOMContentLoaded', initFaq);

  function initFaq() {
    const container = document.querySelector(FAQ_CONTAINER_SELECTOR);
    if (!container || typeof elasticlunr === 'undefined') {
      return;
    }

    loadFaqData()
      .then((entries) => {
        if (!entries.length) {
          renderEmpty(container);
          return;
        }
        state.entries = entries;
        buildIndex(entries);
        renderTags(entries);
        renderFaq(entries);
        bindSearch();
        bindTagFilters();
        bindAccordion();
        handleDeepLink();
        renderFaqSchema(entries);
        window.addEventListener('hashchange', handleDeepLink);
      })
      .catch(() => {
        renderEmpty(container);
      });
  }

  function loadFaqData() {
    if (window.TelcoinWikiData && Array.isArray(window.TelcoinWikiData.faq)) {
      return Promise.resolve(window.TelcoinWikiData.faq);
    }
    return fetch(FAQ_DATA_URL, { credentials: 'omit', cache: 'no-store' })
      .then((response) => {
        if (!response.ok) throw new Error('Failed to load FAQ');
        return response.json();
      })
      .catch(() => []);
  }

  function buildIndex(entries) {
    const index = elasticlunr(function () {
      this.setRef('id');
      this.addField('question');
      this.addField('answer');
      this.addField('tags');
    });

    entries.forEach((entry) => {
      index.addDoc({
        id: entry.id,
        question: entry.question,
        answer: stripHtml(entry.answer || ''),
        tags: (entry.tags || []).join(' ')
      });
    });

    state.index = index;
  }

  function renderTags(entries) {
    const tagContainer = document.querySelector(TAG_CONTAINER_SELECTOR);
    if (!tagContainer) return;

    const tags = new Set();
    entries.forEach((entry) => {
      (entry.tags || []).forEach((tag) => tags.add(tag));
    });

    const sorted = Array.from(tags).sort((a, b) => a.localeCompare(b));
    tagContainer.innerHTML = '';

    const allButton = createTagButton('all', 'All');
    allButton.classList.add('is-active');
    tagContainer.appendChild(allButton);

    sorted.forEach((tag) => {
      const button = createTagButton(tag, tag);
      tagContainer.appendChild(button);
    });
  }

  function createTagButton(value, label) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'tag-pill';
    button.textContent = label;
    button.dataset.tag = value;
    if (value === state.tag) {
      button.classList.add('is-active');
      button.setAttribute('aria-pressed', 'true');
    } else {
      button.setAttribute('aria-pressed', 'false');
    }
    return button;
  }

  function bindSearch() {
    const searchInput = document.querySelector(SEARCH_INPUT_SELECTOR);
    if (!searchInput) return;

    searchInput.addEventListener('input', (event) => {
      state.query = (event.target.value || '').trim();
      renderFaq(state.entries);
    });
  }

  function bindTagFilters() {
    const tagContainer = document.querySelector(TAG_CONTAINER_SELECTOR);
    if (!tagContainer) return;

    tagContainer.addEventListener('click', (event) => {
      const button = event.target.closest('[data-tag]');
      if (!button) return;
      event.preventDefault();
      const selected = button.dataset.tag || 'all';
      if (state.tag === selected) return;
      state.tag = selected;
      Array.from(tagContainer.querySelectorAll('[data-tag]')).forEach((tagButton) => {
        if (tagButton.dataset.tag === selected) {
          tagButton.classList.add('is-active');
          tagButton.setAttribute('aria-pressed', 'true');
        } else {
          tagButton.classList.remove('is-active');
          tagButton.setAttribute('aria-pressed', 'false');
        }
      });
      renderFaq(state.entries);
    });
  }

  function bindAccordion() {
    const container = document.querySelector(FAQ_CONTAINER_SELECTOR);
    if (!container) return;

    container.addEventListener('click', (event) => {
      const toggle = event.target.closest('[data-accordion-toggle]');
      if (!toggle) return;
      const targetId = toggle.getAttribute('aria-controls');
      if (!targetId) return;
      const panel = document.getElementById(targetId);
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', expanded ? 'false' : 'true');
      if (panel) {
        panel.hidden = expanded;
      }
      const host = toggle.closest('.accordion');
      if (host) {
        host.classList.toggle('is-open', !expanded);
      }
    });
  }

  function renderFaq(entries) {
    const container = document.querySelector(FAQ_CONTAINER_SELECTOR);
    if (!container) return;

    const matches = filterEntries(entries);
    container.innerHTML = '';

    if (!matches.length) {
      renderEmpty(container);
      return;
    }

    matches.forEach((entry) => {
      const article = document.createElement('article');
      article.className = 'accordion anchor-offset';
      article.id = entry.id;

      const header = document.createElement('div');

      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'accordion__summary';
      button.setAttribute('aria-expanded', 'false');
      const panelId = `${entry.id}-panel`;
      button.setAttribute('aria-controls', panelId);
      button.id = `${entry.id}-toggle`;
      button.dataset.accordionToggle = 'true';

      const label = document.createElement('span');
      label.textContent = entry.question;
      const icon = document.createElement('span');
      icon.className = 'accordion__icon';
      icon.setAttribute('aria-hidden', 'true');
      icon.textContent = '⌄';

      button.appendChild(label);
      button.appendChild(icon);
      header.appendChild(button);
      article.appendChild(header);

      const panel = document.createElement('div');
      panel.className = 'accordion__content';
      panel.id = panelId;
      panel.setAttribute('role', 'region');
      panel.setAttribute('aria-labelledby', button.id);
      panel.hidden = true;

      const answer = document.createElement('div');
      answer.className = 'accordion__body';
      answer.innerHTML = entry.answer;

      const permalink = document.createElement('p');
      permalink.className = 'accordion__permalink';
      const link = document.createElement('a');
      link.href = `#${entry.id}`;
      link.textContent = 'Permalink';
      permalink.appendChild(link);

      panel.appendChild(answer);
      panel.appendChild(permalink);

      if (Array.isArray(entry.sources) && entry.sources.length) {
        const sourceBox = document.createElement('div');
        sourceBox.className = 'source-box accordion__sources';

        const title = document.createElement('p');
        title.className = 'source-box__title';
        title.textContent = 'From the source';
        sourceBox.appendChild(title);

        const list = document.createElement('ul');
        list.className = 'source-box__links';
        entry.sources.forEach((source) => {
          if (!source || !source.url) return;
          const item = document.createElement('li');
          const sourceLink = document.createElement('a');
          sourceLink.className = 'source-box__link';
          sourceLink.href = source.url;
          sourceLink.target = '_blank';
          sourceLink.rel = 'noopener';
          sourceLink.textContent = source.label || source.url;
          item.appendChild(sourceLink);
          list.appendChild(item);
        });
        sourceBox.appendChild(list);
        panel.appendChild(sourceBox);
      }

      article.appendChild(panel);
      container.appendChild(article);
    });

    handleDeepLink();
  }

  function renderEmpty(container) {
    container.innerHTML = '';
    const empty = document.createElement('div');
    empty.className = 'empty-state';
    empty.setAttribute('role', 'status');
    empty.textContent = 'No answers yet. Check back soon or explore the Telcoin Association resources.';
    container.appendChild(empty);
  }

  function filterEntries(entries) {
    let results = entries;

    if (state.tag !== 'all') {
      results = results.filter((entry) => Array.isArray(entry.tags) && entry.tags.includes(state.tag));
    }

    if (state.query && state.index) {
      const queryResults = state.index.search(state.query, { expand: true });
      const ids = queryResults.map((result) => result.ref);
      const lookup = new Map(entries.map((entry) => [entry.id, entry]));
      const matched = ids
        .map((id) => lookup.get(id))
        .filter(Boolean)
        .filter((entry) => results.includes(entry));

      const unique = Array.from(new Set(matched));
      const queryLower = state.query.toLowerCase();
      const others = results.filter(
        (entry) => !unique.includes(entry) && entry.question.toLowerCase().includes(queryLower)
      );
      results = unique.concat(others);
    }

    return results;
  }

  function handleDeepLink() {
    const hash = (location.hash || '').replace('#', '');
    if (!hash) return;
    const targetToggle = document.getElementById(`${hash}-toggle`);
    const targetPanel = document.getElementById(`${hash}-panel`);
    if (!targetToggle || !targetPanel) return;
    targetToggle.setAttribute('aria-expanded', 'true');
    targetPanel.hidden = false;
    const host = targetToggle.closest('.accordion');
    if (host) {
      host.classList.add('is-open');
    }
    const prefersReduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    targetPanel.scrollIntoView({ behavior: prefersReduce ? 'auto' : 'smooth', block: 'start' });
  }

  function renderFaqSchema(entries) {
    const target = document.querySelector(JSON_LD_TARGET_SELECTOR) || document.body;
    if (!target) return;
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: entries.map((entry) => ({
        '@type': 'Question',
        name: entry.question,
        url: `https://telcoinwiki.com/faq/#${entry.id}`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: stripHtml(entry.answer || '')
        }
      }))
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(schema, null, 2);
    target.appendChild(script);
  }

  function stripHtml(value) {
    if (!value) return '';
    const temp = document.createElement('div');
    temp.innerHTML = value;
    return temp.textContent || temp.innerText || '';
  }
})();
