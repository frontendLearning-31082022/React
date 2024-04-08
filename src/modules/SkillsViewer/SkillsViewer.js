import React, { Component } from 'react'
import './excel.css';
import './SkillsViewer.scss';

import WordsCloud from '../../canvas/words_cloud/WordsCloud';

const sortType = {
    relevance: 'relevance'
}
const maxWords = 20;

export default class SkillsViewer extends Component {
    constructor(props) {
        super(props);
        this.state = { titles: [], tasks: [] }
        this.skills = [];

        this.loadData = this.loadData.bind(this);
        this.sortTasks = this.sortTasks.bind(this);
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
                    if(task['Ссылка git']!='')tasks.push(task);
                });
                const promisedSetState = (newState) => new Promise(resolve => this.setState(newState, resolve));
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

    }

    sortTasks(type) {
        const types = [];
        types['relevance'] = (a, b) => b.relevant - a.relevant;

        const sorted = this.state.tasks.sort(types[type])
        this.setState({ tasks: sorted });
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
                        {this.state.tasks.map((t, i) => <>
                            <div className='task' key={i + 'task'}>
                                <div className='container_subject_logo'>
                                    <img src={`./subjs_imgs/${t['logo']}.png`} className='task_subject_logo'></img>
                                </div>
                                <span className='subject' key={i + 'sub'}>{t['Название предмета']}</span>
                                <a className='subject_solve' key={i + 'sub_solve'} href={t['Ссылка git']}>Реализация</a>
                                <div className="task_descp" dangerouslySetInnerHTML={{ __html: t['Условие задачи'] }} key={i + 'task_descp'} ></div>
                            </div>
                            <br /><br /></>)}
                    </section>

                    <section className='control'>
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