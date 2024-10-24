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
        this.saveNewList = this.saveNewList.bind(this);

        this.wordsLoaded_resolve = [];
        const rContext = this;
        this.waitWordsLoad = new Promise(function (resolve, reject) {
            rContext.wordsLoaded_resolve.push({ resolve: resolve, reject: reject });
        });

        this.state = {
            excep_words: [], positions: [], listsExcep: [], modalFn_ChooseListExclude: () => { }
            , hidedElements: new Set(['modalFn_ChooseListExclude'])
        };


    }

    componentDidUpdate() {
        if (this.props.ratingInputVal != null) this.addWordExlude();
        if (this.props.recognizeWordOfRating != null) this.recognizeWordOfRatingAlert(this.props.recognizeWordOfRating);


        if (this.props.showWordsList) this.loadWords();
    }



    componentDidMount() {
        if (this.props.recognizeWordOfRating_getFunc) {
            this.waitWordsLoad.then(x => {
                this.props.recognizeWordOfRating_getFunc(this.recognizeWordOfRating); });
        }
    }


    async addWordExlude() {
        const text = this.props.ratingInputVal;

        const handleClickNameListBtn = async (nameList) => {
            let val = prompt('Введите слово для исключенния?', text);
            if (val === null) return;
            const rating = prompt('Введите рейтинг', "1");
            if (rating === null) return;
            let askAdd = window.confirm('Подтвердить добавление? ' + val);

            if (!askAdd) return;

            const url = `${this.props.ip}job/articles/addExcludeWordVal/${nameList}/`;
            const resp = await fetch(url, {
                method: "POST",
                body: JSON.stringify({
                    word: val,
                    rating: rating,
                })

            });

            this.setState({ modalFn_ChooseListExclude: () => { } });
            this.state.hidedElements.add("modalFn_ChooseListExclude");
            this.setState({ hidedElements: this.state.hidedElements });

            if (!resp.ok) {
                alert("Не удалось добавить " + resp.statusText);
                return;
            }
            alert("Добавлено слово для рейтинга ");


        }
        this.props.onChangeRatingInputVal(null);

        this.setState({ modalFn_ChooseListExclude: handleClickNameListBtn });

        this.state.hidedElements.delete("modalFn_ChooseListExclude");
        this.setState({ hidedElements: this.state.hidedElements });
    }

    async saveNewList() {

        for (let index = 0; index < this.state.listsExcep.length; index++) {
            const nameList = this.state.listsExcep[index];
            const url = `${this.props.ip}job/articles/excludeWords/saveList/${nameList}/`;

            const resp = await fetch(url, {
                method: "POST",
                body: JSON.stringify({
                    list: this.state.excep_words.filter(x => x["listName"] == nameList)
                })
            });

            if (!resp.ok) {
                alert("Не удалось поменять в бд. " + resp.statusText);
                return;
            }
        }

        alert("Cписоки сохранены");
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

        const listsNamesReq = await fetch(`${this.props.ip}job/articles/excludeWords/lists/getAll`);
        let listsNames = await listsNamesReq.json();
        this.setState({ listsExcep: listsNames });

        let lists = [];
        for (let index = 0; index < listsNames.length; index++) {
            const nameFile = listsNames[index];
            const url = `${this.props.ip}job/articles/getExcludeWords/${nameFile}/`;
            const resp = await fetch(url);
            if (!resp.ok) {
                alert("Не удалось зашрузить ExcepWords " + resp.statusText);
                return;
            }
            let listInput = await resp.json();
            listInput = listInput.map(x => { x["listName"] = nameFile; return x; });
            lists = [...lists, ...listInput];
        }

        this.setState({ positions: lists.map((x, i) => i) });
        this.setState({ excep_words: lists });

        this.wordsLoaded_resolve[0].resolve();

    }

    onChangePosition(e, i) {
        this.state.positions[i] = e.target.value;
        this.setState({ positions: this.state.positions });
    }

    insertArrayOnIndex(indexEl, indexNew, event) {
        let el = this.state.excep_words[indexEl];


        this.state.excep_words.splice(indexEl, 1);
        this.state.excep_words.splice(indexNew, 0, el);

        for (let index = 0; index < this.state.positions.length; index++) {
            this.state.positions[index] = index;
        }
        this.setState({ excep_words: this.state.excep_words })
        this.setState({ positions: this.state.positions })
    }


    render() {

        return (
            <div>

                <div className='modal_windows' >
                    <div className='choose_list_exclude modal_window' style={{
                        visibility: this.state.hidedElements.has('modalFn_ChooseListExclude')
                            ? 'hidden' : 'initial'
                    }}>
                        {this.state.listsExcep.map((x, i) => {
                            return <button onClick={() => { this.state.modalFn_ChooseListExclude(x); }}>{x}</button>
                        })}
                    </div>
                </div>

                <div className='wordslist_exclude' style={{ visibility: (this.props.showWordsList) ? 'hidden' : 'initial' }}>
                    {this.state.excep_words.map((x, i) => {
                        const objByOrder = x;

                        return <div className={`wordslist_exclude_entry ${objByOrder['listName'].replaceAll(/\d+_/g, "")}`}>
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
                            <div className='listRatingName'> {objByOrder['listName']} </div>
                            {this.state.listsExcep.map((x, i) => {
                                if (x != objByOrder['listName']) return <button onClick={() => {

                                    const atBase = this.state.excep_words.filter(x => x.matchVal == objByOrder["matchVal"])[0];
                                    atBase['listName'] = this.state.listsExcep[i];
                                    this.setState({ excep_words: this.state.excep_words });
                                }}>{i}</button>;
                            })}

                        </div>



                    })}
                    <button onClick={this.saveNewList}>Сохранить списки</button>
                </div>

            </div>
        )
    }


}