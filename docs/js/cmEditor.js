import { EditorView } from 'codemirror';
import { minimalSetup } from 'codemirror';
import { EditorState } from '@codemirror/state';

const createDiv = () => {
  const ele = document.createElement('div');
  ele.style.width = '100%';
  return ele;
};
const editorDiv = createDiv();

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
