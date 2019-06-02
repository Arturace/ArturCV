Array.from(document.getElementsByClassName('have-experience')).forEach((value) => {
    Array.from(value.children).forEach(element => {
        element.addEventListener('click', function () {
            console.log('click');
            document.getElementById('Programming').classList.toggle('detail');
            if (element.children.item(1) != null) {
                document.getElementById('ProgrammingDetail').innerHTML = element.children.item(1).innerHTML;
            }
        });
    });
    let scrollInterval = 0;
    let scrollStart;
    value.addEventListener('wheel', function (e) {
        clearInterval(scrollInterval);
        scrollStart = new Date();
        if (e.deltaY > 0) {
            scrollInterval = setInterval(function () {
                value.scrollTo(value.scrollLeft + 2, 0);
                if (scrollStart.getTime() < new Date().getTime() - 1 * 100) {
                    clearInterval(scrollInterval);
                }
            }, 0.1);
        }
        else if (e.deltaY < 0 && value.scrollLeft > 0) {
            scrollInterval = setInterval(function () {
                value.scrollTo(value.scrollLeft - 2, 0);
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
