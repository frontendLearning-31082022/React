import React, { useEffect, useState } from 'react'

import { useDispatch, useStore } from 'react-redux'
// import { incr } from './../app/store'
import { useWordsQuery, wordsApi } from 'features/api/apiSlice';
import "./../css/WordList.scss"

export default function WordsList() {

    const { data, error, isLoading, isFetching, isSuccess } = useWordsQuery(
        { offset: 0 }
    );

    const ds = useDispatch();

    return (
        <div>
            <div>{
                (isSuccess) ?
                    data?.map((d) => {
                        // debugger;
                        return (
                            <div className='word'>
                                <div className="word__rus">{d.word_rus}</div>
                                <div className="word__eng">{d.word_eng}</div>
                                <div className="word__meaning">{d.meaning}</div>
                            </div>
                        );
                    })
                    : "Loading..."

            }</div>


        </div>
    )
}
