import {
  logColor,
  screenDiv,
  statusLogDiv,
  logText,
  modeSelect,
  accessoryDiv,
  buttonArea,
  undoButton,
  redoButton,
  selectAllButton,
  leftButton,
  rightButton,
  upButton,
  downButton,
} from './setDOMs.js';
import {
  EditorView,
  EditorState,
  EditorSelection,
  undo,
  redo,
  initExtensions,
  editorDiv,
} from './modules/cmEditor.bundle.js';
import {
  Fragmen,
  canvasDiv,
  option,
  currentMode,
  currentSource,
} from './shaderCanvas/index.js';

async function fetchShader(path) {
  const res = await fetch(path);
  const shaderText = await res.text();
  return shaderText;
}

const updateCallback = EditorView.updateListener.of(
  (update) => update.docChanged && onChange(update.state.doc.toString())
);

function onChange(docs) {
  if (fragmen === null) {
    return;
  }
  fragmen.render(docs);
}

statusLogDiv.appendChild(logText);
statusLogDiv.appendChild(modeSelect);

accessoryDiv.appendChild(statusLogDiv);
accessoryDiv.appendChild(buttonArea);
screenDiv.appendChild(editorDiv);
screenDiv.appendChild(accessoryDiv);

/* -- main */
const container = document.createElement('main');
container.id = 'container-main';
container.style.height = '100%';

container.appendChild(canvasDiv);
container.appendChild(screenDiv);
document.body.appendChild(container);

/* -- loadSource */
let loadSource;
const fsPath = './shaders/fs/fsMain.js';
loadSource = await fetchShader(fsPath);

const extensions = [...initExtensions, updateCallback];
const state = EditorState.create({
  doc: loadSource,
  extensions: extensions,
});

const editor = new EditorView({
  state,
  parent: editorDiv,
});

const fragmen = new Fragmen(option);
fragmen.onBuild((status, msg) => {
  logText.style.color = logColor[status];
  logText.textContent = msg;
});
fragmen.mode = currentMode;
fragmen.render(loadSource);

const hasTouchScreen = () => {
  if (navigator.maxTouchPoints > 0) {
    return true;
  }
  if (navigator.msMaxTouchPoints > 0) {
    return true;
  }
  if (window.matchMedia('(pointer:coarse)').matches) {
    return true;
  }
  if ('orientation' in window) {
    return true;
  }

  return false;
};

function visualViewportHandler() {
  buttonArea.style.display = editor.hasFocus ? 'flex' : 'none';
  const upBottom =
    window.innerHeight -
    visualViewport.height +
    visualViewport.offsetTop -
    visualViewport.pageTop;
  //const editorDivHeight = screenDiv.offsetHeight - accessoryDiv.offsetHeight;
  accessoryDiv.style.bottom = `${upBottom}px`;
  //editorDiv.style.height = `${editorDivHeight}px`;
}

modeSelect.addEventListener('change', () => {
  fragmen.mode = parseInt(modeSelect.value);
  onChange(editor.state.doc.toString());
});

function moveCaret(pos) {
  editor.dispatch({
    selection: EditorSelection.create([EditorSelection.cursor(pos)]),
  });
  editor.focus();
}

if (hasTouchScreen()) {
  visualViewport.addEventListener('scroll', visualViewportHandler);
  visualViewport.addEventListener('resize', visualViewportHandler);

  undoButton.addEventListener('click', () => {
    undo(editor);
    editor.focus();
  });

  redoButton.addEventListener('click', () => {
    redo(editor);
    editor.focus();
  });

  selectAllButton.addEventListener('click', () => {
    const endRange = editor.state.doc.length;
    const transaction = {
      selection: EditorSelection.create([EditorSelection.range(0, endRange)]),
    };
    editor.dispatch(transaction);
    editor.focus();
  });

  let caret, headLine, endLine;
  let startX = 0;
  let endX = 0;
  function statusLogDivSwipeStart(event) {
    const selectionMain = editor.state.selection.main;
    caret = selectionMain.anchor;
    headLine = editor.moveToLineBoundary(selectionMain, 0).anchor;
    endLine = editor.moveToLineBoundary(selectionMain, 1).anchor;
    // todo: mobile しか想定していないけども
    startX = event.touches ? event.touches[0].pageX : event.pageX;
  }

  function statusLogDivSwipeMove(event) {
    event.preventDefault();
    // todo: mobile しか想定していないけども
    // xxx: ドラッグでの移動
    endX = event.touches ? event.touches[0].pageX : event.pageX;
    const moveDistance = Math.round((endX - startX) / 10);

    caret += moveDistance;
    if (caret < headLine) {
      caret = headLine;
    } else if (caret >= endLine) {
      caret = endLine;
    }

    startX = endX;
    moveCaret(caret);
  }
  statusLogDiv.addEventListener('touchstart', statusLogDivSwipeStart);
  statusLogDiv.addEventListener('touchmove', statusLogDivSwipeMove);

  leftButton.addEventListener('click', () => {
    caret = editor.state.selection.main.anchor;
    caret -= 1;
    caret = caret > 0 ? caret : 0;
    moveCaret(caret);
  });

  rightButton.addEventListener('click', () => {
    const docLength = editor.state.doc.length;
    caret = editor.state.selection.main.anchor;
    caret += 1;
    caret = caret < docLength ? caret : docLength;

    moveCaret(caret);
  });

  /**
   * caret行の上下操作
   * @param {Boolean} forward - 0=flase=上, 1=true=下
   * @returns number - 移動先のcaret
   */
  function moveUpDownCaret(forward) {
    const selectionMain = editor.state.selection.main;
    return editor.moveVertically(selectionMain, forward).anchor;
  }
  upButton.addEventListener('click', () => {
    caret = moveUpDownCaret(0);
    moveCaret(caret);
  });
  downButton.addEventListener('click', () => {
    caret = moveUpDownCaret(1);
    moveCaret(caret);
  });
}
