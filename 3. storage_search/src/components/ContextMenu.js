import React from 'react'
import { useEffect, useState, useRef } from 'react';

export default function ContextMenu(props) {

    const [show, setShow] = useState(false);
    const [xy, setXy] = useState({ x: 0, y: 0 });
    const refClicked = useRef(null);

    const [clickNoDrag, setClickNoDragy] = useState(0);

    const refRoot = useRef(null);

    const detectClick = (e) => {
        if (e instanceof Error) return;
        if (e == null) return;

        let x = 0;
        let y = 0;

        const isMouse = e.type.indexOf('mouse') != -1;
        if (isMouse) {

            x = e.clientX;
            y = e.clientY;
            if (Math.abs(e.clientX - clickNoDrag) > 3) return;
        } else {
            x = e.changedTouches[0].clientX;
            y = e.changedTouches[0].clientY;
        }

        const x_menu_To_leftUp = x - refRoot.current.offsetWidth;
        const y_menu_To_leftUp = y - refRoot.current.offsetHeight;
        x=x_menu_To_leftUp;
        y=y_menu_To_leftUp;

        x=x<0?0:x;

        if (refRoot.current?.contains(e.target)) return;

        setShow((prev) => { return !prev });
        setXy({ x: x, y: y });
        refClicked.current = e.target;
    }
    const setXOnDown = (e) => {
        setClickNoDragy(e.clientX);
    }

    useEffect(() => {
        window.addEventListener('mousedown', setXOnDown);
        window.addEventListener('mouseup', detectClick);
        return () => {
            window.removeEventListener('mousedown', setXOnDown);
            window.removeEventListener('mouseup', detectClick);
            // window.removeEventListener('touchstart', detectClick);
        };
    }, [clickNoDrag])
    useEffect(() => {
        window.addEventListener('touchstart', detectClick);
    }, [])


    const style = <style>{` .contextmenu_content { background: #ebe08b;} 
    .contextmenu {position: fixed; z-index: 1000000;} 
    div.contextmenu_content:empty {visibility:hidden} `}</style>

    return (
        <div style={{ top: xy.y, left: xy.x, visibility: show ? 'initial' : 'hidden' }} className='contextmenu' ref={refRoot}>
            {style}
            <div className='contextmenu_content'>
                {props.render({ clickedEl: refClicked.current })}
            </div>
        </div>
    )
}