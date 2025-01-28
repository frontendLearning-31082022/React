import React from 'react'
import WordsList from './WordsList'
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom'

import "./../css/Menu.scss"
import Train from './Train'
import Word_translate from './trains_list/Word_translate'

export default function Menu() {

  return (

    <div>
      <div className='title'>Menu</div>
      <nav>
        <Link to={process.env.REACT_APP_URL_MenuMainPage}>Главная</Link>
        <Link to={process.env.REACT_APP_URL_WordsList}>Список</Link>
        <Link to={process.env.REACT_APP_URL_TrainingMenu}>Тренировка</Link>
      </nav>

      <Routes>
        <Route path={process.env.REACT_APP_URL_WordsList} element={<WordsList />}>    </Route>
        <Route path={process.env.REACT_APP_URL_TrainingMenu} element={<Train basePath={process.env.REACT_APP_URL_TrainingMenu} />}>    </Route>
        <Route path={process.env.REACT_APP_URL_Training_wordTranslate} element={<Word_translate />}>    </Route>
      </Routes>



    </div>
  )
}
