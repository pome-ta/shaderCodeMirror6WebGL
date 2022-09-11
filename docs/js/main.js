import {
  screenDiv,
  statusLogDiv,
  logText,
  modeSelect,
  accessoryDiv,
  buttonArea,
  commentButton,
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
  StateField,
  StateEffect,
  Decoration,
  undo,
  redo,
  selectAll,
  cursorLineUp,
  cursorLineDown,
  cursorCharLeft,
  cursorCharRight,
  initExtensions,
  editorDiv,
  toggleComment,
} from './modules/cmEditor.bundle.js';
import { Fragmen, canvasDiv, option, initMode } from './shaderCanvas/index.js';

async function fetchShader(path) {
  const res = await fetch(path);
  const shaderText = await res.text();
  return shaderText;
}

const updateCallback = EditorView.updateListener.of(
  (update) => update.docChanged && onChange(update.state.doc.toString())
);

// xxx: `fragman.js` で`#version 300 es` が付与されるため、ここで削除
const sendSource = (doc) =>
  currentMode ? doc.replace(/^#version 300 es/, '') : doc;

function onChange(docs) {
  if (fragmen === null) {
    return;
  }
  //backgroundlineSelection(editor);
  fragmen.render(sendSource(docs));
}

const addBackgroundLine = StateEffect.define({
  map: ({ from, to }, change) => ({
    from: change.mapPos(from),
    to: change.mapPos(to),
  }),
});
const backgroundlineField = StateField.define({
  create() {
    return Decoration.none;
  },
  update(backgroundlines, tr) {
  //console.log(this);
    backgroundlines = backgroundlines.map(tr.changes);
    //console.log('c')
    //console.log(tr);
    //console.log(this);
    for (let e of tr.effects) {
      if (e.is(addBackgroundLine)) {
        //console.log('s')
        //console.log(backgroundlines);
        //console.log(e)
        backgroundlines = backgroundlines.update({
          add: [backgroundlineMark.range(e.value.from, e.value.to)],
        });
        //console.log('e')
        //console.log(backgroundlines);
      }
    }
    //console.log(backgroundlines);
    return backgroundlines;
  },
  provide: (f) => EditorView.decorations.from(f),
});
const backgroundlineTheme = EditorView.baseTheme({
  '.cm-backgroundline': { backgroundColor: '#23232380' },
  '&.cm-editor': {
    '&.cm-focused': {
      // Provide a simple default outline to make sure a focused
      // editor is visually distinct. Can't leave the default behavior
      // because that will apply to the content element, which is
      // inside the scrollable container and doesn't include the
      // gutters. We also can't use an 'auto' outline, since those
      // are, for some reason, drawn behind the element content, which
      // will cause things like the active line background to cover
      // the outline (#297).
      outline: '0px dotted #212121',
    },
  },
});
const backgroundlineMark = Decoration.mark({ class: 'cm-backgroundline' });

function backgroundlineSelection(view) {
  //console.log(view)
  const endRange = view.state.doc.length;
  const ranges = [EditorSelection.range(0, endRange)];
  //console.log(ranges)
  let effects = ranges
    .filter((r) => !r.empty)
    .map(({ from, to }) => addBackgroundLine.of({ from, to }));
  if (!effects.length) {
    return false;
  }
  //console.log(effects)
  //console.log(view.state.field(backgroundlineField, false))
  if (!view.state.field(backgroundlineField, false)) {
    effects.push(
      StateEffect.appendConfig.of([backgroundlineField, backgroundlineTheme])
    );
  }
  //console.log(view.state.field(backgroundlineField, false))
  view.dispatch({ effects });
  //console.log(view.state.field(backgroundlineField, false))
  return true;
}

function moveCaret(pos) {
  editor.dispatch({
    selection: EditorSelection.create([EditorSelection.cursor(pos)]),
  });
  editor.focus();
}

/* -- main */
const container = document.createElement('main');
container.id = 'container-main';
container.style.height = '100%';

const darkBackground = '#21252b';
//document.body.backgroundColor = darkBackground
const logColor = {
  success: '#1da1f2',
  warn: 'orangered',
  error: '#ff517b',
};
logText.textContent = ' ● ready';
logText.style.color = logColor['warn'];

statusLogDiv.appendChild(logText);
statusLogDiv.appendChild(modeSelect);

accessoryDiv.appendChild(statusLogDiv);
accessoryDiv.appendChild(buttonArea);
screenDiv.appendChild(editorDiv);
screenDiv.appendChild(accessoryDiv);

container.appendChild(canvasDiv);
container.appendChild(screenDiv);
document.body.appendChild(container);

/* -- loadSource */
let loadSource;
const fsPaths = ['./shaders/fs/fsMain.js', './shaders/fs/fsMain300es.js'];
// xxx: 読み込み方法が雑
const fsPath = initMode ? fsPaths[1] : fsPaths[0];
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

backgroundlineSelection(editor);
backgroundlineSelection(editor);

let currentMode = initMode;
const fragmen = new Fragmen(option);
fragmen.onBuild((status, msg) => {
  logText.style.color = logColor[status];
  logText.textContent = msg;
});
fragmen.mode = currentMode;
fragmen.render(sendSource(loadSource));

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

  accessoryDiv.style.bottom = `${upBottom}px`;
}
modeSelect.value = currentMode;
modeSelect.addEventListener('change', () => {
  fragmen.mode = parseInt(modeSelect.value);
  currentMode = fragmen.mode;
  onChange(editor.state.doc.toString());
});

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

  // selectAllButton.addEventListener('click', () => {
  //   const endRange = editor.state.doc.length;
  //   const transaction = {
  //     selection: EditorSelection.create([EditorSelection.range(0, endRange)]),
  //   };
  //   editor.dispatch(transaction);
  //   editor.focus();
  // });
  selectAllButton.addEventListener('click', () => {
    selectAll(editor);
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
    startX = event.touches ? event.touches[0].pageX : event.pageX;
  }

  function statusLogDivSwipeMove(event) {
    event.preventDefault();
    endX = event.touches ? event.touches[0].pageX : event.pageX;
    const moveDistance = Math.round((endX - startX) / 10); // xxx: スワイプでの移動距離数値
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
    cursorCharLeft(editor);
    editor.focus();
    // caret = editor.state.selection.main.anchor;
    // caret -= 1;
    // caret = caret > 0 ? caret : 0;
    // moveCaret(caret);
  });

  rightButton.addEventListener('click', () => {
    cursorCharRight(editor);
    editor.focus();
    // const docLength = editor.state.doc.length;
    // caret = editor.state.selection.main.head;
    // caret += 1;
    // caret = caret < docLength ? caret : docLength;
    // moveCaret(caret);
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
    cursorLineUp(editor);
    editor.focus();
    // caret = moveUpDownCaret(0);
    // moveCaret(caret);
  });
  downButton.addEventListener('click', () => {
    cursorLineDown(editor);
    editor.focus();
    // caret = moveUpDownCaret(1);
    // moveCaret(caret);
  });
  commentButton.addEventListener('click', () => {
    toggleComment(editor);
    editor.focus();
  });
}
