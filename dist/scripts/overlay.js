export class Overlay {
    constructor(animationLength = 200, page = false, hideOnClick = false, onHide = null) {
        this.animationLength = animationLength;
        this.page = page;
        this.hideOnClick = hideOnClick;
        this.onHide = onHide;
        this.mainDiv = document.createElement('div');
        this.mainDiv.classList.add('overlay');
        if (this.page) {
            this.mainDiv.classList.add('page');
        }
        if (this.hideOnClick) {
            this.mainDiv.addEventListener('click', () => {
                this.hide();
            });
        }
    }
    show() {
        document.body.appendChild(this.mainDiv);
        setTimeout(() => { this.mainDiv.classList.add('active'); }, 1);
    }
    hide() {
        if (this.onHide != null) {
            this.onHide();
        }
        this.mainDiv.classList.remove('active');
        setTimeout(() => {
            document.body.removeChild(this.mainDiv);
        }, this.animationLength);
    }
}
