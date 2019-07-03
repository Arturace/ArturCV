import { Overlay } from "./overlay.js";

let programmingOverlay = new Overlay();
programmingOverlay.onHide = () => {
   Array.from(document.getElementsByClassName('programming-hover-item')).forEach((el: HTMLDivElement) => {
      el.style.top ='150vh';
      setTimeout(() => {
         document.body.removeChild(el);
      }, 200);
   });
};

Array.from(document.getElementById('Programming').getElementsByTagName('ul')).forEach((ulEl) => {
   Array.from(ulEl.children).forEach(element => {
      element.addEventListener('click', function() {
         //If we have any detail
         if  (element.children.length > 1) {
            programmingOverlay.show();
 
            (element as HTMLLinkElement).classList.toggle('active');
            let div: HTMLDivElement = (element as HTMLLinkElement).children.item(0) as HTMLDivElement;
   
            let hoverDiv: HTMLDivElement = document.createElement('div');
            hoverDiv.innerHTML = element.children.item(1).innerHTML;
   
            //initial position replicates the one of the clicked element
            hoverDiv.style.top = div.getBoundingClientRect().top + 'px';
            hoverDiv.style.left = div.getBoundingClientRect().left + 'px';
            hoverDiv.style.opacity = '0';
   
            hoverDiv.classList.add('programming-hover-item', ulEl.classList[0]);
            document.body.appendChild(hoverDiv);
   
            setTimeout(() => {
               //After the element is appended, we need to animate it into the proper centered position
               hoverDiv.style.opacity = '1';
               hoverDiv.style.top = '';
               hoverDiv.style.left = '';  
               hoverDiv.classList.add('in-middle'); 
            }, 0.0);
         }
         
         //listElement.classList.toggle('active');

         /*document.getElementById('Programming').classList.toggle('detail');

         if (element.children.item(1) != null) {
            //showing the details
            document.getElementById('ProgrammingDetail').innerHTML = element.children.item(1).innerHTML;
         }*/
      });
   });

   //Setting horizontal scroll
   let scrollInterval: number = 0;
   let scrollStart: Date;
   ulEl.addEventListener('wheel', function(e: WheelEvent) {
      clearInterval(scrollInterval);
      scrollStart = new Date();
      if (e.deltaY > 0) { 
         //going right
         scrollInterval = setInterval(function() {
            ulEl.scrollTo(ulEl.scrollLeft + 2.5 ,0);
            if (scrollStart.getTime() < new Date().getTime() - 1 * 100 ) {
               clearInterval(scrollInterval);
            } 
         }, 0.1);
      } else if (e.deltaY < 0 /*&& value.scrollLeft > 0*/) {
         //going left
         scrollInterval = setInterval(function() {
            ulEl.scrollTo(ulEl.scrollLeft - 2.5,0);
            if (scrollStart.getTime() < new Date().getTime() - 1 * 100 ) {
               clearInterval(scrollInterval);
            } 
         }, 0.1);
      }
   });
});

document.getElementById('CloseDetail').addEventListener('click', () => {
   document.getElementById('Programming').classList.remove('detail');
});