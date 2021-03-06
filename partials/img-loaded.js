Object.defineProperty(HTMLImageElement.prototype,
  'loaded'
  , {
    get: function loaded() {
      return this.complete || this.naturalHeight != 0;
    }
  }
);