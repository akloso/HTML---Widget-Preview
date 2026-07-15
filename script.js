const editorArea = document.getElementById('editor-area');
const statusElement = document.getElementById('status');
const runButton = document.getElementById('run-preview');
const copyButton = document.getElementById('copy-code');
const clearButton = document.getElementById('clear-code');
const resetButton = document.getElementById('reset-all');
const modeButtons = Array.from(document.querySelectorAll('.mode-tab'));

const DEFAULT_MODE = 'combined';

const state = {
  mode: DEFAULT_MODE,
  combined: '',
  divCode: '',
  divScript: '',
  buttonCode: '',
  buttonScript: '',
  iframeCode: '',
  htmlCode: '',
  cssCode: '',
  javascriptCode: '',
};

const modeFields = {
  combined: [
    { key: 'combined', label: 'Complete widget or embed code', placeholder: '<div>...</div>\n<script>...</script>' },
  ],
  'div-script': [
    { key: 'divCode', label: 'DIV / Placeholder code', placeholder: '<div class="widget-placeholder"></div>' },
    { key: 'divScript', label: 'Script code', placeholder: '<script src="https://provider.com/widget.js"></script>' },
  ],
  'button-script': [
    { key: 'buttonCode', label: 'Button code', placeholder: '<button type="button">Open widget</button>' },
    { key: 'buttonScript', label: 'Script and configuration code', placeholder: '<script>...</script>' },
  ],
  iframe: [
    { key: 'iframeCode', label: 'Iframe embed code', placeholder: '<iframe src="https://example.com"></iframe>' },
  ],
  'html-css-js': [
    { key: 'htmlCode', label: 'HTML', placeholder: '<button id="test">Click me</button>' },
    { key: 'cssCode', label: 'CSS', placeholder: 'button { padding: 12px 20px; }' },
    { key: 'javascriptCode', label: 'JavaScript', placeholder: 'document.getElementById("test").onclick = function () { alert("Working"); };' },
  ],
};

function setStatus(message) {
  statusElement.textContent = message;
}

function syncModeButtons() {
  modeButtons.forEach((button) => {
    const isActive = button.dataset.mode === state.mode;
    button.setAttribute('aria-checked', String(isActive));
    button.tabIndex = isActive ? 0 : -1;
  });
}

function renderEditors() {
  editorArea.replaceChildren();

  modeFields[state.mode].forEach((field) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'editor-block';

    const label = document.createElement('label');
    label.htmlFor = field.key;
    label.textContent = field.label;

    const textarea = document.createElement('textarea');
    textarea.id = field.key;
    textarea.name = field.key;
    textarea.value = state[field.key];
    textarea.placeholder = field.placeholder;
    textarea.spellcheck = false;
    textarea.autocapitalize = 'off';
    textarea.autocomplete = 'off';
    textarea.addEventListener('input', (event) => {
      state[field.key] = event.target.value;
    });

    wrapper.append(label, textarea);
    editorArea.append(wrapper);
  });

  syncModeButtons();
}

function setMode(mode) {
  if (!modeFields[mode] || state.mode === mode) return;
  state.mode = mode;
  renderEditors();
  setStatus('');
}

function getSelectedCode() {
  switch (state.mode) {
    case 'combined':
      return state.combined;
    case 'div-script':
      return `${state.divCode}\n${state.divScript}`;
    case 'button-script':
      return `${state.buttonCode}\n${state.buttonScript}`;
    case 'iframe':
      return state.iframeCode;
    case 'html-css-js':
      return `<style>\n${state.cssCode}\n</style>\n${state.htmlCode}\n<script>\n${state.javascriptCode}\n<\/script>`;
    default:
      return '';
  }
}

function buildDocument(code) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Widget Preview</title>
  <style>
    html { box-sizing: border-box; }
    *, *::before, *::after { box-sizing: inherit; }
    body { margin: 0; min-height: 100vh; }
  </style>
</head>
<body>
${code}
</body>
</html>`;
}

function runPreview() {
  const code = getSelectedCode();
  if (!code.trim()) {
    setStatus('Paste code before running the preview.');
    return;
  }

  const previewWindow = window.open('', '_blank');
  if (!previewWindow) {
    setStatus('The browser blocked the preview tab.');
    return;
  }

  previewWindow.document.open();
  previewWindow.document.write(buildDocument(code));
  previewWindow.document.close();
  setStatus('Preview opened in a new tab.');
}

async function copyCode() {
  const code = getSelectedCode();
  if (!code.trim()) {
    setStatus('Paste code before running the preview.');
    return;
  }

  try {
    await navigator.clipboard.writeText(code);
    setStatus('Code copied.');
  } catch {
    setStatus('Clipboard access failed.');
  }
}

function clearCurrentMode() {
  modeFields[state.mode].forEach((field) => {
    state[field.key] = '';
  });
  renderEditors();
  setStatus('Current mode cleared.');
}

function resetAll() {
  Object.keys(state).forEach((key) => {
    state[key] = key === 'mode' ? DEFAULT_MODE : '';
  });
  renderEditors();
  setStatus('All fields reset.');
}

function moveModeFocus(currentButton, direction) {
  const currentIndex = modeButtons.indexOf(currentButton);
  const nextIndex = (currentIndex + direction + modeButtons.length) % modeButtons.length;
  const nextButton = modeButtons[nextIndex];
  nextButton.focus();
  setMode(nextButton.dataset.mode);
}

modeButtons.forEach((button) => {
  button.addEventListener('click', () => setMode(button.dataset.mode));
  button.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      event.preventDefault();
      moveModeFocus(button, 1);
    }
    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault();
      moveModeFocus(button, -1);
    }
    if (event.key === 'Home') {
      event.preventDefault();
      modeButtons[0].focus();
      setMode(modeButtons[0].dataset.mode);
    }
    if (event.key === 'End') {
      event.preventDefault();
      modeButtons[modeButtons.length - 1].focus();
      setMode(modeButtons[modeButtons.length - 1].dataset.mode);
    }
  });
});

runButton.addEventListener('click', runPreview);
copyButton.addEventListener('click', copyCode);
clearButton.addEventListener('click', clearCurrentMode);
resetButton.addEventListener('click', resetAll);

renderEditors();
