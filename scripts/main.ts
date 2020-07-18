import { PageLoader } from "./page.js";
import { Loader } from "./loader.js";
import { Overlay } from "./overlay.js";

class App {
   public pages: PageLoader[] = [];
   public currentPage: PageLoader = null;
   public loader: Loader = null;
   public overlay: Overlay = null;
   /**
    * Defines the custom Html Elements
    * @param container will contain the current fake-page
    */
   constructor(
      public container: HTMLElement = document.body
   ) {
      window.customElements.define('load-indicator', Loader);
      window.customElements.define('page-loader', PageLoader);
      //Make a loader
      this.loader = new Loader();
      //Make a pageOverlay
      this.overlay = new Overlay(200, true);
      //Get all fake pages
      this.pages = Array.from(<HTMLCollectionOf<PageLoader>>document.getElementsByTagName("page-loader"));
   }
}

var main : App;

(function() {
   main = new App(document.getElementById('page'));

   //Caching navigation elements
   let cachedNavigationElements : Array<HTMLElement> = Array.from(<HTMLCollectionOf<HTMLLIElement>>document.getElementById('Navigation').children); 
   cachedNavigationElements.forEach((value) => {
      value.addEventListener('click', function (){
         document.body.classList.add('content-shown');
         cachedNavigationElements.forEach((value) => {
            value.classList.remove('selected');
         });
         this.classList.add('selected');
      });
   });

   // document.getElementsByName('HaveExperience').forEach((value) => {
   //    console.log(value);
   //    console.log(value.children);

   //    Array.from(value.children).forEach(element => {
   //       console.log(element);
   //    });
   // });
//data-fake-page

   // let loader = new Loader();
   // loader.show();
})();