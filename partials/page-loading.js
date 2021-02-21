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
      this._show();
    if (this.hasAttribute('hide')) {
      this._show();
      this.hide();
    }
  }

  show() {
    return new Promise(res => {
      setTimeout(() => {
        this._show();
        setTimeout(res, this.transitionDuration);
      }
      , 0);
    });
  }

  _show() {
    this.classList.add('shown');
  }

  hide() {
    return new Promise(res => {
      setTimeout(() => {
        this._hide();
        setTimeout(res, this.transitionDuration);
      }
      , 0);
    });
  }
  
  _hide() {
    this.classList.remove('shown');
  }

  get transitionDuration() {
    return parseInt(
      getComputedStyle(document.documentElement)
        .getPropertyValue('--loading-transition-duration')
    );
  }
});