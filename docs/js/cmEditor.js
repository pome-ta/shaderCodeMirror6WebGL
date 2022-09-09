import { EditorView, minimalSetup } from 'codemirror';

import { EditorState, EditorSelection, Compartment } from '@codemirror/state';
import {
  lineNumbers,
  highlightActiveLineGutter,
  highlightActiveLine,
} from '@codemirror/view';
import {
  undo,
  redo,
  selectAll,
  cursorLineUp,
  cursorLineDown,
  cursorCharLeft,
  cursorCharRight,
} from '@codemirror/commands';

const editorDiv = document.createElement('div');
editorDiv.id = 'editor-div';
editorDiv.style.width = '100%';

let myTheme = EditorView.theme({
  '&': {
    fontSize: '0.8rem',
  },
  '.cm-scroller': {
    fontFamily:
      'Consolas, Menlo, Monaco, source-code-pro, Courier New, monospace',
  },
});

const tabSize = new Compartment();

const initExtensions = [
  minimalSetup,
  lineNumbers(),
  highlightActiveLineGutter(),
  highlightActiveLine(),
  EditorView.lineWrapping, // 改行
  tabSize.of(EditorState.tabSize.of(2)),
  myTheme,
];

export {
  EditorView,
  EditorState,
  EditorSelection,
  undo,
  redo,
  selectAll,
  cursorLineUp,
  cursorLineDown,
  cursorCharLeft,
  cursorCharRight,
  initExtensions,
  editorDiv,
};
