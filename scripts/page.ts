export class FakePage extends HTMLElement {
   public container: HTMLElement = null;

   constructor() {
      super();
   }

   public unload() {
      this.container.removeChild(this);
   }

   public async load() {
      if (this.hasAttribute('script')) {
         if (!window[this.id + 'script']) {
            let script = document.createElement('script');
            script.setAttribute('type', 'module');
            script.setAttribute('src', this.getAttribute('script') + '?v=' + Date.now().toString()); //Forcing to reload the script
            script.id = this.id + 'script';
            document.head.appendChild(script);
         }
      }
      this.container.appendChild(this);
   }

   public getScript(): HTMLScriptElement {
      return <HTMLScriptElement>document.getElementById(this.id + 'script');
   }
}