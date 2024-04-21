import React from 'react'
import { useEffect, useState } from 'react';

const style = {
    'z-index': '100',
    position: 'absolute',
    top: '10%',
    left: '10%',
    right: '10%',
    overflow: 'hidden'
}
const btn = {
    position: 'absolute',
    right: '2%',
    top: '2%'
}

export default function WindowsModal(props) {

    const [show, setShow] = useState(false);
    useEffect(() => {
        props.showFn(() => { setShow(true) });
    }, []);

    const classN = props.className ? props.className : 'window_modal';

    return (
        <div className={classN}
            style={{ ...style, ...{ visibility: show ? 'visible' : 'hidden' } }}
            onClick={() => setShow(!show)}>
            <button className={classN + '_hide'} style={btn}>X</button>
            {props.children}
        </div>
    )
}