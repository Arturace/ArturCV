window.customElements.define('theme-img', class ThemeImg extends HTMLImageElement{
  constructor() {
    super();
  }

  connectedCallback() {
    this.src = 
      window.matchMedia('(prefers-color-scheme: light)').matches
        ? this.lightSrc
        : this.darkSrc;
  }

  get lightSrc() {
    return this.getAttribute('light-src');
  }
  set lightSrc(src) {
    this.setAttribute('light-src', src);
  }

  get darkSrc() {
    return this.getAttribute('dark-src');
  }
  set darkSrc(src) {
    this.setAttribute('dark-src', src);
  }
}, { extends: 'img' });