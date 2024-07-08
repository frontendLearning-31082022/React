import React from 'react'
import { useEffect, useState, useRef } from 'react';

export default function ContextMenu(props) {

    const [show, setShow] = useState(false);
    const [xy, setXy] = useState({ x: 0, y: 0 });
    const refClicked = useRef(null);

    const [clickNoDrag, setClickNoDragy] = useState(0);

    const refRoot = React.createRef();

    const detectClick = (e) => {
        if (e instanceof Error) return;
        if (e==null) return;

        if(show){
            if(refRoot.current==null)return;
            if (refRoot.current.contains(e.target)) return
        }

        if (Math.abs(e.clientX - clickNoDrag) > 3) return;


        setShow((prev) => { return !prev });
        setXy({ x: e.clientX, y: e.clientY });
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
        };
    }, [clickNoDrag])

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