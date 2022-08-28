import { EditorView } from 'codemirror';
import { minimalSetup } from 'codemirror';
import { EditorState } from '@codemirror/state';

const editorDiv = document.createElement('div');
editorDiv.style.width = '100%';

const state = EditorState.create({
  doc: `sample text😇
  ほげ、ほげ。`,
  extensions: [minimalSetup],
});

const editor = new EditorView({
  state,
  parent: editorDiv,
});

export { editor, editorDiv };
