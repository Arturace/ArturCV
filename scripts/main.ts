import { FakePage } from "./page.js";
import { Loader } from "./loader.js";

class App {
   public pages: FakePage[] = [];
   public currentPage: FakePage = null;
   public loader: Loader = null;

   constructor(
      public container: HTMLElement = document.body
   ) {
      window.customElements.define('page-loader', Loader);
      window.customElements.define('fake-page', FakePage);
      //Make a loader
      this.loader = new Loader();
      //Get all fake pages
      this.pages = Array.from(<HTMLCollectionOf<FakePage>>document.getElementsByTagName("fake-page"));

      //Check if a page has no id
      for (let a: number = 0; a < this.pages.length; a++) {
         if (this.pages[a].id == null
            || this.pages[a].id == undefined
            || this.pages[a].id.trim() == ''){
               throw 'A FakePage has to have an id';
         } else {
            this.pages[a].parentElement.removeChild(this.pages[a]);
            this.pages[a].removeAttribute('hidden');
            this.pages[a].container = container;
         }
      }
   }

   public load(pageId: string): void {
      this.loader.show();
      for (let a: number = 0; a < this.pages.length; a++){
         if (this.pages[a].id == pageId) {
            if (this.currentPage != null)
               this.currentPage.unload();
            this.pages[a].load();
            this.currentPage = this.pages[a];
         }
      }
      this.loader.hide();
   }
}

var main : App;

(function(){
   main = new App(document.body);

   Array.from(<HTMLCollectionOf<HTMLLIElement>>document.getElementById('Navigation').children).forEach((value) => {
      value.addEventListener('click', function (){
         document.body.classList.add('content-shown');
         main.load(this.getAttribute('data-fake-page'));
         Array.from(<HTMLCollectionOf<HTMLLIElement>>document.getElementById('Navigation').children).forEach((value) => {
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