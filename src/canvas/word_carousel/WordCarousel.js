import React from 'react'
import { useEffect, useState } from 'react';

import './WordCarousel.scss'

export default function WordCarousel(words) {

    useEffect(() => {
        const list = document.querySelector("#list");
        const listContent = Array.from(list.children);
        
        listContent.forEach(item => {
            const duplicatedItem = item.cloneNode(true);
            duplicatedItem.setAttribute("aria-hidden",true);
            list.appendChild(duplicatedItem);
        });
    }, []);

    return (
        <div>
            <div id="container" data-animated>
                <ul id="list">
                    <li>First</li>
                    <li>Second</li>
                    <li>Third</li>
                    <li>Fourth</li>
                    <li>Fifth</li>
                    <li>First</li>
                    <li>Second</li>
                    <li>Third</li>
                    <li>Fourth</li>
                    <li>Fifth</li>
                </ul> </div>
        </div>
    )
}