import { editor, editorDiv } from './modules/cmEditor.bundle.js';
import { fragmen, canvasDiv } from './shaderCanvas/index.js';

const container = document.createElement('div');
container.id = 'mainWrap';

document.body.appendChild(container);
container.appendChild(canvasDiv);
container.appendChild(editorDiv);

//fragmen.rect()
fragmen.reset();
