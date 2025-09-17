(function () {
  let activeBackdrop = null;

  function closeLightbox() {
    if (!activeBackdrop) return;
    activeBackdrop.classList.remove('active');
    const originalTrigger = activeBackdrop.__trigger;
    setTimeout(() => {
      activeBackdrop?.remove();
      activeBackdrop = null;
      originalTrigger?.focus();
    }, 200);
    document.removeEventListener('keydown', handleKeydown);
  }

  function handleKeydown(event) {
    if (event.key === 'Escape') {
      closeLightbox();
    }
  }

  function openLightbox(trigger) {
    const src = trigger.getAttribute('data-lightbox-src') || trigger.getAttribute('src');
    if (!src) return;

    const backdrop = document.createElement('div');
    backdrop.className = 'lightbox-backdrop active';
    backdrop.setAttribute('role', 'dialog');
    backdrop.setAttribute('aria-modal', 'true');

    const img = document.createElement('img');
    img.src = src;
    img.alt = trigger.getAttribute('alt') || '';
    img.loading = 'lazy';

    const closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.className = 'lightbox-close focus-ring';
    closeBtn.innerHTML = '<span aria-hidden="true">✕</span><span class="visually-hidden">Close</span>';

    closeBtn.addEventListener('click', closeLightbox);
    backdrop.addEventListener('click', (event) => {
      if (event.target === backdrop) {
        closeLightbox();
      }
    });

    backdrop.appendChild(img);
    backdrop.appendChild(closeBtn);
    backdrop.__trigger = trigger;

    document.body.appendChild(backdrop);
    activeBackdrop = backdrop;
    document.addEventListener('keydown', handleKeydown);
    closeBtn.focus();
  }

  function init() {
    document.querySelectorAll('figure[data-lightbox] img').forEach((img) => {
      img.classList.add('cursor-zoom-in');
      img.tabIndex = 0;
      const open = () => openLightbox(img);
      img.addEventListener('click', open);
      img.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          open();
        }
      });
    });
  }

  document.addEventListener('DOMContentLoaded', init);
})();
