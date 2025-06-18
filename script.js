// Animate Google search results when they appear
window.__gcse = {
  callback: function () {
    const observer = new MutationObserver((mutationsList, observerInstance) => {
      const results = document.querySelector('.gsc-resultsbox-visible');
      const spinner = document.getElementById('loadingSpinner');

      // Check for results and that they actually contain content
      if (results && results.children.length > 0) {
        // Animate results
        results.classList.remove('fade-in');
        void results.offsetWidth; // force reflow
        results.classList.add('fade-in');
        // Hide spinner once results appear
        spinner.classList.remove('active');
        // Stop observing once results are shown to avoid unnecessary calls
        observerInstance.disconnect();
      }
    });

    // Observe changes in the document body for the appearance of search results
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
};

document.addEventListener('DOMContentLoaded', () => {
  const spinner = document.getElementById('loadingSpinner');
  const searchInput = document.querySelector('input.gsc-input');

  // Ensure search input exists
  if (!searchInput) {
    console.warn("Google CSE search input not found. Some features might not work.");
    return;
  }

  // No separate search button now, the input itself triggers search on Enter
  // and the spinner activates on input change

  // Show spinner when user starts typing
  searchInput.addEventListener('input', () => {
    spinner.classList.add('active');
    // Re-connect the mutation observer if user types again
    if (window.__gcse && window.__gcse.callback) {
      window.__gcse.callback();
    }
  });

  // Trigger search when Enter key is pressed in the input field
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      spinner.classList.add('active'); // Ensure spinner is active on manual Enter
      // Re-connect the mutation observer if user presses enter
      if (window.__gcse && window.__gcse.callback) {
        window.__gcse.callback();
      }
    }
  });

  // Keyboard shortcut Ctrl+K or Cmd+K to focus search input
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault(); // Prevent browser default (e.g., opening search bar)
      if (searchInput) {
        searchInput.focus();
        searchInput.select(); // Select existing text
      }
    }
  });
});