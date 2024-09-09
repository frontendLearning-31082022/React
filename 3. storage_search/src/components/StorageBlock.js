import React, { Component } from 'react'
import "../css/storageblock.scss"
import InputObject from '../forms/InputObject';

import DragByMouse from '../js_modules/drag_by_mouse';
import ContextMenu from './ContextMenu';
import PanelQuick from './PanelQuick';

export default class StorageBlock extends Component {
  constructor(props) {
    super(props);

    this.state = {
      add_show: false, add_show_type: null, sumbit_add: () => { }, current_cell: "",
      boxes: [], layer_current: -1, findItem_word: ""
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
    this.switchShowedLayer = this.switchShowedLayer.bind(this);
    this.findItem = this.findItem.bind(this);

    this.ip = process.env.REACT_APP_IP_SERVER;
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
            const updFN = (el,val) => {
              el.x = val.x;
              el.y = val.y;
              const cur = ctx.state.boxes;
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
        if (res.ok) {
          alert("Добавлено");
          document.location.reload();
        }
      }).catch(x => {
        alert('Не добавилось ' + x.text);
      });
    };
    this.setState({ sumbit_add: addFn });
  }
  async modifyObjs(objs) {
    const clearLocalFields=(obj)=>{
      delete obj['finded'];
    }
    objs.forEach(clearLocalFields);

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

  findItem() {
    const key = 'finded';
    this.state.boxes.forEach(x => delete x[key]);

    const word = this.state.findItem_word.toLowerCase();
    if (word != '') {
      const finded = this.state.boxes.filter(x => x.name.toLowerCase().indexOf(word) > -1);
      finded.forEach(x => x[key] = '');
    }
    this.forceUpdate();
  }

  z_index(up, id) {
    let index = this.state.boxes.findIndex(x => x.id == id);
    const el = this.state.boxes[index];
    el.z = up ? el.z + 1 : el.z - 1;
    this.state.boxes[index] = el;
    this.setState({ boxes: this.state.boxes });
    this.setState({ boxes: this.state.boxes },
      () => { this.forceUpdate(); });
  }


  switchShowedLayer(up) {
    let newLayer = this.state.layer_current + (up ? 1 : -1);
    newLayer = newLayer < -1 ? -1 : newLayer;
    this.setState({ layer_current: newLayer });
  }

  // w={t.w} h={t.h} d={t.d} x={t.x} y={t.y} z={t.z}
  // <div key={i}>{t.name}</div>
  render() {

    const objs_rend = (cellName) => {
      return this.state.boxes.filter(x => x['cell_name'] == cellName).map((t, i) => {
        return <div className={'obj_store ' + (t.isItem ? 'item' : 'box')} z
          {...t}
          style={{ left: t.x + "px", top: t.y + "px", zIndex: t.z }}>{t.name} </div>
      });
    }

    let hideLayers = `
        div[z]{
          visibility: ${this.state.layer_current == -1 ? 'visible' : 'hidden'};
        } 
        div[z="${this.state.layer_current}"]{
          visibility: visible;
        }
    `;

    const cnxMenuRender_box = (data) => {
      const cellName = data.clickedEl?.getAttribute('cellName');
      const id = data.clickedEl?.getAttribute('id');
      const z = data.clickedEl?.getAttribute('z');

      const rend = <div className='contextmenu_btns'>

        <button onClick={() => { this.z_index(true, id) }}>z-up ({z})</button>
        {z == 0 ? '' :
          <button onClick={() => { this.z_index(false, id) }}>z-down ({z})</button>
        }
        {/* <button onClick={this.addItem}>Добавить предмет в cell {cellName}</button> */}
      </div>;
      return rend;
    };

    const cnxMenuRender_cell = (data) => {
      const cellName = data.clickedEl?.getAttribute('cellname');

      const rend = <div className='contextmenu_btns'>
        <button onClick={() => { this.switchWindow("addBox"); }}>Добавить box в {cellName}</button>
        <button onClick={this.saveXYZboxes}>Сохранить XYZ в {cellName}</button>
        <button onClick={this.addItem}>Добавить предмет в cell {cellName}</button>
      </div>;
      return rend;
    };


    const cnxMenuRender = (data) => {
      const cellName = data.clickedEl?.className;
      const isCell = data.clickedEl?.className?.indexOf('cell') > -1;
      const isBox = data.clickedEl?.className?.indexOf('box') > -1;
      const isItem = data.clickedEl?.className?.indexOf('item') > -1;

      if (isCell) return cnxMenuRender_cell(data);
      if (isBox) return cnxMenuRender_box(data);
      if (isItem) return cnxMenuRender_box(data);
      if (!cellName) return "";
    };

    return (
      <div>
        <style>{hideLayers}</style>

        <ContextMenu render={data => cnxMenuRender(data)}></ContextMenu>
        <PanelQuick render={() =>
          <>
            <button className='layer_up' onClick={() => { this.switchShowedLayer(true) }}>↑</button>
            <div className='layer_current'>{this.state.layer_current == -1 ? 'все слои' : this.state.layer_current}</div>
            <button className='layer_down' onClick={() => { this.switchShowedLayer(false) }}>↓</button>
          </>
        }>
        </PanelQuick>

        <div className='modal'>
        <header>
          <div className='finder_header'>
            <input type="text" value={this.state.findItem_word} onKeyDown={(e) => { if (e.keyCode == 13) this.findItem() }}
              onChange={(e) => { this.setState({ findItem_word: e.target.value }); }}></input>
            <button className='find button-74' onClick={this.findItem} >Найти</button>
          </div>
          <div className='header_info'>
          </div>
        </header>

          <InputObject show={this.state.add_show} onClose={this.switchWindow} submit={this.state.sumbit_add}
            current_cell={this.state.current_cell} type={this.state.add_show_type} ></InputObject>
        </div>

        <main>
          <div className='cells_data'>

            {/* <div className='' style={{ width: '800px', height: '800px', background: 'black' }}></div> */}

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
