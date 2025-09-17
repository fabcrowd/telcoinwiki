(function () {
  function createButton(label) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'copy-button focus-ring';
    button.innerHTML = '<span aria-hidden="true">📋</span><span class="visually-hidden">Copy code</span>';
    button.dataset.defaultLabel = label;
    return button;
  }

  function copyToClipboard(text) {
    return navigator.clipboard ? navigator.clipboard.writeText(text) : fallbackCopy(text);
  }

  function fallbackCopy(text) {
    return new Promise((resolve, reject) => {
      try {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.setAttribute('readonly', '');
        textarea.style.position = 'absolute';
        textarea.style.left = '-9999px';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        resolve();
      } catch (err) {
        reject(err);
      }
    });
  }

  function enhanceCodeBlocks() {
    document.querySelectorAll('pre code').forEach((codeBlock) => {
      const pre = codeBlock.parentElement;
      if (pre.dataset.copyEnhanced) return;
      pre.dataset.copyEnhanced = 'true';

      const button = createButton('Copy');
      button.addEventListener('click', () => {
        copyToClipboard(codeBlock.textContent.trim()).then(() => {
          button.textContent = 'Copied!';
          setTimeout(() => {
            button.innerHTML = '<span aria-hidden="true">📋</span><span class="visually-hidden">Copy code</span>';
          }, 1600);
        }).catch(() => {
          button.textContent = 'Error';
          setTimeout(() => {
            button.innerHTML = '<span aria-hidden="true">📋</span><span class="visually-hidden">Copy code</span>';
          }, 1600);
        });
      });

      pre.appendChild(button);
    });
  }

  document.addEventListener('DOMContentLoaded', enhanceCodeBlocks);
  document.body?.addEventListener('themechange', enhanceCodeBlocks);
})();
