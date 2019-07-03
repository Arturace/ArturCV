export class Overlay {
   mainDiv: HTMLDivElement;
   
   constructor(
      public animationLength: number = 200
      , public onHide: () => void = null) 
   {
      this.mainDiv = document.createElement('div');
      this.mainDiv.classList.add('overlay');
      this.mainDiv.addEventListener('click', () => {
         this.hide();
      });
   }

   public show() {
      document.body.appendChild(this.mainDiv);
      setTimeout(() => { this.mainDiv.classList.add('active'); }, 0);      
   }

   public hide() {
      if (this.onHide != null) {
         this.onHide();
      }
      
      this.mainDiv.classList.remove('active');
      setTimeout(() => {
         document.body.removeChild(this.mainDiv);
      }, this.animationLength);      
   }
}