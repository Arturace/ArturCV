export class FakePage extends HTMLElement {
    constructor() {
        super();
        this.container = null;
    }
    unload() {
        this.container.removeChild(this);
    }
    load() {
        this.container.appendChild(this);
    }
}
