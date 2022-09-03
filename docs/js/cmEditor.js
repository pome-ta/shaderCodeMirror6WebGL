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

const overflowView = EditorView.theme({
  '&': { maxHeight: `${visualViewport.height}` },
  '.cm-gutter,.cm-content': { minHeight: `${visualViewport.height}` },
  '.cm-scroller': {
    overflow: 'auto',
    fontFamily:
      'Consolas, Menlo, Monaco, source-code-pro, Courier New, monospace',
  },
});

const state = EditorState.create({
  doc: `sample text😇
  ほげ、ほげ。`,
  extensions: [
    minimalSetup,
    lineNumbers(),
    highlightActiveLineGutter(),
    highlightActiveLine(),
    // overflowView,
  ],
});

const editor = new EditorView({
  state,
  parent: editorDiv,
});

export { editor, editorDiv };
