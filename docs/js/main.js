import {
  EditorView,
  highlightSpecialChars,
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
  bgRectangleSet(editor);
  if (fragmen === null) {
    return;
  }
  fragmen.render(sendSource(docs));
}

const bgRectangleClassName = 'cm-bgRectangle';

const bgRectangleMark = Decoration.mark({ class: bgRectangleClassName });
const bgRectangleTheme = EditorView.baseTheme({
  '.cm-bgRectangle': { backgroundColor: '#23232380' },
});

const bgRectEffect = {
  add: StateEffect.define({ from: 0, to: 0 }),
  remove: StateEffect.define({ from: 0, to: 0 }),
};

const bgRectangleField = StateField.define({
  create() {
    return Decoration.none;
  },
  update(bgRectangles, tr) {
    bgRectangles = bgRectangles.map(tr.changes);
    for (const ef of tr.effects) {
      if (ef.is(bgRectEffect.add)) {
        bgRectangles = bgRectangles.update({
          add: [bgRectangleMark.range(ef.value.from, ef.value.to)],
        });
      } else if (ef.is(bgRectEffect.remove)) {
        bgRectangles = bgRectangles.update({
          // filter: (from, to, value) => {
          //   let shouldRemove =
          //     from === e.value.from &&
          //     to === e.value.to &&
          //     value.spec.class === bgRectangleClassName;
          //   return !shouldRemove;
          // },
          filter: (f, t, value) => !(value.class === bgRectangleClassName),
        });
      }
    }
    return bgRectangles;
  },
  provide: (f) => EditorView.decorations.from(f),
});

function bgRectangleSet(view) {
  const { state, dispatch } = view;
  const { from, to } = state.selection.main.extend(0, state.doc.length);
  const decoSet = state.field(bgRectangleField, false);

  const addFromTO = (from, to) => bgRectEffect.add.of({ from, to });
  const removeFromTO = (from, to) => bgRectEffect.remove.of({ from, to });

  let effects = [];
  effects.push(
    !decoSet ? StateEffect.appendConfig.of([bgRectangleField]) : null
  );
  decoSet?.between(from, to, (decoFrom, decoTo) => {
    if (from === decoTo || to === decoFrom) {
      return;
    }
    effects.push(removeFromTO(from, to));
    effects.push(removeFromTO(decoFrom, decoTo));
    effects.push(decoFrom < from ? addFromTO(decoFrom, from) : null);
    effects.push(decoTo > to ? addFromTO(to, decoTo) : null);
  });

  effects.push(addFromTO(from, to));

  if (!effects.length) {
    return false;
  }
  dispatch({ effects: effects.filter((ef) => ef) });
  return true;
}

const resOutlineTheme = EditorView.baseTheme({
  '&.cm-editor': {
    '&.cm-focused': {
      outline: '0px dotted #212121',
    },
  },
});

function moveCaret(pos) {
  editor.dispatch({
    selection: EditorSelection.create([EditorSelection.cursor(pos)]),
  });
  editor.focus();
}

const u00b7 = '·'; // ラテン語中点
const u2018 = '∘'; // RING OPERATOR
const u2022 = '•'; // bullet
const u2023 = '‣'; // triangular bullet
const u2219 = '∙'; // BULLET OPERATOR
const u22c5 = '⋅'; // DOT OPERATOR
const uff65 = '･'; // 半角中点

const ivory = '#abb2bf44'; // todo: oneDark から拝借
const stone = '#7d8799'; // Brightened compared to original to increase contrast  // 濃い灰色
const whitespaceShow = highlightSpecialChars({
  render: (code) => {
    let node = document.createElement('span');
    node.classList.add('cm-whoteSpace');
    // node.style.opacity = 0.5;
    node.style.color = ivory;
    // node.style.color = stone;
    node.innerText = u22c5;
    // node.innerText = uff65;
    node.title = '\\u' + code.toString(16);
    return node;
  },
  // specialChars: /\x20/g,
  addSpecialChars: /\x20/g,
});

/* -- main */
const container = document.createElement('main');
container.id = 'container-main';
container.style.height = '100%';

const darkBackground = '#21252b';
document.body.backgroundColor = darkBackground;

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

const fontSizeTheme = EditorView.theme({
  '&': {
    // fontSize: '0.72rem',
    fontSize: hasTouchScreen ? '0.75rem' : '1.0rem',
  },
});

const extensions = [
  fontSizeTheme,
  ...initExtensions,
  resOutlineTheme,
  bgRectangleTheme,
  whitespaceShow,
  updateCallback,
];
const state = EditorState.create({
  doc: loadSource,
  extensions: extensions,
});

const editor = new EditorView({
  state,
  parent: editorDiv,
});

bgRectangleSet(editor);

let currentMode = initMode;
const fragmen = new Fragmen(option);
fragmen.onBuild((status, msg) => {
  logText.style.color = logColor[status];
  logText.textContent = msg;
});
fragmen.mode = currentMode;
fragmen.render(sendSource(loadSource));

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
modeSelect.style.color = logColor.success;
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
  });

  rightButton.addEventListener('click', () => {
    cursorCharRight(editor);
    editor.focus();
  });

  upButton.addEventListener('click', () => {
    cursorLineUp(editor);
    editor.focus();
  });
  downButton.addEventListener('click', () => {
    cursorLineDown(editor);
    editor.focus();
  });

  commentButton.addEventListener('click', () => {
    toggleComment(editor);
    editor.focus();
  });
}
