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

accessoryDiv.appendChild(statusLogDiv);
statusLogDiv.appendChild(logText);
screenDiv.appendChild(editorDiv);
screenDiv.appendChild(accessoryDiv);

/* -- loadSource */
let loadSource;
const fsPath = './shaders/fs/fsMain.js';
loadSource = await fetchShader(fsPath);

/* -- main */
const container = document.createElement('main');
container.id = 'container-main';
container.style.height = '100%';

container.appendChild(canvasDiv);
container.appendChild(screenDiv);
document.body.appendChild(container);

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
