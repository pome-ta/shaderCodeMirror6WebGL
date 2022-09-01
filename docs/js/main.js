import { editor, editorDiv } from './modules/cmEditor.bundle.js';
import { fragmen, canvasDiv } from './shaderCanvas/index.js';

const container = document.createElement('div');
container.id = 'mainWrap';
container.style.width = '100%';
container.style.height = '100%';
//editorDiv.style.height = '100%';

canvasDiv.style.height = '100%';

document.body.appendChild(container);
container.appendChild(editorDiv);
container.appendChild(canvasDiv);

//editorDiv.style.height = '100%';
//canvasDiv.style.height = '100%';
