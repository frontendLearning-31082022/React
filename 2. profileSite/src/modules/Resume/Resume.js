import React from 'react'

import './Resume.scss';

const sites = [
    { logo: 'HH', name: 'HeadHunter', back: 'fb2719', href: '' },
    { logo: 'SJ', name: 'SuperJob', back: '00aa87', href: '' },
    { logo: 'JL', name: 'JobLab', back: '1a4f7e', href: '' }
];

export default function Resume() {
    return (
        <div className='resume_list'> 
                {sites.map((t, i) =>
                    <a key={i} style={{ background: "#" + t.back }} className='resume_item'
                        title={t.name} href={t.href} >{t.logo}</a>)}
        </div>
    )
}
