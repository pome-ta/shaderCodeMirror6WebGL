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
      color: 'white',
      backgroundColor: '#034',
    },
    '.cm-scroller': {
      fontSize: '0.8rem',
      fontFamily:
        'Consolas, Menlo, Monaco, source-code-pro, Courier New, monospace',
    },
    '.cm-content': {
      caretColor: '#0e9',
    },
    '&.cm-focused .cm-cursor': {
      borderLeftColor: '#0e9',
    },
    '&.cm-focused .cm-selectionBackground, ::selection': {
      backgroundColor: '#074',
    },
    '.cm-gutters': {
      backgroundColor: '#045',
      color: '#ddd',
      border: 'none',
    },
  },
  { dark: true }
);

const state = EditorState.create({
  doc: `sample text😇
  ほげ、ほげ。`,
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

export { editor, editorDiv };
