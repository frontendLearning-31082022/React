import React from 'react'

const style = {
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
        <div className='git_link'>
            <a href='https://github.com/frontendLearning-31082022'>
                <img src={`./parts_imgs/git.png`} className='git_page' style={style.img} />
            </a>
            <a style={style.a} href='https://github.com/frontendLearning-31082022'>frontendLearning-31082022</a>
        </div>
    )
}