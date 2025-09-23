(function () {
  const root = document.documentElement;
  const mediaQuery = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
  let currentTheme = '';

  function applyTheme(next) {
    if (next === currentTheme) return;
    currentTheme = next;

    if (next === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    document.body?.dispatchEvent(new CustomEvent('themechange', { detail: { theme: next } }));
  }

  function resolvePreferredTheme() {
    if (!mediaQuery) {
      return 'dark';
    }

    return mediaQuery.matches ? 'dark' : 'light';
  }

  function handlePreferenceChange(event) {
    applyTheme(event.matches ? 'dark' : 'light');
  }

  function init() {
    applyTheme(resolvePreferredTheme());

    if (!mediaQuery) {
      return;
    }

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', handlePreferenceChange);
    } else if (typeof mediaQuery.addListener === 'function') {
      mediaQuery.addListener(handlePreferenceChange);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
