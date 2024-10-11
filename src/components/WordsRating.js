import React, { Component } from 'react'
// import { ItemTypes } from './Constants'

export default class WordsRating extends Component {
    constructor(props) {
        super(props);
        this.addWordExlude = this.addWordExlude.bind(this);
        this.onChangePosition = this.onChangePosition.bind(this);
        this.insertArrayOnIndex = this.insertArrayOnIndex.bind(this);
        this.recognizeWordOfRating = this.recognizeWordOfRating.bind(this);
        this.recognizeWordOfRatingAlert = this.recognizeWordOfRatingAlert.bind(this);
        this.saveNewWord = this.saveNewWord.bind(this);
        this.state = { excep_words: [], positions: [] };

    }

    componentDidUpdate() {
        if (this.props.ratingInputVal != null) this.addWordExlude();
        if (this.props.recognizeWordOfRating != null) this.recognizeWordOfRatingAlert(this.props.recognizeWordOfRating);


        if (this.props.showWordsList) this.loadWords();
    }



    componentDidMount() {
        if (this.props.recognizeWordOfRating_getFunc)this.props.recognizeWordOfRating_getFunc(this.recognizeWordOfRating);
    }


    async addWordExlude() {
        let val = prompt('Введите слово для исключенния?', this.props.ratingInputVal);
        if (val === null) return;
        const rating = prompt('Введите рейтинг', "1");
        if (rating === null) return;
        let askAdd = window.confirm('Подтвердить добавление? ' + val);

        this.props.onChangeRatingInputVal(null);
        if (!askAdd) return;

        const url = `${this.props.ip}job/articles/addExcludeWordVal/`;
        const resp = await fetch(url, {
            method: "POST",
            body: JSON.stringify({
                word: val,
                rating: rating,
            })

        });
        if (!resp.ok) {
            alert("Не удалось добавить " + resp.statusText);
            return;
        }
        alert("Добавлено слово для рейтинга ");
        // const res=await resp.body;
    }

    async saveNewWord() {
        const url = `${this.props.ip}job/articles/excludeWords/saveNewList/`;

        const resp = await fetch(url, {
            method: "POST",
            body: JSON.stringify({
                list: this.state.excep_words
            })
        });

        if (!resp.ok) {
            alert("Не удалось поменять в бд. " + resp.statusText);
            return;
        }

        alert("Новый список сохранен");
    }

    recognizeWordOfRating(word) {
        let wordRating = null;
        for (let index = 0; index < this.state.excep_words.length; index++) {
            const element = this.state.excep_words[index];

            word = word.toLowerCase();
            // word='sdaaглавныйasd';
            const regex = new RegExp(".*" + element.matchVal.toLowerCase() + ".*");

            const matchVals = word.match(regex);
            const match = matchVals != null;

            if (match) {
                return element;
            }
        }
    }

    recognizeWordOfRatingAlert(word) {
        this.props.onChangeRecognizeWordOfRating(null);

        const rating_word = this.recognizeWordOfRating(word);
        if (!rating_word) return;

        alert("Слово " + rating_word.matchVal + " - рейтинг " + rating_word.rating);
    }


    async loadWords() {
        if (this.state.excep_words.length > 0) return;

        const url = `${this.props.ip}job/articles/getExcludeWords/`;
        const resp = await fetch(url);
        if (!resp.ok) {
            alert("Не удалось зашрузить ExcepWords " + resp.statusText);
            return;
        }
        let ratingMatchVal = await resp.json();
        this.setState({ positions: ratingMatchVal.map((x, i) => i) });
        // ratingMatchVal = ratingMatchVal.map((x, i) => { x['order'] = i; return x; });
        // [...ratingMatchVal].forEach((x, i) => this.state.excep_words[i] = x);
        this.setState({ excep_words: ratingMatchVal });

    }

    onChangePosition(e, i) {
        this.state.positions[i] = e.target.value;
        this.setState({ positions: this.state.positions });
        // const change=this.state.positions;
        // change[i]=e.target.value;
        // this.setState({positions:change});
    }

    insertArrayOnIndex(indexEl, indexNew, event) {
        let el = this.state.excep_words[indexEl];
        // const b=[...document.getElementsByClassName('excep_word_pos')].filter(x=>x.value==el.rating)[0];
        // b.blur();

        this.state.excep_words.splice(indexEl, 1);
        this.state.excep_words.splice(indexNew, 0, el);

        //     // const f=[];
        //     // f.push()

        //     // el['order'] = indexNew;

        // [...document.getElementsByClassName('excep_word_pos')].forEach(x=>x.blur());
        for (let index = 0; index < this.state.positions.length; index++) {
            this.state.positions[index] = index;
        }
        this.setState({ excep_words: this.state.excep_words })
        this.setState({ positions: this.state.positions })
    }


    render() {

        // const upState = (value, ...path) => {
        //     let obj = this.state[path[0]];
        //     path.splice(0,1); 
        //     [...path].forEach(x => {
        //         obj = obj[x]
        //     }
        //     );
        //     debugger;
        //     // this.state[stateObj][i]=value;
        //     // this.setState({[stateObj]:this.state[stateObj]});
        // }

        return (
            <div>

                <div className='wordslist_exclude' style={{ visibility: (this.props.showWordsList) ? 'hidden':'initial'  }}>
                    {this.state.excep_words.map((x, i) => {
                        const objByOrder = x;

                        return <div className='wordslist_exclude_entry'>
                            <input className='excep_word_pos' key={i} value={this.state.positions[i]}
                                onKeyDown={(e) => {
                                    if (e.keyCode == 13) {
                                        this.insertArrayOnIndex(i, e.target.value, e);
                                    }
                                }} onChange={(e) => {
                                    this.state.positions[i] = e.target.value;
                                    this.setState({ positions: this.state.positions });
                                }} />
                            <div className='matchVal'> {objByOrder["matchVal"]} </div>
                            <div className='rating_val'> {objByOrder['rating']} </div>
                        </div>



                    })}
                    <button onClick={this.saveNewWord} >Сохранить новый список</button>
                </div>

            </div>
        )
    }


}

// function Card({ isDragging, text }) {
//     const [{ opacity }, dragRef] = useDrag(
//         () => ({
//             type: 'CARD',
//             item: { text },
//             collect: (monitor) => ({
//                 opacity: monitor.isDragging() ? 0.5 : 1
//             })
//         }),
//         []
//     )
//     return (
//         <div ref={dragRef} style={{ opacity }}>
//             {text}
//         </div>
//     )
// }
