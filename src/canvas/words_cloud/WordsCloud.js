import React from 'react'
import { useEffect, useState } from 'react';

import './WordsCloud.css';

import * as $ from 'jquery'


const style = {
    transform: [
        'matrix(1 0 0 1 497.4292 293.7129)',
        'matrix(1 0 0 1 727.8999 191.9316)',
        'matrix(1 0 0 1 433.0854 82.7407)',
        'matrix(1 0 0 1 188.187 144.3555)',
        'matrix(1 0 0 1 380.8301 145.1353)',
        'matrix(1 0 0 1 378.8799 54.6626)',
        'matrix(1 0 0 1 247.0718 191.1514)',
        'matrix(1 0 0 1 0 129.9268)',
        'matrix(1 0 0 1 250.9712 76.1118)',
        'matrix(1 0 0 1 229.9131 169.5225)',
        'matrix(1 0 0 1 472.4722 105.3691)',
        'matrix(1 0 0 1 735.7007 163.4639)',
        'matrix(1 0 0 1 128.9111 264.4697)',
        'matrix(1 0 0 1 191.3057 102.2393)',
        'matrix(1 0 0 1 318.4351 289.0342)',
        'matrix(1 0 0 1 740.77 211.4307)',
        'matrix(1 0 0 1 683.0542 230.5381)',
        'matrix(0.9244 0 0 1 632.7485 97.0288)',
        'matrix(1 0 0 1 663.5552 139.2856)',
        'matrix(1 0 0 1 251.3608 240.4502)',
        'matrix(1 0 0 1 217.0439 54.2744)',
        'matrix(1 0 0 1 119.9526 240.2871)',
        'matrix(1 0 0 1 444.0044 34.7744)',
        'matrix(1 0 0 1 125.4019 129.147)',
        'matrix(1 0 0 1 350.8022 207.5303)',
        'matrix(1 0 0 1 81.5249 212.6006)',
        'matrix(1 0 0 1 545.0063 316.7061)',
        'matrix(1 0 0 1 638.2075 66.7529)',
        'matrix(1 0 0 1 185.8467 282.4043)',
        'matrix(1 0 0 1 34.1494 150.5947)',
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

    const [classes, setClasses] = useState(style.classes);

    useEffect(() => {

        const old = function () {

            var words = $('#tagi text'),
                l = words.length,
                current = null,
                delay = 2000;

            function clearBlink(o) {
                var
                    ca = o.getAttribute('class').split(' '),
                    i = ca.indexOf('blink');

                if (i !== -1) {
                    ca.splice(i, 1);
                    o.setAttribute('class', ca.join(' '));
                }
            }

            function addBlink(o) {
                var
                    ca = o.getAttribute('class').split(' ');
                ca.push('blink');
                o.setAttribute('class', ca.join(' '));
            }

            function wordblink() {

                var e;

                if (current !== null) {
                    clearBlink($(words[current])[0])
                }

                current = Math.floor(Math.random() * l);
                e = $(words[current]);
                addBlink(e[0]);

                setTimeout(wordblink, delay);
            }

            wordblink();

        };

        const newF = function () {

            var words = $('#tagi text'),
                l = words.length,
                current = null,
                delay = 2000;

            function clearBlink(o) {
                var
                    ca = o.getAttribute('class').split(' '),
                    i = ca.indexOf('blink');

                if (i !== -1) {
                    ca.splice(i, 1);
                    o.setAttribute('class', ca.join(' '));
                }
            }

            function addBlink(o) {
                var
                    ca = o.getAttribute('class').split(' ');
                ca.push('blink');
                o.setAttribute('class', ca.join(' '));
            }

            function wordblink() {

                var e;

                if (current !== null) {
                    clearBlink($(words[current])[0])
                }

                current = Math.floor(Math.random() * l);
                e = $(words[current]); // 
                addBlink(e[0]);

                setTimeout(wordblink, delay);
            }

            wordblink();

        };


        $(document).ready(newF);
    }, []);

    return (
        <div>

            {/* <svg id="tagi" x="0px" y="0px" width="920px" height="324px" viewBox="0 0 920 324">
                <> {props.skills
                    .map((t, i) => <>

                        <text transform={style.transform[i]}
                            {...(i === 2 ? { id: 'XMLID_2_' } : {})}
                            className={style.classes[i]}>{t}</text>

                    </>)}</>
            </svg> */}

            /* <svg id="tagi" x="0px" y="0px" width="920px" height="324px" viewBox="0 0 920 324">
    <text transform="matrix(1 0 0 1 497.4292 293.7129)" class="st17 st0">SALES</text>
    <text transform="matrix(1 0 0 1 727.8999 191.9316)" class="st17 st20">CPC</text>
    <text id="XMLID_2_" transform="matrix(1 0 0 1 433.0854 82.7407)" class="st17 st8">LEADS</text>
    <text transform="matrix(1 0 0 1 188.187 144.3555)" class="st5 st17 st22">CLICKS</text>
    <text transform="matrix(1 0 0 1 380.8301 145.1353)" class="st17 st29">ADWORDS</text>
    <text transform="matrix(1 0 0 1 378.8799 54.6626)" class="st5 st28 st6">BING</text>
    <text transform="matrix(1 0 0 1 247.0718 191.1514)" class="st5 st28 st18">YANDEX</text>
    <text transform="matrix(1 0 0 1 0 129.9268)" class="st5 st28 st30">vKONTAKTE</text>
    <text transform="matrix(1 0 0 1 250.9712 76.1118)" class="st5 st28 st14">REMARKETING</text>
    <text transform="matrix(1 0 0 1 229.9131 169.5225)" class="st5 st28 st25">MARKETING</text>
    <text transform="matrix(1 0 0 1 472.4722 105.3691)" class="st5 st28 st27">LOOKALIKE</text>
    <text transform="matrix(1 0 0 1 735.7007 163.4639)" class="st5 st28 st1">BIG DATA</text>
    <text transform="matrix(1 0 0 1 128.9111 264.4697)" class="st5 st28 st26">REKLAMA EFEKTYWNOŚCIOWA</text>
    <text transform="matrix(1 0 0 1 191.3057 102.2393)" class="st5 st28 st24">PERFORMANCE</text>
    <text transform="matrix(1 0 0 1 318.4351 289.0342)" class="st5 st28 st1">AUTOMATION</text>
    <text transform="matrix(1 0 0 1 740.77 211.4307)" class="st5 st28 st21">ATTRIBUTION</text>
    <text transform="matrix(1 0 0 1 683.0542 230.5381)" class="st5 st28 st19">BEHAVIORAL</text>
    <text transform="matrix(0.9244 0 0 1 632.7485 97.0288)" class="st5 st28 st16">E-COMMERCE</text>
    <text transform="matrix(1 0 0 1 663.5552 139.2856)" class="st5 st28 st3">KONWERSJE</text>
    <text transform="matrix(1 0 0 1 251.3608 240.4502)" class="st5 st17 st31">SHOPPING CAMPAIGNS</text>
    <text transform="matrix(1 0 0 1 217.0439 54.2744)" class="st5 st28 st11">PRODUCT FEED</text>
    <text transform="matrix(1 0 0 1 119.9526 240.2871)" class="st5 st28 st13">TRACKING</text>
    <text transform="matrix(1 0 0 1 444.0044 34.7744)" class="st5 st17 st4">KEYWORDS</text>
    <text transform="matrix(1 0 0 1 125.4019 129.147)" class="st5 st28 st15">CTR</text>
    <text transform="matrix(1 0 0 1 350.8022 207.5303)" class="st17 st2">REVENUE</text>
    <text transform="matrix(1 0 0 1 81.5249 212.6006)" class="st17 st9">ROI</text>
    <text transform="matrix(1 0 0 1 545.0063 316.7061)" class="st5 st28 st23">COSTS</text>
    <text transform="matrix(1 0 0 1 638.2075 66.7529)" class="st5 st28 st12">AD GROUPS</text>
    <text transform="matrix(1 0 0 1 185.8467 282.4043)" class="st5 st28 st10">OPTIMIZATION</text>
    <text transform="matrix(1 0 0 1 34.1494 150.5947)" class="st5 st28 st7">TARGETING</text>
  </svg> 


        </div>
    )
}
