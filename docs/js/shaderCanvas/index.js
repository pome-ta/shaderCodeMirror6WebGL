import { Fragmen } from './fragmen.js';

const canvasDiv = document.createElement('div');
canvasDiv.id = 'canvas-div';
canvasDiv.style.width = '100%';
canvasDiv.style.height = '100%';

canvasDiv.style.position = 'fixed';
canvasDiv.style.top = 0;
canvasDiv.style.left = 0;
canvasDiv.style.zIndex = 0;

let initMode = Fragmen.MODE_CLASSIC_300; // 現在の Fragmen モード
//let initMode = Fragmen.MODE_CLASSIC; // 現在の Fragmen モード
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
currentSource = fragmenDefaultSource[initMode];
// メインとなる fragmen のインスタンス
const option = Object.assign(FRAGMEN_OPTION, {
  target: canvasDiv,
  eventTarget: window,
});

export { Fragmen, canvasDiv, option, initMode };
