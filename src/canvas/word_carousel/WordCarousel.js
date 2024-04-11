import React from 'react'

const style = {
    keyframe: {
        one: '-50%',
        two: '- 5px',
        speed: '90s'
    },
    container: {
        mask: 'linear-gradient(90deg, transparent, white 40%, white 60%, transparent)',
        '-webkit-mask': 'linear-gradient(90deg, transparent, white 40%, white 60%, transparent)',
        overflow: 'hidden',
        width: '100%',
    },
    ul: {
        display: 'flex',
        gap: '10px',
        'list-style': 'none',
        padding: '0',
        width: 'max-content',
    },
}

export default function WordCarousel(words) {
    const c = words.onClickElement;

    return (
        <div>
            <style>{`@keyframes scroll {
             to {
              translate: calc(${style.keyframe.one} ${style.keyframe.two}); }}

               .w_carousel_container .w_carousel_list {
                  animation: scroll ${style.keyframe.speed} linear infinite; } `}</style>

            <div className="w_carousel_container" style={style.container} data-animated>
                <ul className="w_carousel_list" style={style.ul}>
                    {words.words.map((t) => <li onClick={(e) => { c(e) }}>{t}</li>)}
                    {words.words.map((t) => <li aria-hidden="true" onClick={(e) => { c(e) }}>{t}</li>)}
                    {words.words.map((t) => <li aria-hidden="true" onClick={(e) => { c(e) }}>{t}</li>)}
                </ul>
            </div>
        </div>
    )
}