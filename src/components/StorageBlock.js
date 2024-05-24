import React, { Component } from 'react'
import "../css/storageblock.scss"
import InputObject from '../forms/InputObject';

import DragByMouse from '../js_modules/drag_by_mouse';

export default class StorageBlock extends Component {
  constructor(props) {
    super(props);

    this.state = {
      add_show: false, sumbit_add: () => { }, current_cell: "",
      storedObjs: []
    };

    this.scale = 5;
    this.scaleFN = (el) => {
      const width = el.getAttribute('w') * this.scale;
      const height = el.getAttribute('h') * this.scale;
      el.style.width = width + "px";
      el.style.height = height + "px";
    }

    this.addObject = this.addObject.bind(this);
    this.switchWindow = this.switchWindow.bind(this);
    this.getAll = this.getAll.bind(this);
    this.temp = this.temp.bind(this);
    this.saveXYZstoredObjs = this.saveXYZstoredObjs.bind(this);
    this.modifyObjs = this.modifyObjs.bind(this);

    this.ip = 'http://192.168.1.45:8080/'
  }

  switchWindow() {
    this.setState((state, props) => ({
      add_show: !state.add_show
    }));
  }

  onLoadStoredObjs(x) {
    this.getAll().then(x => {
      // this.setState({ storedObjs: x });
      this.setState({ storedObjs: x },
        () => {
          [...document.getElementsByClassName('obj_store')].forEach((el, i) => {
            this.scaleFN(el);
            // debugger;
            // el.style.top = (el.offsetTop + y) + "px";
            // el.style.left = (el.offsetLeft + x) + "px";
            // this.upFN({ y: (el.offsetTop + y), x: (el.offsetLeft + x) });

            const ctx = this;
            const updFN = (val) => {
              const cur = ctx.state.storedObjs;
              cur[i].x = val.x;
              cur[i].y = val.y;
              ctx.setState({ storedObjs: cur });
            };

            new DragByMouse(el, updFN);
          });
        });
    })
  }

  async getAll() {
    const url = this.ip + 'storage_block/getall';
    const resp = await fetch(url);
    const json = await resp.json();
    return json;
  }

  addObject() {
    const addFn = (fields) => {

      // String json=[...fields]
      const url = this.ip + 'storage_block/add_item';


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
    this.switchWindow();
  }
  async modifyObjs(objs) {
    const postModify = async (obj) => {
      const url = this.ip + 'storage_block/modifyItem';

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

  }

  saveXYZstoredObjs() {
    this.getAll().then(x => {

      let modified = this.state.storedObjs;
      modified = modified.filter((y, i) => JSON.stringify(x[0]) !== JSON.stringify(y));

      this.modifyObjs(modified).then(res => {
        if (!res) alert("Ошибка сохранения координат");
        if (res) alert("Координаты сохранены");
      });
    });
  }


  componentDidMount() {
    [...document.getElementsByClassName('cell')].forEach(el => {
      this.scaleFN(el);

      const rCntxt = this;
      el.addEventListener('click',
        () => {
          rCntxt.setState({ current_cell: el.getAttribute("cellName") });
        }, false);

    });

    this.onLoadStoredObjs();

  }


  temp() {
    //   // debugger;


    //   let div = 'bottom2cells';
    //   return this.state.storedObjs.filter(x => x['cell_name'] == div).map((t, i) => {
    //     return <div className='obj_store' {...t}>{t.name}</div>
    //   }
    //   );
  }

  // w={t.w} h={t.h} d={t.d} x={t.x} y={t.y} z={t.z}
  // <div key={i}>{t.name}</div>
  render() {

    const objs_rend = () => {
      let div = 'bottom2cells';
      return this.state.storedObjs.filter(x => x['cell_name'] == div).map((t, i) => {
        return <div className='obj_store' {...t}  style={{left:t.x+"px",top:t.y+"px"}}>{t.name}</div>
      }
      );
    }
    // const rendObjs = (ctxt) => {
    //     debugger;
    //  };

    return (
      <div>

        <InputObject show={this.state.add_show} onClose={this.switchWindow} submit={this.state.sumbit_add}
          current_cell={this.state.current_cell}></InputObject>


        <div className='finder_header'>
          <input type="text"></input>
          <button className='find'>Найти</button>
          <button className='add_box' onClick={this.addObject}>Добавить</button>
        </div>
        <div className='header_info'>
          <div className='current_cell'>Текущая ячейка - {this.state.current_cell}</div>
          <button onClick={this.saveXYZstoredObjs}>Сохранить XYZ</button>
        </div>

        <div className='cells_data'>

          <div className='wardrobe_tv'>

            <div className='top' style={{ display: 'flex' }}>
              <div className='cell' w="86" h="50" d="56" cellName="bottom2cells"></div>
              <div className='cell' w="41.5" h="50" d="56" cellName="bottom1cell"></div>
            </div>
            <div className='middle' style={{ display: 'flex' }}>
              <div className='middle-left'>
                <div className='cell empty_space' w="84.5" h="26" d="56"></div>
                <div className='cell empty_space' w="84.5" h="29" d="56"></div>
                <div className='cell empty_space' w="84.5" h="83" d="56"></div>
              </div>
              <div className='middle-right' style={{ display: 'flex', flexDirection: 'column', 'align-items': "center" }}>
                <div className='cell empty_space' w="41.5" h="26" d="56"></div>
                <div className='cell' w="38" h="18.5" d="39" cellName="drawer"></div>
                <div className='cell' w="38" h="18.5" d="39" cellName="drawer"></div>
                <div className='cell' w="38" h="18.5" d="39" cellName="drawer"></div>
                <div className='cell' w="38" h="18.5" d="39" cellName="drawer"></div>
                <div className='cell empty_space' w="41.5" h="34.5" d="56"></div>
              </div>
            </div>

            <div className='row'>
              <div className='cell' w="86" h="45" d="56" cellName="bottom2cells">

                {
                  objs_rend()
                }

              </div>
              <div className='cell' w="41.5" h="45" d="56" cellName="bottom1cell"></div>
            </div>


          </div>

        </div>


      </div>
    )
  }
}
