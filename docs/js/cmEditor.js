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
const editorDiv = createDiv('editorMain');

let myTheme = EditorView.theme(
  {
    '&': {
      //color: 'white',
      //backgroundColor: '#00000000',
      fontSize: '0.8rem',
    },
    '.cm-scroller': {
      fontFamily:
        'Consolas, Menlo, Monaco, source-code-pro, Courier New, monospace',
    },
  },
  //{ dark: true }
);

const state = EditorState.create({
  doc: '',
  extensions: [
    minimalSetup,
    lineNumbers(),
    highlightActiveLineGutter(),
    highlightActiveLine(),
    myTheme,
  ],
});

const editor = new EditorView({
  state,
  parent: editorDiv,
});

export { editor, editorDiv, EditorState };
