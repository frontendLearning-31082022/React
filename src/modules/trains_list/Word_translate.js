// @ts-ignore
import React, { useEffect, useState } from 'react'

// @ts-ignore
import { useWordsQuery, useCompleteWordStatusQuery, wordsApi } from 'features/api/apiSlice';
import "./../../css/Word_translate.scss"
import { useDispatch } from 'react-redux';
import { increment } from '../../app/store';
import { postWordCheckResult } from '../../app/store';
import { store } from '../../app/store';

export default function Word_translate() {
  const [currentWord, setCurrentWord] = useState(null);
  let [wordsLocal, setWordsLocal] = useState([]);

  const [showResolve, setShowResolve] = useState([false]);
  const [markWrongAnwer, setMarkWrongAnwer] = useState([false]);

  const { data, currentData, error, isLoading, isFetching, isSuccess } = useWordsQuery(
    { offset: 0 }
  );


  const GetPercentComplete = (id) => {
    const { data, error, isLoading, isFetching, isSuccess } = useCompleteWordStatusQuery(
      { id: 0 }
    );
    return data;
  }


  // const rndWordSwitch = (e) => {

  // }

  const saveWordsToLocal = async () => {
    if (wordsLocal.length > 0) return;
    if (data) setWordsLocal(data);
  }

  const checkAnswer = () => {
    const answerVal = document.getElementById("answer").value;
    const wrong = answerVal != currentWord.word_rus;

    setShowResolve(false);
    const objPercent = { id: currentWord.id, wrong: wrong };
    store.dispatch(increment(objPercent));
    const obj={id:currentWord.id,wrong:wrong};
    store.dispatch(postWordCheckResult(obj));

    const wordRemove = wordsLocal.indexOf(currentWord);
    wordsLocal = wordsLocal.filter((x, i) => wordRemove != i);
    setWordsLocal(wordsLocal);
  }
  const nextWordBtn = () => {
    setShowResolve(true);
    setCurrentWord(null);
  }

  useEffect(() => {
    saveWordsToLocal();

  }, [data]);

  useEffect(() => {
    if (currentWord != null) return;
    const numWord = Math.floor(Math.random() * (wordsLocal.length - 0 + 1)) + 0;
    const word = wordsLocal[numWord];
    setCurrentWord(word);

  }, [currentWord]);

  return (
    <div>
      Тренировка АнглСлово-Перевод
      {/* {currentWord == null ? <button onClick={rndWordSwitch}>Начать "Слово-Перевод"</button> : ""} */}

      {currentWord == null ? "" :
        <div className='cards_container'>
          <div className='cards_words'>
            <div className="WordAtEng card">{currentWord.word_eng}</div>
            <div className={"WordAtRus card " + (showResolve ? "card-hided" : "")} id="resolve">{currentWord.word_rus}</div>
          </div>
          <div className='answer_panel'>
            <input id='answer' onKeyDown={(e) => { if (e.keyCode == 13) checkAnswer() }} autoComplete="off" />
            <button onClick={checkAnswer} >Проверить</button>
            <button onClick={nextWordBtn} >Дальше</button>
          </div>
        </div>

      }



    </div>
  )
}
