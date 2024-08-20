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
        width: 90vw;
        margin-left: 5%;
        position: absolute;
        top: 0px;
        background: gray;
        min-height: 300px;
        padding: 20px;
        }   

        button.close_add {
            position: absolute;
            right: 0px;
            height: 50px;
            width: 50px;
            top: 0px;
            background: #b32727;
            border: none;
        } 
        .add_item_window {
            display:flex;
            flex-direction:column;
        }

        .add_item_window input {
            width:fit-content;
        }
        `;

    const renderAddBox = [...fields].map((t, i) =>
        <div className={t}>
            {t} <input field={t} className={'add_new_window_arg'} value={inputsData[t]}
                onChange={input} ></input>
        </div>
    );

    const renderAddItem = <div className="add_item_window">
        Name <input field="name" className="add_new_window_arg" ></input>
        Cell name <input field="cell_name" className="add_new_window_arg" value={inputsData['cell_name']}></input>
        isItem <input field="isItem" className="add_new_window_arg" value="true"></input>
        w <input field="w" className="add_new_window_arg"></input>
        h <input field="h" className="add_new_window_arg"></input>
        d <input field="d" className="add_new_window_arg"></input>

    </div>

    return (
        <div style={{ visibility: (props.show ? "initial" : "hidden") }}>
            <style>{style}</style>

            <div className='content_add'>
                <button className='close_add' onClick={props.onClose} ></button>

                Введите новый объект

                {(props.type == 'addItem') ? renderAddItem : ''}
                {(props.type == 'addBox') ? renderAddBox : ''}

                <button onClick={() => { submit(props.submit) }}>добавить</button>

            </div>
        </div >
    )
}
