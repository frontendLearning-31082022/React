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
        this.state = { titles: [], tasks: [], filterWords: new Set() }

        this.tasks_all = [];
        this.skills = [];
        this.tags = [];

        this.loadData = this.loadData.bind(this);
        this.sortTasks = this.sortTasks.bind(this);
        this.filterTasks = this.filterTasks.bind(this);
    }

    async loadData() {
        const rCntxt = this;

        await fetch(window.location.origin + '/data.html')
            .then((response) => {
                return response.arrayBuffer();
            })
            .then(async (textHtml) => {
                let html = new TextDecoder('windows-1251').decode(textHtml);

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
                        task[title] = x.children[i].textContent;
                        if (title === 'Условие задачи') task[title] = x.children[i].outerHTML;
                    });
                    if (task['Ссылка git'] != '') tasks.push(task);
                });
                const promisedSetState = (newState) => new Promise(resolve => this.setState(newState, resolve));
                this.tasks_all = [...tasks];
                await promisedSetState({ tasks: tasks });
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
        const client = new XMLHttpRequest();
        client.open('GET', '/skills.txt');
        const classCntx = this;
        client.onreadystatechange = function () {
            if (client.responseText != '') {
                const skillsAr = client.responseText.split("\r\n");
                let splitted = splitParts(skillsAr, maxWords);
                classCntx.skills = splitted;
            }
        }
        client.send();

        let tags = new Set();
        this.state.tasks.forEach(x => {
            x.hashtag.split(',').forEach(x => tags.add(x.trim()));
        });
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
            const hasChoosedTags = tagsOnTask.some(r => [...this.state.filterWords].includes(r))
            return hasChoosedTags;
        });
        this.setState({ tasks: filtered });
    }

    componentDidMount() {
        this.loadData().then(x => {
            this.sortTasks(sortType.relevance);
        })
    }


    render() {
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
                                <div className='container_subject_logo'>
                                    <img src={`./subjs_imgs/${t['logo']}.png`} className='task_subject_logo'></img>
                                </div>
                                <span className='subject' key={i + 'sub'} onClick={() => { this.filterTasks(t['Название предмета']) }} >{t['Название предмета']}</span>
                                <a className='subject_solve' key={i + 'sub_solve'} href={t['Ссылка git']}>Реализация</a>
                                <div className="task_descp" dangerouslySetInnerHTML={{ __html: t['Условие задачи'] }} key={i + 'task_descp'} ></div>
                            </div>
                            <br /><br /></>)}
                    </section>

                    <section className='control'>
                        <div className='keywords_carousel'>
                            <div className='skills_cloud_title'>
                                <img src='./parts_imgs/folder.png' className='folder_img'></img>
                                keywords</div>
                                <div className='keywords_all' onClick={() => this.openModalWindow()}>все</div>
                            <WindowsModal showFn={(fn) => this.openModalWindow = fn} className='window_modal_keywords'>
                                <div className='window_modal_title'>Список всех ключевых слов для фильтрации</div>
                                <div className='keywords_list'>
                                    {this.tags.map((t, i) =>
                                        <div className='keyword'
                                            onClick={(e) => { this.filterTasks(e.target.textContent) }}>{t}</div>)}
                                </div>
                            </WindowsModal>
                            <WordCarousel words={this.tags}
                                onClickElement={(e) => { this.filterTasks(e.target.textContent) }} />
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