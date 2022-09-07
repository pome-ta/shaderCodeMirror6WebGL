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

const logSuccessColor = '#1da1f2';
const logWarnColor = 'orangered';
const logErrorColor = '#ff517b';

const logColor = {
  success: logSuccessColor,
  warn: logWarnColor,
  error: logErrorColor,
};

const btnW = '2.5rem';
const btnRadius = '16%';

function _createButtonWrap(width, height) {
  const wrap = document.createElement('div');
  // xxx: 最大数問題
  wrap.style.minWidth = width;
  wrap.style.height = height;
  wrap.style.display = 'flex';
  wrap.style.justifyContent = 'center';
  wrap.style.alignItems = 'center';
  return wrap;
}

function createIcon(char) {
  const icon = document.createElement('span');
  icon.textContent = char;
  icon.style.fontSize = '1.2rem';
  //icon.style.fontWeight = 900;
  // icon.style.color = '#fefefe';
  icon.style.color = '#f2f2f7'; // gray6
  return icon;
}

function createActionButton(iconChar) {
  const wrap = _createButtonWrap(btnW, '100%');
  const button = _createButtonWrap('90%', '90%');
  const icon = createIcon(iconChar);
  wrap.appendChild(button);
  wrap.style.cursor = 'pointer';
  button.style.borderRadius = btnRadius;
  // button.style.backgroundColor = '#ababab';
  button.style.backgroundColor = '#8e8e93'; // light gray
  button.style.filter = 'drop-shadow(2px 2px 2px rgba(28, 28, 30, 0.9))';
  button.appendChild(icon);
  return wrap;
}

/* -- set layout */
const screenDiv = document.createElement('div');
screenDiv.id = 'screen-wrap';
screenDiv.style.position = 'relative';
screenDiv.style.display = 'grid';
screenDiv.style.gridTemplateRows = '1fr auto';
screenDiv.style.height = '100%';
screenDiv.style.overflow = 'auto';

const accessoryDiv = document.createElement('div');
accessoryDiv.id = 'accessory-div';
accessoryDiv.style.padding = '0.5rem';
//accessoryDiv.style.margin = '0.5rem';
accessoryDiv.style.backgroundColor = '#1c1c1e80'; // Gray6
// todo: 常に下部に表示
accessoryDiv.style.position = 'sticky';
accessoryDiv.style.bottom = 0;

const statusLogDiv = document.createElement('div');
statusLogDiv.id = 'statusLog-div';
statusLogDiv.style.minHeight = '1.8rem';
// テキストの上下センター表示
statusLogDiv.style.display = 'flex';
statusLogDiv.style.justifyContent = 'space-between';
statusLogDiv.style.alignItems = 'center';
statusLogDiv.style.fontSize = '0.64rem';
statusLogDiv.style.fontFamily =
  'Consolas, Menlo, Monaco, source-code-pro, Courier New, monospace';

const logText = document.createElement('p');
logText.id = 'logText-p';
// logText.style.fontSize = '0.64rem';
// const logText = document.createElement('span');
//logText.style.margin = '1rem';
// xxx: fontFamily でサイズが変わる
// logText.style.fontFamily =
//   'Consolas, Menlo, Monaco, source-code-pro, Courier New, monospace';
logText.textContent = ' ● ready';
logText.style.color = logColor['warn'];

const buttonArea = document.createElement('div');
buttonArea.id = 'buttonArea-div';
//buttonArea.style.margin = '0.5rem 0';
//buttonArea.style.padding = '0.5rem 0';
buttonArea.style.display = 'flex';
buttonArea.style.justifyContent = 'space-around';
buttonArea.style.display = 'none';

const [
  commentButton,
  leftButton,
  upButton,
  downButton,
  rightButton,
  selectAllButton,
  redoButton,
  undoButton,
] = ['//', '←', '↑', '↓', '→', '⎁', '⤻', '⤺'].map((str) => {
  const ele = createActionButton(str);
  buttonArea.appendChild(ele);
  return ele;
});

const modeOptions = [
  'classic',
  'geek',
  'geeker',
  'geekest',
  'classic (300 es)',
  'geek (300 es)',
  'geeker (300 es)',
  'geekest (300 es)',
  'classic (MRT)',
  'geek (MRT)',
  'geeker (MRT)',
  'geekest (MRT)',
];
const modeSelect = document.createElement('select');
modeSelect.id = 'mode-select';
modeSelect.style.background = '#1c1c1e80';
modeOptions.forEach((option, index) => {
  const optionElement = document.createElement('option');
  optionElement.value = index;
  optionElement.text = option;
  if ([0, 4].includes(index)) {
    modeSelect.appendChild(optionElement);
  }
});

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
    moveCaret(caret);
  });

  rightButton.addEventListener('click', () => {
    caret = editor.state.selection.main.anchor;
    caret += 1;
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

/*
// モード変更時の処理 まだ実装しない
modeSelect.addEventListener(
  'change',
  () => {
    const defaultSourceInPrevMode = fragmenDefaultSource[currentMode];

    const source = editor.textContent;
    currentMode = parseInt(modeSelect.value);
    fragmen.mode = currentMode;

    // 既定のソースと同じならモードに応じた既定のソースに書き換える
    if (source === defaultSourceInPrevMode) {
      const defaultSource = fragmenDefaultSource[currentMode];
      editor.textContent = defaultSource;
    } else {
      // ソースを置き換えないとしてもビルドはしなおす
      update(editor.textContent);
    }
  },
  false
);
*/
