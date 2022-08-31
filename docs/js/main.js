import { editor, editorDiv } from './modules/cmEditor.bundle.js';

const container = document.createElement('div');
container.id = 'mainWrap';
container.style.width = '100%';
container.style.height = '100%';
//editorDiv.style.height = '100%';
document.body.appendChild(container).appendChild(editorDiv);

//editorDiv.style.height = '100%';
