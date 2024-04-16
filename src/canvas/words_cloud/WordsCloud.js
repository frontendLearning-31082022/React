import React from 'react'
import { useEffect, useState } from 'react';

import './WordsCloud.css';

const style = {
    transform: [
        'matrix(1 0 0 1 397.4292 293.7129)',
        'matrix(1 0 0 1 627.8999 191.9316)',
        'matrix(1 0 0 1 333.0854 82.7407)',
        'matrix(1 0 0 1 88.187 144.3555)',
        'matrix(1 0 0 1 280.8301 145.1353)',
        'matrix(1 0 0 1 278.8799 54.6626)',
        'matrix(1 0 0 1 147.0718 191.1514)',
        'matrix(1 0 0 1 78.9111 294.4697)',
        'matrix(1 0 0 1 150.9712 76.1118)',
        'matrix(1 0 0 1 129.9131 169.5225)',
        'matrix(1 0 0 1 372.4722 105.3691)',
        'matrix(1 0 0 1 635.7007 163.4639)',
        'matrix(1 0 0 1 28.9111 264.4697)',
        'matrix(1 0 0 1 91.3057 102.2393)',
        'matrix(1 0 0 1 218.4351 289.0342)',
        'matrix(1 0 0 1 640.77 211.4307)',
        'matrix(1 0 0 1 583.0542 230.5381)',
        'matrix(0.9244 0 0 1 532.7485 97.0288)',
        'matrix(1 0 0 1 563.5552 139.2856)',
        'matrix(1 0 0 1 151.3608 240.4502)',
        'matrix(1 0 0 1 117.0439 54.2744)',

        // 'matrix(1 0 0 1 119.9526 240.2871)'
        // 'matrix(1 0 0 1 444.0044 34.7744)',
        // 'matrix(1 0 0 1 125.4019 129.147)',
        // 'matrix(1 0 0 1 350.8022 207.5303)',
        // 'matrix(1 0 0 1 81.5249 212.6006)',
        // 'matrix(1 0 0 1 545.0063 316.7061)',
        // 'matrix(1 0 0 1 638.2075 66.7529)',
        // 'matrix(1 0 0 1 185.8467 282.4043)',
        // 'matrix(1 0 0 1 34.1494 150.5947)',
    ],
    classes: [
        'st17 st0',
        'st17 st20',
        'st17 st8',
        'st5 st17 st22',
        'st17 st29',
        'st5 st28 st6',
        'st5 st28 st18',
        'st5 st28 st30',
        'st5 st28 st14',
        'st5 st28 st25',
        'st5 st28 st27',
        'st5 st28 st1',
        'st5 st28 st26',
        'st5 st28 st24',
        'st5 st28 st1',
        'st5 st28 st21',
        'st5 st28 st19',
        'st5 st28 st16',
        'st5 st28 st3',
        'st5 st17 st31',
        'st5 st28 st11',
        'st5 st28 st13',
        'st5 st17 st4',
        'st5 st28 st15',
        'st17 st2',
        'st17 st9',
        'st5 st28 st23',
        'st5 st28 st12',
        'st5 st28 st10',
        'st5 st28 st7'
    ]
};

export default function WordsCloud(props) {

    const maxWords = props.skills.length;

    const [classes, setClass] = useState(style.classes);
    const [current, setCurrent] = useState(Math.floor(Math.random() * maxWords));
    const [timer, setTimer] = useState(true);

    const delay = 4000;

    function clearBlink(classes, index, setter) {
        const slitted = classes[index].split(' '),
            i = slitted.indexOf('blink');

        if (i !== -1) {
            slitted.splice(i, 1);
            classes[index] = slitted.join(' ');
            setter(classes)
        }
    }

    function addBlink(classes, index, setter) {
        classes[index] = classes[index] + ' blink';
        setter(classes);
    }

    const wordblink = () => {
        if (current !== null) {
            clearBlink(classes, current, setClass)
        }

        let currentNew = Math.floor(Math.random() * maxWords);
        setCurrent(currentNew);
        addBlink(classes, currentNew, setClass);

        setTimeout(() => { setTimer(!timer) }, delay);
    }


    useEffect(() => {
        wordblink();
    }, [timer]);

    return (
        <><link href='https://fonts.googleapis.com/css?family=Open+Sans:400,600&subset=latin,latin-ext'
            rel='stylesheet' type='text/css'></link>
            <svg id="tagi" x="0px" y="0px" viewBox="0 0 920 324">
                {props.skills.map((t, i) => <>
                    <text transform={style.transform[i]} className={classes[i]} key={i}>{t}</text></>)
                } </svg></>
    )
}
