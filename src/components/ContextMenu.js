import React from 'react'
import { useEffect, useState, useRef } from 'react';

export default function ContextMenu(props) {

    const [show, setShow] = useState(false);
    const [xy, setXy] = useState({ x: 0, y: 0 });
    const refClicked = useRef(null);

    const detectClick = (e) => {
        setShow((prev) => { return !prev });
        setXy({ x: e.clientX, y: e.clientY });
        refClicked.current = e.target;
    }

    useEffect(() => {
        document.addEventListener('click', detectClick, false);
    }, [])

    const style = <style>{` .contextmenu_content { background: #ebe08b;} 
    .contextmenu {position: fixed; z-index: 1000000;} 
    div.contextmenu_content:empty {visibility:hidden} `}</style>

    return (
        <div style={{ top: xy.y, left: xy.x, visibility: show ? 'initial' : 'hidden' }} className='contextmenu'>
            {style}
            <div className='contextmenu_content'>
                {props.render({ clickedEl: refClicked.current })}
            </div>
        </div>
    )
}