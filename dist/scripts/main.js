import { FakePage } from "./page.js";
import { Loader } from "./loader.js";
import { Overlay } from "./overlay.js";
class App {
    constructor(container = document.body) {
        this.container = container;
        this.pages = [];
        this.currentPage = null;
        this.loader = null;
        this.overlay = null;
        window.customElements.define('page-loader', Loader);
        window.customElements.define('fake-page', FakePage);
        this.loader = new Loader();
        this.overlay = new Overlay(200, true);
        this.pages = Array.from(document.getElementsByTagName("fake-page"));
        for (let a = 0; a < this.pages.length; a++) {
            if (this.pages[a].id == null
                || this.pages[a].id == undefined
                || this.pages[a].id.trim() == '') {
                throw 'A FakePage has to have an id';
            }
            else {
                this.pages[a].parentElement.removeChild(this.pages[a]);
                this.pages[a].removeAttribute('hidden');
                this.pages[a].container = container;
            }
        }
    }
    load(pageId) {
        this.overlay.show();
        this.loader.show();
        for (let a = 0; a < this.pages.length; a++) {
            if (this.pages[a].id == pageId) {
                if (this.currentPage != null)
                    this.currentPage.unload();
                this.pages[a].load();
                this.currentPage = this.pages[a];
            }
        }
        setTimeout(() => {
            this.overlay.hide();
            this.loader.hide();
        }, 200);
    }
}
var main;
(function () {
    main = new App(document.body);
    let cachedNavigationElements = Array.from(document.getElementById('Navigation').children);
    cachedNavigationElements.forEach((value) => {
        value.addEventListener('click', function () {
            document.body.classList.add('content-shown');
            main.load(this.getAttribute('data-fake-page'));
            cachedNavigationElements.forEach((value) => {
                value.classList.remove('selected');
            });
            this.classList.add('selected');
        });
    });
})();
