window.customElements.define('el-loader', class ElementLoader extends HTMLElement{
  constructor() {
    super();
    this._waitedTimes = 0;
  }

  _waitForChildren() {
    if (this.children.length != 2) {
      if (++this._waitedTimes == 3)
        throw new Error('el-loader must have exactly 2 children.');
      setTimeout(() => this._waitForChildren(), 5 * this._waitedTimes);
    } else {
      this.loader = this.children[0];
      this.el = this.children[1];
      if (!this.el.loaded)
        this.el.addEventListener('load', () => {
          this.displayElement()
        });
      else
        this.displayElement();
    }
  }

  connectedCallback() {
    if (this.children.length != 2)
      this._waitForChildren();
  }

  displayElement() {
    setTimeout(() => {
      this.loader.hide();
      this.el.classList.add('loaded');  
    }, 150);
  }

  get transitionDuration() {
    return parseInt(
      getComputedStyle(this.loader)
        .getPropertyValue('--loading-transition-duration')
    );
  }
});