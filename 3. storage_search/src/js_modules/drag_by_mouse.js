export default class DragByMouse {
    constructor(domNode, funcReact) {
        const el = domNode;
        this.ctx = this;
        this.prevTouch = null;

        this.upFN = funcReact ? funcReact : (e) => { };



        const mouseMove = (e) => {
            let newPosX = e.movementX;
            let newPosY = e.movementY;

            if (e instanceof TouchEvent) {
                const touch = e.touches[0];
                if (this.ctx.prevTouch == null) {
                    this.ctx.prevTouch = touch;
                    return;
                }

                newPosX = touch.pageX - this.ctx.prevTouch.pageX;
                newPosY = touch.pageY - this.ctx.prevTouch.pageY;
                this.ctx.prevTouch = touch;
            }

            this.ctx.#move(el, newPosX, newPosY);
            // const top = parseInt(el.style.top);
            // el.style.top = top <= 0 ? '0px' : el.style.top;
            // // const bottom = parseInt(el.parentNode.style.height) - parseInt(el.style.height);
            // // x = el.offsetTop+x <= bottom ? x : 0;

            // el.style.top = (el.offsetTop + newPosY) + "px";
            // el.style.left = (el.offsetLeft + newPosX) + "px";
        }
        const mouseUp = (e) => {
            e.target.style.cursor = 'grab';
            document.removeEventListener('mousemove', mouseMove);
            document.removeEventListener('touchmove', mouseMove);
            document.removeEventListener('mouseup', mouseMove);
            document.removeEventListener('touchstart', mouseMove);
        };

        const main = (e) => {
            e.preventDefault();
            e.target.style.cursor = "grabbing";

            document.addEventListener('mousemove', mouseMove);
            document.addEventListener('touchmove', mouseMove);
            document.addEventListener('mouseup', mouseUp);
            document.addEventListener('touchend', mouseUp);
        };
        el.addEventListener('mousedown', main);
        el.addEventListener('touchstart', main);


    }

    #move(el, x, y) {
        // const w = parseInt(el.parentNode.style.width) - parseInt(el.style.width);
        const w = parseInt(el.parentNode.getBoundingClientRect().width) - parseInt(el.getBoundingClientRect().width);
        const h = parseInt(el.parentNode.getBoundingClientRect().height) - parseInt(el.getBoundingClientRect().height);

        const top = parseInt(el.style.top);
        el.style.top = top <= 0 ? '0px' : el.style.top;
        y = el.offsetTop + y <= h ? y : 0;
        x = el.offsetLeft + x <= w ? x : 0;
        const left = parseInt(el.style.left);
        el.style.left = left <= 0 ? '0px' : el.style.left;

        el.style.top = (el.offsetTop + y) + "px";
        el.style.left = (el.offsetLeft + x) + "px";
        this.upFN(el,{y:(el.offsetTop + y),x:(el.offsetLeft + x)  });
    }
}