var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export class FakePage extends HTMLElement {
    constructor() {
        super();
        this.container = null;
    }
    unload() {
        this.container.removeChild(this);
    }
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.hasAttribute('script')) {
                if (!window[this.id + 'script']) {
                    let script = document.createElement('script');
                    script.setAttribute('type', 'module');
                    script.setAttribute('src', this.getAttribute('script') + '?v=' + Date.now().toString());
                    script.id = this.id + 'script';
                    document.head.appendChild(script);
                }
            }
            this.container.appendChild(this);
        });
    }
    getScript() {
        return document.getElementById(this.id + 'script');
    }
}
