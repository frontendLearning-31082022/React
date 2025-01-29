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

    </div>
  )
}
