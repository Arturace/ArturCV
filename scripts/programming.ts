document.getElementsByName('HaveExperience').forEach((value) => {
   Array.from(value.children).forEach(element => {
      if (element instanceof HTMLUListElement){
         Array.from(element.children).forEach(listElement => {
            listElement.addEventListener('click', () => {
               listElement.classList.toggle('active');
            });
         });
      }
   });
});