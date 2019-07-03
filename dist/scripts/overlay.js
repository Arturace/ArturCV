export class Overlay {
    constructor(animationLength = 200, onHide = null) {
        this.animationLength = animationLength;
        this.onHide = onHide;
        this.mainDiv = document.createElement('div');
        this.mainDiv.classList.add('overlay');
        this.mainDiv.addEventListener('click', () => {
            this.hide();
        });
    }
    show() {
        document.body.appendChild(this.mainDiv);
        setTimeout(() => { this.mainDiv.classList.add('active'); }, 0);
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
