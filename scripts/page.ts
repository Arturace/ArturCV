export class FakePage extends HTMLElement {
   public container: HTMLElement = null;

   constructor() {
      super();
   }

   public unload() {
      this.container.removeChild(this);
   }

   public load() {
      this.container.appendChild(this);
   }
}