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


const statusLogDiv = document.createElement('div');


/* -- main */
const container = document.createElement('main');
container.id = 'mainContainer';

container.appendChild(canvasDiv);
container.appendChild(editorDiv);
document.body.appendChild(container);

const fragmen = new Fragmen(option);

fragmen.mode = currentMode;
// fragmen.render(currentSource);
fragmen.render(loadSource);
