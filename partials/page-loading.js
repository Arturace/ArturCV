window.customElements.define('page-loading', class PageLoading extends HTMLElement{
  constructor() {
    super();
    this.overlay = document.createElement('div');
    this.overlay.classList.add('overlay');
    this.slide = document.createElement('div');
    this.slide.classList.add('slide');
  }

  connectedCallback() {
    this.appendChild(this.overlay);
    this.appendChild(this.slide);

    if (this.hasAttribute('is-shown'))
      this.show();
    if (this.hasAttribute('is-shown-immediatly'))
      this.classList.add('shown');
    if (this.hasAttribute('hide')) {
      this.classList.add('shown');
      this.hide();
    }
  }

  show() {
    setTimeout(() => this.classList.add('shown'), 0);
  }

  hide() {
    setTimeout(() => this.classList.remove('shown'), 0);
  }
});