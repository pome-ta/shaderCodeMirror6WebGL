import { editor, editorDiv } from './modules/cmEditor.bundle.js';
import { fragmen, canvasDiv } from './shaderCanvas/index.js';

const container = document.createElement('div');
container.id = 'mainWrap';

document.body.appendChild(container);
container.appendChild(canvasDiv);
container.appendChild(editorDiv);

// xxx: reSize 時は取得できてる
// xxx: 立ち上がりのsize が0 のままとなってしまっている
// xxx: 裏で走らせているとvscode の日本語入力が死ぬ
