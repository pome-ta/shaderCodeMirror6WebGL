import { Fragmen } from './fragmen.js';

const canvasDiv = document.createElement('div');
canvasDiv.style.width = '100%';
canvasDiv.style.height = '100%';
canvasDiv.width = 8;
canvasDiv.height = 8;

canvasDiv.style.position = 'fixed';
canvasDiv.style.top = 0;
canvasDiv.style.left = 0;
canvasDiv.style.zIndex = 0;

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

canvasDiv.addEventListener('touchmove', (event) => {
  //event.preventDefault();
});

export { fragmen, canvasDiv };
