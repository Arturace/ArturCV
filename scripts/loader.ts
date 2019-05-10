export class Loader extends HTMLElement {
   constructor() {
      super();
      let triangle : HTMLDivElement;
      for (let a = 0; a < 5; a++) {
         triangle= document.createElement('div');
         triangle.classList.add('triangle');
         this.append(triangle);
      }
   }

   public show() {
      document.body.append(this);
   }

   public hide() {
      document.body.removeChild(this);
   }
}