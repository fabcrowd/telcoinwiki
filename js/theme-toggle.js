(function () {
  const STORAGE_KEY = 'telcoinwiki-theme';
  const root = document.documentElement;

  function applyTheme(next) {
    if (next === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    document.body?.dispatchEvent(new CustomEvent('themechange', { detail: { theme: next } }));
  }

  function resolveInitialTheme() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'dark' || stored === 'light') {
      return stored;
    }
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function toggleTheme() {
    const next = root.classList.contains('dark') ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem(STORAGE_KEY, next);
  }

  document.addEventListener('DOMContentLoaded', () => {
    applyTheme(resolveInitialTheme());

    document.querySelectorAll('[data-theme-toggle]').forEach((toggle) => {
      toggle.addEventListener('click', (event) => {
        event.preventDefault();
        toggleTheme();
      });
    });

    if (window.matchMedia) {
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      mq.addEventListener('change', (event) => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) {
          applyTheme(event.matches ? 'dark' : 'light');
        }
      });
    }
  });
})();
