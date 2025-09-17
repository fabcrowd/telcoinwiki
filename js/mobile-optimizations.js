(function () {
  'use strict';
  const processedTables = new WeakSet();

  function getHeaderLabels(table) {
    const headCells = Array.from(table.querySelectorAll('thead th'));
    if (headCells.length) {
      return headCells.map((cell) => cell.textContent.trim());
    }
    const firstRow = table.querySelector('tbody tr');
    if (!firstRow) return [];
    return Array.from(firstRow.children).map((cell) => cell.textContent.trim());
  }

  function decorateTable(table) {
    if (!table || processedTables.has(table)) {
      return;
    }

    const labels = getHeaderLabels(table);
    if (!labels.length) {
      return;
    }

    const rows = Array.from(table.querySelectorAll('tbody tr'));
    rows.forEach((row) => {
      Array.from(row.children).forEach((cell, index) => {
        if (!(cell instanceof HTMLElement)) return;
        if (!cell.hasAttribute('data-label') && labels[index]) {
          cell.setAttribute('data-label', labels[index]);
        }
      });
    });

    processedTables.add(table);
  }

  function enhanceTables(root = document) {
    const tables = Array.from(root.querySelectorAll('[data-responsive-table]'));
    tables.forEach(decorateTable);
  }

  const observer = new MutationObserver((mutations) => {
    let shouldRun = false;
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            if (node.matches?.('[data-responsive-table]')) {
              decorateTable(node);
            } else if (node.querySelector?.('[data-responsive-table]')) {
              shouldRun = true;
            }
          }
        });
      }
    });

    if (shouldRun) {
      enhanceTables();
    }
  });

  document.addEventListener('DOMContentLoaded', () => {
    enhanceTables();
    observer.observe(document.body, { childList: true, subtree: true });
  });
})();
