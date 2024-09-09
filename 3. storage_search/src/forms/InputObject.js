import { useState, useMemo, useCallback, useEffect } from "react";
import React from 'react'


const fields = ['name', 'w', 'h', 'd', 'cell_name'];

function submit(outsideFN) {
    const obj = {};
    [...document.getElementsByClassName('add_new_window_arg')].map(x => {
        const field = x.getAttribute('field');
        const val = x.value;
        obj[field] = val;

    })

    outsideFN(obj);
}

export default function InputObject(props) {


    const [inputsData, setInputsData] = useState({ inputs: [] });

    const setter = () => {
        // if (!props.show) return;
        // const inputsClear = [];
        // fields.forEach(x => {
        //     setInputsData(state => ({ ...state, [x]:'' }));
        // });

        setInputsData(state => ({ ...state, "cell_name": props.current_cell }));
    };

    const onOpenCloseUpdate = useMemo(setter, [props.show]);

    const input = (e) => {
        const value = e.target.value;
        const field = e.target.getAttribute('field');

        setInputsData(state => ({ ...state, [field]: value }));
    }

    const style = `.content_add {
        width: fit-content;
        margin-left: 5%;
        top: 0px;
        background: gray;
        min-height: 300px;
        padding: 20px;
        margin: 0 auto;
        margin-top: 20px;   
        position: relative;
        display: flex;
        flex-direction: column;     
        }   

        .content_add > * {
            display: flex;
            justify-content: space-between;
            gap: 16px;
        }

        .inputObject_addItem{
                width: fit-content;
                align-self: end;

                background: transparent;
                margin-top: 20px;
                padding: 7px;
        }

        .inputObject_title {
            font-weight: 900;
            margin-bottom: 15px;
        }   

        button.close_add {
            position: absolute;
            right: 0px;
            height: 50px;
            width: 50px;
            top: 0px;
            border: none;
        } 
        .add_item_window {
            display:flex;
            flex-direction:column;
        }

        .add_item_window input {
            width:fit-content;
        }

        .close {
            position: absolute;
            right: 7px;
            top: 7px;
            width: 32px;
            height: 32px;
            opacity: 0.3;
        }
            .close:hover {
            opacity: 1;
        }
            .close:before, .close:after {
            position: absolute;
            left: 15px;
            content: ' ';
            height: 33px;
            width: 2px;
            background-color: #333;
        }
            .close:before {
            transform: rotate(45deg);
        }
            .close:after {
            transform: rotate(-45deg);
        }

        `;

    const renderAddBox = [...fields].map((t, i) =>
        <div className={t}>
            {t} <input field={t} className={'add_new_window_arg'} value={inputsData[t]}
                onChange={input} ></input>
        </div>
    );

    const renderAddItem = <>
        <div> Name <input field="name" className="add_new_window_arg" ></input></div>
        <div> Cell name <input field="cell_name" className="add_new_window_arg" value={inputsData['cell_name']}></input></div>
        <div> isItem <input field="isItem" className="add_new_window_arg" value="true"></input></div >
        <div> w < input field="w" className="add_new_window_arg" ></input ></div >
        <div> h < input field="h" className="add_new_window_arg" ></input ></div >
        <div>d < input field="d" className="add_new_window_arg" ></input > </div >

    </>

    return (
        <div style={{ visibility: (props.show ? "initial" : "hidden") }} className="inputObject">
            <style>{style}</style>

            <div className='content_add'>
                <div className='close_add close' onClick={props.onClose} ></div>

                <div className="inputObject_title">Введите новый объект</div>

                {(props.type == 'addItem') ? renderAddItem : ''}
                {(props.type == 'addBox') ? renderAddBox : ''}

                <button onClick={() => { submit(props.submit) }} className="inputObject_addItem">добавить</button>

            </div>
        </div >
    )
}
