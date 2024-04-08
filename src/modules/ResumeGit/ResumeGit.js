import React from 'react'

const style = {
    div: {
        position: 'absolute',
        right: '1%',
        top: '1%',
        display: 'flex',
        'flex-direction': 'column',
        'align-items': 'end'
    },

    img: {
        width: '25px',
        height: '25px'
    },
    a: {
        'text-decoration': 'none',
        color: '#676767',
        'font-family': 'monospace',
        cursor: 'pointer'
    }
}

export default function ResumeGit() {
    return (
        <div style={style.div}>
            <a href='https://github.com/frontendLearning-31082022'>
                <img src={`./parts_imgs/git.png`} className='git_page' style={style.img} />
            </a>
            <a style={style.a} href='https://github.com/frontendLearning-31082022'>frontendLearning-31082022</a>
        </div>
    )
}