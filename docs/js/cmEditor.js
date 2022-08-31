import { EditorView, minimalSetup } from 'codemirror';

import { EditorState } from '@codemirror/state';
import {
  lineNumbers,
  highlightActiveLineGutter,
  highlightActiveLine,
} from '@codemirror/view';

const createDiv = (idName) => {
  const ele = document.createElement('div');
  if (idName) {
    ele.id = idName;
  }
  ele.style.width = '100%';
  return ele;
};
const editorDiv = createDiv('editorWrap');

const state = EditorState.create({
  doc: `sample text😇
  ほげ、ほげ。`,
  extensions: [
    minimalSetup,
    lineNumbers(),
    highlightActiveLineGutter(),
    highlightActiveLine(),
  ],
});

const editor = new EditorView({
  state,
  parent: editorDiv,
});

export { editor, editorDiv };
