import React from 'react'
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom'
import Word_translate from './trains_list/Word_translate'
import { useWordsQuery, wordsApi } from 'features/api/apiSlice';

export default function Train({ basePath }) {

  const { data, error, isLoading, isFetching, isSuccess } = useWordsQuery(
    { offset: 0 }
  );
  return (
    <div>

      <nav>
        <Link to={process.env.REACT_APP_URL_Training_wordTranslate}>Слово-Перевод</Link>
      </nav>


      {(isSuccess) ?
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
        : "Loading..."}

      OKK

    </div>
  )
}
