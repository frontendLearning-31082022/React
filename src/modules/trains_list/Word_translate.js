import React, { useEffect, useState } from 'react'

import { useWordsQuery, useCompleteWordStatusQuery, wordsApi } from 'features/api/apiSlice';
import "./../../css/Word_translate.scss"

export default function Word_translate() {
  const [currentWord, setCurrentWord] = useState(null);
  const [wordsLocal, setWordsLocal] = useState([]);

  const { data,currentData, error, isLoading, isFetching, isSuccess } = useWordsQuery(
    { offset: 0 }
  );


  const GetPercentComplete = (id) => {
    const { data, error, isLoading, isFetching, isSuccess } = useCompleteWordStatusQuery(
      { id: 0 }
    );
    return data;
  }

  const rndWordSwitch = (e) => {
    const numWord = Math.floor(Math.random() * (wordsLocal.length - 0 + 1)) + 0;
    const word = wordsLocal[numWord];
    setCurrentWord(word);
  }

  const saveWordsToLocal = async () => {
    if (wordsLocal.length > 0) return;
    if(data)setWordsLocal(data);
  }

  const checkAnswer = () => {
    const answerVal = document.getElementById("answer").textContent;
    const wrong = answerVal != currentWord.WordAtRus;

  }

  useEffect(() => {
    saveWordsToLocal();
    store.dispatch(increment());
  }, [data]);

  return (
    <div>
      Тренировка АнглСлово-Перевод
      {currentWord == null ? <button onClick={rndWordSwitch}>Начать "Слово-Перевод"</button> : ""}

      {currentWord == null ? "" :
        <div className='cards_container'>
          <div className='cards_words'>
            <div className="WordAtEng card">{currentWord.word_eng}</div>
            <div className="WordAtRus card card-hided">{currentWord.word_rus}</div>
          </div>
          <div className='answer_panel'>
            <input id='answer'></input>
            <button>Проверить</button>
          </div>
        </div>

      }



    </div>
  )
}
