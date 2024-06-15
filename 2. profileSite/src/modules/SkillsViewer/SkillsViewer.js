import React, { Component } from 'react'
import './excel.css';
import './SkillsViewer.scss';

import WordsCloud from '../../canvas/words_cloud/WordsCloud';
import WordCarousel from '../../canvas/word_carousel/WordCarousel';
import WindowsModal from '../WindowModal/WindowsModal';

const sortType = {
    relevance: 'relevance'
}
const maxWords = 20;

export default class SkillsViewer extends Component {
    constructor(props) {
        super(props);
        this.state = { titles: [], tasks: [], filterWords: new Set(), blink_once: true }

        this.tasks_all = [];
        this.skills = [];
        this.tags = [];

        this.loadData = this.loadData.bind(this);
        this.sortTasks = this.sortTasks.bind(this);
        this.filterTasks = this.filterTasks.bind(this);
        this.queryRouterOneUrl = this.queryRouterOneUrl.bind(this);
    }

    async loadData() {
        const rCntxt = this;
        const loadTasks = (html) => {
            const parser = new DOMParser();
            const domData = parser.parseFromString(html, "text/html");

            let rows = [...domData.getElementsByTagName('tr')];
            const format_text = (t) => { return t.replaceAll('\n', ' ').replaceAll(/\s\s+/g, ' '); }
            const titles = [...rows[0].children].map(x => format_text(x.textContent));
            rCntxt.setState({ titles: titles });

            rows.splice(0, 1);

            const tasks = [];
            [...rows].forEach(x => {
                const task = {};
                titles.forEach((title, i) => {
                    if (!title) return;
                    task[title] = x.children[i]?.textContent;
                    if (title === 'Условие задачи') task[title] = x.children[i].outerHTML;
                });
                if (task['Ссылка git'] != '') tasks.push(task);
            });
            const promisedSetState = (newState) => new Promise(resolve => this.setState(newState, resolve));
            this.tasks_all = [...tasks];
            return promisedSetState({ tasks: tasks });
        }

        await fetch(window.location.origin + '/data.html')
            .then((response) => {
                return response.text();
            })
            .then(async function (x) {
                await loadTasks(x);
            })
            .catch(function (err) {
                console.log('Failed to fetch page: ', err);
            });

        const splitParts = (array, n) => {
            let [...arr] = array;
            var res = [];
            while (arr.length) {
                res.push(arr.splice(0, n));
            }
            return res;
        }

        await fetch(window.location.origin + '/skills.txt')
            .then((response) => {
                return response.text();
            })
            .then(function (x) {
                const skillsAr = x.split("\n");
                let splitted = splitParts(skillsAr, maxWords);
                rCntxt.skills = splitted;
                rCntxt.forceUpdate();
            })
            .catch(function (err) {
                console.log('Failed to fetch page: ', err);
            });

        let tags = new Set();
        this.tasks_all.forEach(x => {
            x.hashtag.split(',').forEach(x => tags.add(x.trim()));
        });
        tags = new Set([...tags, ...this.tasks_all.map(x => x['Название предмета'])]);
        tags.delete('');

        this.tags = [...tags].filter(x => x.length > 0);
    }

    sortTasks(type) {
        const types = [];
        types['relevance'] = (a, b) => b.relevant - a.relevant;

        const sorted = this.state.tasks.sort(types[type])
        this.setState({ tasks: sorted });
    }

    filterTasks(word, del = false) {
        this.state.filterWords.add(word);
        if (del) this.state.filterWords.delete(word);

        const resetFilter = () => {
            this.setState({ filterWords: new Set() });
            this.setState({ tasks: this.tasks_all });
            this.setState({ tasks: this.tasks_all }, () => {
                this.sortTasks('relevance');
            });
        }
        if (word === null) { resetFilter(); return; }
        if (this.state.filterWords.size === 0) { resetFilter(); return; }

        this.setState({ filterWords: this.state.filterWords });

        const filtered = this.tasks_all.filter(x => {
            const tagsOnTask = x.hashtag.split(',').map(p => p.trim());
            if ([...this.state.filterWords].includes(x['Название предмета'])) return true;
            const hasChoosedTags = tagsOnTask.some(r => [...this.state.filterWords].includes(r));
            return hasChoosedTags;
        });
        this.setState({ tasks: filtered });
    }

    componentDidMount() {
        const ctx = this;
        this.loadData().then(x => {
            this.sortTasks(sortType.relevance);
        });
        this.loadData()
            .then(x => {
                this.sortTasks(sortType.relevance);
            }).then(x => {
                this.queryRouterOneUrl();
            });

        setTimeout(() => { ctx.setState({ blink_once: false }); }, 10000);
    }

    queryRouterOneUrl() {
        const query = new URLSearchParams(window.location.search);
        if (query.size < 1) return;

        const tags = query.getAll('tag');
        tags.forEach(x => this.filterTasks(x));
    }

    render() {
        const filterClickWord = (e) => { this.filterTasks(e.target.textContent) };

        return (

            <>
                <div className='content'>
                    <section className='task_list'>
                        <div className='task_list_filter'>
                            {this.state.filterWords.size > 0 ? <button className='filter_disable' title='Сбросить фильтрацию'
                                onClick={() => { this.filterTasks(null) }}>X</button> : ''}
                            {this.state.filterWords.size > 0 ? 'Отфильтровано по: ' : ''}
                            {[...this.state.filterWords].map((t, i) =>
                                <span className='filter_choosed' onClick={() => { this.filterTasks(t, true) }} href="#">#{t}</span>)}
                        </div>

                        {this.state.tasks.map((t, i) => <>
                            <div className='task' key={i + 'task'}>
                                <div className='task_content'>
                                    <div className='container_subject_logo'>
                                        <img src={`./subjs_imgs/${t['logo']}.png`} className='task_subject_logo'></img>
                                    </div>
                                    <span className='subject' key={i + 'sub'} onClick={() => { this.filterTasks(t['Название предмета']) }} >{t['Название предмета']}</span>
                                    <div className="task_descp" dangerouslySetInnerHTML={{ __html: t['Условие задачи'] }} key={i + 'task_descp'} ></div>
                                    <div className='task_tags'> {t['hashtag'].split(',').map((h, hi) =>
                                        <span className='task_tag' onClick={filterClickWord} >#<span>{h.trim()}</span></span>
                                    )}</div>
                                </div>
                                <a className={'subject_solve' + (i === 1 && this.state.blink_once ?
                                    ' blink_once' : '')} key={i + 'sub_solve'} href={t['Ссылка git']}>Реализация</a>
                            </div>
                            <br /><br /></>)}
                    </section>

                    <section className='control'>
                        <div className='keywords_carousel'>
                            <div className='keywords_carousel_title_container'>
                                <div className='keywords_all' onClick={() => this.openModalWindow()}>все</div>
                                <div className='skills_cloud_title'>
                                    <img src='./parts_imgs/folder.png' className='folder_img'></img>
                                    keywords
                                </div>
                            </div>

                            <WindowsModal showFn={(fn) => this.openModalWindow = fn} className='window_modal_keywords'>
                                <div className='window_modal_title'>Список всех ключевых слов для фильтрации</div>
                                <div className='keywords_list'>
                                    {this.tags.map((t, i) =>
                                        <div className='keyword'
                                            onClick={filterClickWord}>{t}</div>)}
                                </div>
                            </WindowsModal>
                            <WordCarousel words={this.tags}
                                onClickElement={filterClickWord} />
                        </div>

                        <div className='skills_cloud'>
                            <div className='skills_cloud_title'>
                                <img src='./parts_imgs/folder.png' className='folder_img'></img>
                                skills</div>
                            {this.skills
                                .map((t, i) => <WordsCloud skills={t} />)}
                        </div>

                    </section>
                </div>
            </>
        )
    }
}