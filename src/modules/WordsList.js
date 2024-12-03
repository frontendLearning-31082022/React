import React, { useEffect, useState } from 'react'

import { useDispatch, useStore } from 'react-redux'
// import { incr } from './../app/store'
import { useWordsQuery, wordsApi } from 'features/api/apiSlice';


export default function WordsList() {
    // const store = useStore();
    // const q = apiSlice.useGetPostsQuery();

    // const [words, setWords] = useState([]);

    // const { useGetPostsQuery } = apiSlice;
    // debugger;

    const { data, error, isLoading, isFetching, isSuccess } = useWordsQuery(
        { offset: 0 }
    );

    const ds = useDispatch();

    return (
        <div>

            {/* <button onClick={() => { loadWords(); }}>Подгрузить</button> */}
            {/* <button onClick={() => { ds(incr()) }}>Тест</button> */}


            <div>{
                (isSuccess) ?
                    data?.map((d) => {
                        // debugger;
                        return (
                            <div className="data">{d.word_rus}</div>
                        );
                    })
                    : "Loading..."

            }</div>

            {/* <div>
                {words.map((t,i) => <div key={i}>{t.word_rus}</div>)}
            </div> */}


        </div>
    )
}
