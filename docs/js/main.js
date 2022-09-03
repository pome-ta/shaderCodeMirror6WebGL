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

const editorsWrap = document.createElement('div');
editorsWrap.id = 'wrap';
editorsWrap.style.position = 'relative';
// editorsWrap.style.zIndex = 1;
editorsWrap.style.display = 'grid';
editorsWrap.style.gridTemplateRows = '1fr auto';
editorsWrap.style.height = '100%';
editorDiv.style.overflow = 'auto';

const statusLogDiv = document.createElement('div');
// statusLogDiv.style.position = 'sticky';
// statusLogDiv.style.bottom = 0;
statusLogDiv.textContent = ' ● ready';
statusLogDiv.style.height = '2rem';
statusLogDiv.style.backgroundColor = 'red';

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
