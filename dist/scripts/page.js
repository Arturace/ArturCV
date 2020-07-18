export class PageLoader extends HTMLElement {
    constructor() {
        super();
        this.loaded = false;
        this.addEventListener('click', () => {
            if (!this.loaded) {
                Array.from(document.querySelectorAll(`[target="${this.target}"]`))
                    .forEach(val => val.unload());
                this.load();
            }
        });
    }
    get target() {
        return this.getAttribute('target');
    }
    get container() {
        if (!this.hasAttribute('target'))
            throw new Error('No target attribute found');
        return document.querySelector(this.getAttribute('target'));
    }
    get scriptId() {
        return this.target + 'script';
    }
    unload() {
        if (this.loaded) {
            this.container.removeAttribute('current-page');
            while (this.container.firstChild)
                this.container.removeChild(this.container.lastChild);
            this.loaded = false;
        }
    }
    loadScript(scriptUrl) {
        let script = document.createElement('script');
        script.setAttribute('type', 'module');
        script.setAttribute('src', scriptUrl + '?v=' + Date.now().toString());
        script.id = this.scriptId;
        document.head.appendChild(script);
    }
    load() {
        this.loaded = true;
        if (!this.getScriptTag)
            this.loadScript(this.getAttribute('script'));
        let htmlUrl = this.getAttribute('html');
        if (!htmlUrl)
            throw new Error('html attribute was not found');
        this.container.setAttribute('current-page', this.getAttribute('page-name'));
        fetch(htmlUrl)
            .then(result => result.text())
            .then(html => this.container.innerHTML = html)
            .catch(reason => console.log(reason));
    }
    getScriptTag() {
        return document.getElementById(this.scriptId);
    }
}
