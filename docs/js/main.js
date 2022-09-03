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

let startSource;

const fsPath = './shaders/fs/fsMain.js';
startSource = await fetchShader(fsPath);

const container = document.createElement('main');
container.id = 'mainContainer';

container.appendChild(canvasDiv);
container.appendChild(editorDiv);
document.body.appendChild(container);

const fragmen = new Fragmen(option);

fragmen.mode = currentMode;
// fragmen.render(currentSource);
fragmen.render(startSource);
