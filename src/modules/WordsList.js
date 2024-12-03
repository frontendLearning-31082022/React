import React, { useEffect, useState } from 'react'

import { useDispatch, useStore } from 'react-redux'
// import { incr } from './../app/store'
import { apiSlice, usePopoQuery } from 'features/api/apiSlice';




export default function WordsList() {
    // const store = useStore();
    // const q = apiSlice.useGetPostsQuery();

    // const [words, setWords] = useState([]);


    
    // const { useGetPostsQuery } = apiSlice;
    // debugger;

    const { data, isLoading, error } = usePopoQuery();

    useEffect(() => {

        // loadWords();
    }, []);


    const loadWords = () => {
/*
        // useGetPostsQuery().refetch();

        const da = data;
        debugger;
        const resp = fetch(process.env.REACT_APP_Words_getNoLearned);
        resp.then(async x => {
            if (x.ok) {
                let json = await x.json();


                setWords(json);
                // const cachedQueries = store.getState().api.queries;
                // debugger;
            } else {
                alert("Ошибка HTTP: " + x.status);
            }
        })

        */
    }

    const ds = useDispatch();

    return (
        <div>

            <button onClick={() => { loadWords(); }}>Подгрузить</button>
            {/* <button onClick={() => { ds(incr()) }}>Тест</button> */}


            <div>Данные {

                data?.map((d) => {
                    debugger;
                    return (
                        <div className="data"></div>
                    );
                })
            }</div>

            {/* <div>
                {words.map((t,i) => <div key={i}>{t.word_rus}</div>)}
            </div> */}


        </div>
    )
}
