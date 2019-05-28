document.getElementsByName('HaveExperience').forEach((value) => {
   Array.from(value.children).forEach(element => {
      if (element instanceof HTMLUListElement){
         Array.from(element.children).forEach(listElement => {
            listElement.addEventListener('click', function() {
               //listElement.classList.toggle('active');
               document.getElementById('Programming').classList.toggle('detail');

               if (listElement.children.item(1) != null) {
                  //showing the details
                  document.getElementById('ProgrammingDetail').innerHTML = listElement.children.item(1).innerHTML;
               }
            });
         });
      }
   });
});

document.getElementById('CloseDetail').addEventListener('click', () => {
   document.getElementById('Programming').classList.remove('detail');
});