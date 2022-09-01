import { editor, editorDiv } from './modules/cmEditor.bundle.js';
import { Fragmen } from './fragmen.js';


const container = document.createElement('div');
container.id = 'mainWrap';
container.style.width = '100%';
container.style.height = '100%';
//editorDiv.style.height = '100%';


const canvasDiv = document.createElement('div');

let currentMode = Fragmen.MODE_CLASSIC; // 現在の Fragmen モード
let currentSource = ''; // 直近のソースコード

// fragmen.js 用のオプションの雛形
const FRAGMEN_OPTION = {
  target: null,
  eventTarget: null,
  //mouse: true,
  mouse: false,
  resize: true,
  escape: false,
};

const fragmenDefaultSource = Fragmen.DEFAULT_SOURCE;
currentMode = Fragmen.MODE_CLASSIC;
currentSource = fragmenDefaultSource[currentMode];
// メインとなる fragmen のインスタンス
const option = Object.assign(FRAGMEN_OPTION, {
  target: canvasDiv,
  eventTarget: window,
});
const fragmen = new Fragmen(option);
/*
fragmen.onBuild((status, msg) => {
  message.textContent = msg;
});
*/

fragmen.mode = currentMode;
fragmen.render(currentSource);
editor.textContent = currentSource;

canvasDiv.addEventListener('touchmove', (event) => {
  //event.preventDefault();
});




document.body.appendChild(container)
container.appendChild(editorDiv);
container.appendChild(canvasDiv);


//editorDiv.style.height = '100%';
