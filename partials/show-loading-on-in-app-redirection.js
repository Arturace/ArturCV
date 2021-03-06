(() => {
  const PAGE_LOADING = document.querySelector('body > app-loading');
  let leavePageLoadingShown = false;
  document.body.addEventListener('click', (e) => {
    if (leavePageLoadingShown) return;
    const T = e.target;
    if (T.nodeName == 'A' 
        && location.hostname == T.hostname) {
        e.preventDefault();
        PAGE_LOADING
          .show()
          .then(() => {
              leavePageLoadingShown = true;
              T.dispatchEvent(new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
                view: window
              }));
          });
    }
  });
})();
