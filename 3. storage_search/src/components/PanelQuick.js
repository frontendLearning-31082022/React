import React from 'react'
import { useState } from 'react'

const style = `
.panel_quick {
    position: fixed;
    right: 0px;
    top: 50vh;
    -webkit-backface-visibility: hidden;
    display: flex;
}
.show_btn {
    all:unset;
    font-size: xxx-large;
    cursor: pointer;
    user-select: none;

    background-repeat: no-repeat;
    background-size: contain;
    background-position: center;
}
`;

const hided_state = '/images/images/storage_search/show_btn-hided.PNG';
const show_state = '/images/images/storage_search/show_btn-opened.PNG';

export default function PanelQuick(props) {
    const [show, setShow] = useState(false);

    return (
        <div className={"panel_quick " + (show ? 'panel_quick_show' : 'panel_quick_hide')}>
            <style>{style}</style>
            <button className='show_btn' onClick={() => { setShow(!show) }} style={{ backgroundImage: "url(" + (show ? show_state : hided_state) + ")" }} ></button>
            {show &&
                (<div className='panel_content' >
                    {props.render()}
                </div>)}
        </div>
    )
} 
