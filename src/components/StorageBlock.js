import React, { Component } from 'react'
import "../css/storageblock.scss"
import InputObject from '../forms/InputObject';

import DragByMouse from '../js_modules/drag_by_mouse';
import ContextMenu from './ContextMenu';

export default class StorageBlock extends Component {
  constructor(props) {
    super(props);

    this.state = {
      add_show: false, add_show_type: null, sumbit_add: () => { }, current_cell: "",
      boxes: []
    };

    this.scale = 5;
    this.scaleFN = (el) => {
      const width = el.getAttribute('w') * this.scale;
      const height = el.getAttribute('h') * this.scale;
      el.style.width = width + "px";
      el.style.height = height + "px";
    }

    this.addFN = this.addFN.bind(this);
    this.addItem = this.addItem.bind(this);
    this.switchWindow = this.switchWindow.bind(this);
    this.getAll = this.getAll.bind(this);
    this.saveXYZboxes = this.saveXYZboxes.bind(this);
    this.modifyObjs = this.modifyObjs.bind(this);
    this.z_index = this.z_index.bind(this);

    // this.ip = 'http://192.168.1.45:8080/'
    this.ip = 'http://192.168.1.2:8080/'
    this.ip = 'http://192.168.1.45:8080/'
    // this.ip = 'http://192.168.1.2:8080/'
  }

  switchWindow(type) {
    type = type ? type : null;
    this.setState((state, props) => ({
      add_show_type: type, add_show: !state.add_show
    }));
  }

  onLoadBoxes(x) {
    this.getAll().then(x => {
      this.setState({ boxes: x },
        () => {
          [...document.getElementsByClassName('obj_store')].forEach((el, i) => {
            this.scaleFN(el);
            // debugger;
            // el.style.top = (el.offsetTop + y) + "px";
            // el.style.left = (el.offsetLeft + x) + "px";
            // this.upFN({ y: (el.offsetTop + y), x: (el.offsetLeft + x) });

            const ctx = this;
            const updFN = (val) => {
              const cur = ctx.state.boxes;
              cur[i].x = val.x;
              cur[i].y = val.y;
              ctx.setState({ boxes: cur });
            };

            new DragByMouse(el, updFN);
          });
        });
    })
  }

  async getAll() {
    const url = this.ip + 'storage_block/boxes/getall';
    const resp = await fetch(url);
    const json = await resp.json();
    return json;
  }

  addFN() {
    const addFn = (fields) => {

      // String json=[...fields]
      const url = this.ip + 'storage_block/boxes/add_item';


      fetch(url, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fields)
      }).then(res => {
        if (res.ok) alert("Добавлено");
      }).catch(x => {
        alert('Не добавилось ' + x.text);
      });
    };
    this.setState({ sumbit_add: addFn });
  }
  async modifyObjs(objs) {
    const postModify = async (obj) => {
      const url = this.ip + 'storage_block/boxes/modifyItem';

      const resp = await fetch(url, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(obj)
      });
      return resp.ok;
    };

    for (let index = 0; index < objs.length; index++) {
      const ok = await postModify(objs[index]);
      if (!ok) return false;
    }
    return true;
  }

  saveXYZboxes() {
    this.getAll().then(x => {

      let modified = this.state.boxes;
      modified = modified.filter((y, i) => JSON.stringify(x[0]) !== JSON.stringify(y));

      this.modifyObjs(modified).then(res => {
        if (!res) alert("Ошибка сохранения координат");
        if (res) alert("Координаты сохранены");
      });
    });
  }

  addItem() {
    this.switchWindow("addItem");
  }

  componentDidMount() {
    this.addFN();

    [...document.getElementsByClassName('cell')].forEach(el => {
      this.scaleFN(el);

      const rCntxt = this;
      el.addEventListener('click',
        () => {
          rCntxt.setState({ current_cell: el.getAttribute("cellName") });
        }, false);

    });

    this.onLoadBoxes();

  }

  z_index(up, id) {
    let index = this.state.boxes.findIndex(x => x.id == id);
    const el = this.state.boxes[index];
    el.z = up ? el.z + 1 : el.z - 1;
    this.state.boxes[index] = el;
    this.setState({ boxes: this.state.boxes });

  }

  // w={t.w} h={t.h} d={t.d} x={t.x} y={t.y} z={t.z}
  // <div key={i}>{t.name}</div>
  render() {

    const objs_rend = (cellName) => {
      return this.state.boxes.filter(x => x['cell_name'] == cellName).map((t, i) => {
        return <div className={'obj_store'+(t.isItem?' item':'')}
                 {...t} 
         style={{ left: t.x + "px", top: t.y + "px" }}>{t.name}</div>
      });
    }

    const cnxMenuRender = (data) => {
      const cellName = data.clickedEl?.getAttribute('cellName');
      if (!cellName) return "";

      const rend = <div className='contextmenu_btns'>
        <button onClick={() => { this.switchWindow("addBox"); }}>Добавить box в {cellName}</button>
        <button onClick={this.saveXYZboxes}>Сохранить XYZ в {cellName}</button>
        <button onClick={this.addItem}>Добавить предмет в cell {cellName}</button>
      </div>;
      return rend;
    };

    return (
      <div>

        <ContextMenu render={data => cnxMenuRender(data)}></ContextMenu>

        <header>
          <div className='finder_header'>
            <input type="text"></input>
            <button className='find button-74'>Найти</button>
          </div>
          <div className='header_info'>
          </div>

          <InputObject show={this.state.add_show} onClose={this.switchWindow} submit={this.state.sumbit_add}
            current_cell={this.state.current_cell} type={this.state.add_show_type} ></InputObject>
        </header>

        <main>
          <div className='cells_data'>

            <div className='wardrobe_tv'>
              <div className='top' style={{ display: 'flex' }}>
                <div className='cell' w="86" h="50" d="56" cellName="top2cells">{objs_rend("top2cells")}</div>
                <div className='cell' w="41.5" h="50" d="56" cellName="top1cell">{objs_rend("top1cell")}</div>
              </div>
              <div className='middle' style={{ display: 'flex' }}>
                <div className='middle-left'>
                  <div className='cell empty_space' w="84.5" h="26" d="56"></div>
                  <div className='cell empty_space' w="84.5" h="29" d="56"></div>
                  <div className='cell empty_space' w="84.5" h="83" d="56"></div>
                </div>
                <div className='middle-right' style={{ display: 'flex', flexDirection: 'column', 'align-items': "center" }}>
                  <div className='cell empty_space' w="41.5" h="26" d="56"></div>
                  <div className='cell' w="38" h="18.5" d="39" cellName="drawer 1">{objs_rend("drawer 1")}</div>
                  <div className='cell' w="38" h="18.5" d="39" cellName="drawer 2">{objs_rend("drawer 2")}</div>
                  <div className='cell' w="38" h="18.5" d="39" cellName="drawer 3">{objs_rend("drawer 3")}</div>
                  <div className='cell' w="38" h="18.5" d="39" cellName="drawer 4">{objs_rend("drawer 4")}</div>
                  <div className='cell empty_space' w="41.5" h="34.5" d="56"></div>
                </div>
              </div>
              <div className='row bottom'>
                <div className='cell' w="86" h="45" d="56" cellName="bottom2cells">{objs_rend("bottom2cells")}</div>
                <div className='cell' w="41.5" h="45" d="56" cellName="bottom1cell">{objs_rend("bottom1cell")}</div>
              </div>

            </div>

          </div>

        </main>
      </div>
    )
  }
}
