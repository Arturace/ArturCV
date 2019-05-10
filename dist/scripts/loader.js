export class Loader extends HTMLElement {
    constructor() {
        super();
        let triangle;
        for (let a = 0; a < 5; a++) {
            triangle = document.createElement('div');
            triangle.classList.add('triangle');
            this.append(triangle);
        }
    }
    show() {
        document.body.append(this);
    }
    hide() {
        document.body.removeChild(this);
    }
}
