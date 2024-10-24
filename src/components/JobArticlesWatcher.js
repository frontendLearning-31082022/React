import React, { Component } from 'react'

import "../css/JobArticlesWatcher.scss"
import WordsRating from './WordsRating';

const MARKED = 'marked';

export default class JobArticlesWatcher extends Component {



    constructor(props) {
        super(props);
        this.loadArticlesPart = this.loadArticlesPart.bind(this);
        this.moveToGroup = this.moveToGroup.bind(this);
        this.setAllWatched = this.setAllWatched.bind(this);
        this.bindKeys = this.bindKeys.bind(this);
        this.router = this.router.bind(this);

        this.ip = process.env.REACT_APP_API_SERVER_IP;
        this.detectRatingWord = null;

        this.router();

        this.state = {
            articles: [], sizePerPage: 20,
            titles: ["URL", "name", "company", "date", "price", "opit", "info", "dateAddToDB", "rating", "ReqName"],
            hidedElements: { marked: true, WordsRating: true },
            ratingInputVal: null,
            recognizeWordOfRating: null
            currentPageReq:''
        };

    }

    componentDidMount() {
        this.loadArticlesPart();
        document.title = process.env.REACT_APP_API_TITLE_PAGE;
        this.bindKeys();


    }



    async moveToGroup(id, from, to) {
        let obj = this.state[from].filter(x => x.URL == id);
        if (obj.length == 0) {
            alert("Ошибка не найден элемент при переносе");
            return;
        }
        obj = obj[0];

        let group = to == null ? null : 'group_' + to;

        obj['status'] = group;

        const ip = this.ip;
        const url = `${ip}job/articles/modify/`;
        const resp = await fetch(url, {
            method: "POST",
            body: JSON.stringify({
                id: id,
                field: "status",
                val: group
            })

        });
        // headers: {
        //     "Content-type": "application/json; charset=UTF-8"
        // }
        if (!resp.ok) {
            alert("Не удалось поменять в бд. " + resp.statusText);
            return;
        }

        this.setState({ articles: this.state.articles });
    }

    router() {

        const router = document.location.href;

        let currentPageReq='Главная';
        currentPageReq=router.indexOf("today_appeal_atDB") > -1?'Сегодня появились в БД':currentPageReq;
        currentPageReq=router.indexOf("today_dateFindedAgain") > -1?'Сегодня были вновь найдены':currentPageReq;
        this.setState({currentPageReq:currentPageReq});

        const ipPass = this.ip;
        this.urlGetPart = (page, sizePer) => { return `${ipPass}job/articles/get/${page}/${sizePer}/` };
        if (router.indexOf("today_appeal_atDB") > -1) this.urlGetPart = (page, sizePer) => { return `${ipPass}job/articles/get/${page}/${sizePer}/?today_appeal_atDB` };
        if (router.indexOf("today_dateFindedAgain") > -1) this.urlGetPart = (page, sizePer) => { return `${ipPass}job/articles/get/${page}/${sizePer}/?today_dateFindedAgain` };

        let req = null;
        if (req == null) {
            req = router.indexOf("today_appeal_atDB") > -1 ? "today_appeal_atDB" : req;
            req = router.indexOf("today_dateFindedAgain") > -1 ? "today_dateFindedAgain" : req;
        }
        req = req == null ? "all_not_readed" : req;

        this.url_countArticlesNotReadedYet = `${ipPass}job/articles/getNotYetReadedCount/?${req != null ? req : ''}`;


        const b = 0;
    }

    async setAllWatched() {
        const not_watched = this.state.articles.filter(x => x.status == null);

        for (let index = 0; index < not_watched.length; index++) {
            const element = not_watched[index];

            const ip = this.ip;
            const url = `${ip}job/articles/modify/`;
            const resp = await fetch(url, {
                method: "POST",
                body: JSON.stringify({
                    id: element.URL,
                    field: "watched",
                    val: true
                })

            });
            if (!resp.ok) {
                alert("Не удалось пометить как прочитанное " + resp.statusText);
                return;
            }

            this.state.articles = this.state.articles.filter(x => x.url != element.url);
            this.setState({ articles: this.state.articles });
            window.scrollTo(0, 0);
        }
    }

    async loadArticlesPart() {
        const ip = this.ip;
        const url = this.urlGetPart(0, this.state.sizePerPage);
        const resp = await fetch(url);
        let text = await resp.json();

        const already = new Set(this.state.articles.map(x => x.url));

        text = [...text].filter(x => !already.has(x.url));

        this.state.articles.push(...text);
        this.setState({ articles: this.state.articles })

    }



    bindKeys() {
        const rectCntxt=this;

        window.onkeyup = function (e) {
            if (e.code === 'F8') {
                rectCntxt.setAllWatched();
            }
            if (e.code === 'F9') {
                rectCntxt.loadArticlesPart();
            }

        }
    }

    render() {

        const fmHTML = (html,colName) => {

            if(html==null || colName==null)return html;

            if(colName=='name'){
                const ratingWord = this.detectRatingWord(html);
                if (ratingWord == undefined) return html;
    
                const wordMark = html.toLocaleLowerCase().match(new RegExp(ratingWord.matchVal.toLocaleLowerCase()))[0];
    
                const searchMask = ratingWord.matchVal;
                const regEx = new RegExp(searchMask, "ig");
                const replaceMask ="<span class='rating_word'>"+ wordMark+"</span>";
                
                const result = html.replace(regEx, replaceMask);
                return <span dangerouslySetInnerHTML={{__html: result}}></span>;
            }else if(colName=='date'){
                if(new Date().getTime()- new Date(html).getTime()>(6*60*60*1000))return html;
                return <span className='actual_date'>{html}</span>
            }

            return html;
        }

        const renderArticle = (objArt, i) => {
            return <tr rating={objArt["rating"]}> {
                this.state.titles.map(x => {
                    if (x == 'URL') return <td className={'field_' + x}> <a href={objArt["URL"]} target='_blank'>url</a>
                        <button onClick={() => { this.moveToGroup(objArt["URL"], "articles", objArt.status == 'group_' + MARKED ? null : MARKED) }} className='mark_button'>★</button> </td>

                    if (x == 'name') {
                        return <td className={'field_' + x} > {fmHTML(objArt[x], 'name')}
                            <button onClick={() => { this.setState({ ratingInputVal: objArt[x] }) }}>₦</button>
                            {/* <button onClick={() => { this.setState({ recognizeWordOfRating: fmHTML(objArt[x]) }) }} title="Как опредилился рейтинг">🥉</button> */}
                        </td>
                    }
                    if (x == 'opit') {
                        return <td className={'field_' + x} opit={fmHTML(objArt[x])} > {fmHTML(objArt[x])}</td>;
                    }

                    if (x == 'dateAddToDB') {
                        return <td className={'field_' + x} opit={objArt[x]} > {fmHTML(objArt[x], 'date')}</td>;
                    }


                    return <td className={'field_' + x} > {fmHTML(objArt[x])}</td>
                })
            } </tr>;
        }

        const upState = (val, ...path) => {


            let obj = this.state;
            path.forEach(x => obj = obj[x]);
            obj = val;
            // this.setState({[path[0]]:this.state[path[0]})

            obj = val;
            this.setState()
            // this.state.hidedElements.WordsRating = !this.state.hidedElements.WordsRating;
            // this.setState(this.setState({ hidedElements: this.state.hidedElements }))
        }


        return (
            <div>

                <div className='not_readed articles'>
                    <table>
                        <tr>{this.state.titles.map(y => <th>{y}</th>)}</tr>
                        {this.state.articles.filter(x => x.status == null).map((x, i) => renderArticle(x, i))}
                    </table>
                </div>

                <div className='other_lists'>
                    <button onClick={() => {
                        this.state.hidedElements['marked'] = !this.state.hidedElements['marked'];
                        this.setState({ hidedElements: this.state.hidedElements })
                    }}>Помеченны articles</button>
                    <div className='marked articles'
                        style={{ display: (this.state.hidedElements['marked']) ? 'none' : 'initial' }}>
                        <table>
                            <tr>{this.state.titles.map(y => <th>{y}</th>)}</tr>
                            {this.state.articles.filter(x => x.status == `group_${MARKED}`).map((x, i) => renderArticle(x, i))}
                        </table>
                    </div>
                    <button onClick={() => {

                    }}>Вновь обновленные просмотренные</button>

                    <button onClick={() => {
                        // upState(!this.state.hidedElements.WordsRating,"hidedElements","WordsRating");
                        this.state.hidedElements.WordsRating = !this.state.hidedElements.WordsRating;
                        this.setState({ hidedElements: this.state.hidedElements });
                    }}>WordsRating</button>
                </div>

                <div className='control_buttons'>
                    <button onClick={this.loadArticlesPart} className='buttons_control' title='Загрузить еще статей'>🔄</button>
                    <button onClick={this.setAllWatched} className='buttons_control' title='Пометить все как прочитанные'>✅</button>

                </div>

                <WordsRating ratingInputVal={this.state.ratingInputVal} onChangeRatingInputVal={(e) => { this.setState({ ratingInputVal: e }) }} ip={this.ip} showWordsList={this.state.hidedElements['WordsRating']} recognizeWordOfRating={this.state.recognizeWordOfRating}
                    onChangeRecognizeWordOfRating={(val) => { this.setState({ recognizeWordOfRating: val }) }}
                    recognizeWordOfRating_getFunc={(fn) => { this.detectRatingWord = fn; }}
                ></WordsRating>
            </div >
        )
    }
}
