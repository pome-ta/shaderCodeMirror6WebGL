import { editor, editorDiv } from './modules/cmEditor.bundle.js';
import {
  Fragmen,
  canvasDiv,
  option,
  currentMode,
  currentSource,
} from './shaderCanvas/index.js';

const container = document.createElement('main');
container.id = 'mainContainer';


container.appendChild(canvasDiv);
container.appendChild(editorDiv);
document.body.appendChild(container);

const fragmen = new Fragmen(option);
fragmen.mode = currentMode;
fragmen.render(currentSource);
// fragmen.reset();
