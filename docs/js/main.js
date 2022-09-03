import { editor, editorDiv } from './modules/cmEditor.bundle.js';
import {
  Fragmen,
  canvasDiv,
  option,
  currentMode,
  currentSource,
} from './shaderCanvas/index.js';

async function fetchShader(path) {
  const res = await fetch(path);
  const shaderText = await res.text();
  return shaderText;
}

/* -- loadSource */
let loadSource;
const fsPath = './shaders/fs/fsMain.js';
loadSource = await fetchShader(fsPath);

/* -- set layout */
const editorsWrap = document.createElement('div');
editorsWrap.id = 'wrap';
editorsWrap.style.position = 'relative';
// editorsWrap.style.zIndex = 1;
editorsWrap.style.display = 'grid';
editorsWrap.style.gridTemplateRows = '1fr auto';
editorsWrap.style.height = '100%';
editorDiv.style.overflow = 'auto';

const statusLogDiv = document.createElement('div');
statusLogDiv.style.position = 'sticky';
statusLogDiv.style.bottom = 0;
statusLogDiv.textContent = ' ● ready';
statusLogDiv.style.height = '2rem';
statusLogDiv.style.fontFamily = 'monospace';
statusLogDiv.style.backgroundColor = '#111';
statusLogDiv.style.color= '#1DA1F2'

/*
lineout {
    background-color: #111;
    border-top: 1px solid black;
    border-bottom: 1px solid black;
    color: #1DA1F2;
    font-size: 14px;
    line-height: 30px;
    padding: 0px 10px;
    width: calc(100% - 1px);
    display: flex;
    min-height: 32px;
    max-height: 32px;
    overflow: hidden;
}
.lineout.warn {
    color: orangered;
}
.lineout.error {
    color: #FF517B;
}
*/


editorsWrap.appendChild(editorDiv);
editorsWrap.appendChild(statusLogDiv);

/* -- main */
const container = document.createElement('main');
container.id = 'mainContainer';
container.style.height = '100%';

container.appendChild(canvasDiv);
container.appendChild(editorsWrap);
document.body.appendChild(container);

const fragmen = new Fragmen(option);
fragmen.onBuild((status, msg) => {
  statusLogDiv.textContent = msg;
});
fragmen.mode = currentMode;
fragmen.render(loadSource);
