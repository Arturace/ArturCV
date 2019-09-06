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
        setTimeout(() => { this.classList.add('active'); }, 1);
    }
    hide() {
        this.classList.remove('active');
        setTimeout(() => { document.body.removeChild(this); }, 200);
    }
}
