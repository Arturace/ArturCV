document.documentElement.classList.add(
  window.matchMedia('(prefers-color-scheme: light)')
    .matches 
      ? 'light'
      : 'dark' 
);