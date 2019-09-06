import { Overlay } from "./overlay.js";
let programmingOverlay = new Overlay(0, false, true, () => {
    Array.from(document.getElementsByClassName('programming-hover-item')).forEach((el) => {
        el.style.top = '150vh';
        setTimeout(() => {
            document.body.removeChild(el);
        }, 200);
    });
});
Array.from(document.getElementById('Programming').getElementsByTagName('ul')).forEach((ulEl) => {
    Array.from(ulEl.children).forEach(element => {
        let div = element.children.item(0);
        div.addEventListener('click', function () {
            if (element.children.length > 1) {
                programmingOverlay.show();
                let hoverDiv = document.createElement('div');
                hoverDiv.innerHTML = element.children.item(1).innerHTML;
                hoverDiv.style.top = div.getBoundingClientRect().top + 'px';
                hoverDiv.style.left = div.getBoundingClientRect().left + 'px';
                hoverDiv.style.opacity = '0';
                hoverDiv.classList.add('programming-hover-item', ulEl.classList[0]);
                document.body.appendChild(hoverDiv);
                setTimeout(() => {
                    hoverDiv.style.opacity = '1';
                    hoverDiv.style.top = '';
                    hoverDiv.style.left = '';
                    hoverDiv.classList.add('in-middle');
                }, 0.0);
            }
        });
    });
    let scrollInterval = 0;
    let scrollStart;
    ulEl.addEventListener('wheel', function (e) {
        clearInterval(scrollInterval);
        scrollStart = new Date();
        if (e.deltaY > 0) {
            scrollInterval = setInterval(function () {
                ulEl.scrollTo(ulEl.scrollLeft + 2.5, 0);
                if (scrollStart.getTime() < new Date().getTime() - 1 * 100) {
                    clearInterval(scrollInterval);
                }
            }, 0.1);
        }
        else if (e.deltaY < 0) {
            scrollInterval = setInterval(function () {
                ulEl.scrollTo(ulEl.scrollLeft - 2.5, 0);
                if (scrollStart.getTime() < new Date().getTime() - 1 * 100) {
                    clearInterval(scrollInterval);
                }
            }, 0.1);
        }
    });
});
document.getElementById('CloseDetail').addEventListener('click', () => {
    document.getElementById('Programming').classList.remove('detail');
});
