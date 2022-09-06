import {
  EditorView,
  EditorState,
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
  wrap.style.width = width;
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
accessoryDiv.style.padding = '0.2rem';
accessoryDiv.style.backgroundColor = '#1c1c1e80'; // Gray6
// todo: 常に下部に表示
accessoryDiv.style.position = 'sticky';
accessoryDiv.style.bottom = 0;

const statusLogDiv = document.createElement('div');
statusLogDiv.id = 'statusLog-div';
statusLogDiv.style.minHeight = '1.8rem';
// テキストの上下センター表示
statusLogDiv.style.display = 'flex';
statusLogDiv.style.alignItems = 'center';

const logText = document.createElement('p');
logText.id = 'logText-p';
// const logText = document.createElement('span');
//logText.style.margin = '1rem';
logText.style.fontSize = '0.64rem';
logText.style.fontFamily =
  'Consolas, Menlo, Monaco, source-code-pro, Courier New, monospace';
logText.textContent = ' ● ready';
logText.style.color = logColor['warn'];

const buttonArea = document.createElement('div');
buttonArea.id = 'buttonArea-div';
buttonArea.style.display = 'flex';
buttonArea.style.justifyContent = 'space-around';

const [
  commentButton,
  tabButton,
  equalButton,
  commaButton,
  semicolonButton,
  leftButton,
  rightButton,
  selectAllButton,
  redoButton,
  undoButton,
] = ['//', '⇥', '=', ',', ';', '↼', '⇀', '⎁', '⤻', '⤺'].map((str) => {
  const ele = createActionButton(str);
  buttonArea.appendChild(ele);
  return ele;
});
accessoryDiv.appendChild(statusLogDiv).appendChild(logText);
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

function visualViewportHandler() {
  /*
  if (editor.hasFocus) {
    accessoryDiv.style.display = 'grid';
    // document.body.style.backgroundColor = 'blue';
  } else {
    accessoryDiv.style.display = 'none';
    //document.body.style.backgroundColor = 'yellow';
  }
*/
  const upBottom =
    window.innerHeight -
    visualViewport.height +
    visualViewport.offsetTop -
    visualViewport.pageTop;

  const editorDivHeight = screenDiv.offsetHeight - accessoryDiv.offsetHeight;

  //statusLogDiv.style.bottom = `${upBottom}px`;
  accessoryDiv.style.bottom = `${upBottom}px`;
  editorDiv.style.height = `${editorDivHeight}px`;
}

visualViewport.addEventListener('scroll', visualViewportHandler);
visualViewport.addEventListener('resize', visualViewportHandler);
