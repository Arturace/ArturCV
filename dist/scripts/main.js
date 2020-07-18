import { PageLoader } from "./page.js";
import { Loader } from "./loader.js";
import { Overlay } from "./overlay.js";
class App {
    constructor(container = document.body) {
        this.container = container;
        this.pages = [];
        this.currentPage = null;
        this.loader = null;
        this.overlay = null;
        window.customElements.define('load-indicator', Loader);
        window.customElements.define('page-loader', PageLoader);
        this.loader = new Loader();
        this.overlay = new Overlay(200, true);
        this.pages = Array.from(document.getElementsByTagName("page-loader"));
    }
}
var main;
(function () {
    main = new App(document.getElementById('page'));
    let cachedNavigationElements = Array.from(document.getElementById('Navigation').children);
    cachedNavigationElements.forEach((value) => {
        value.addEventListener('click', function () {
            document.body.classList.add('content-shown');
            cachedNavigationElements.forEach((value) => {
                value.classList.remove('selected');
            });
            this.classList.add('selected');
        });
    });
})();
