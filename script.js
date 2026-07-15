const editorArea = document.getElementById('editor-area');
const statusElement = document.getElementById('status');
const runButton = document.getElementById('run-preview');
const reloadButton = document.getElementById('reload-preview');
const copyButton = document.getElementById('copy-code');
const clearButton = document.getElementById('clear-code');
const resetButton = document.getElementById('reset-all');
const modeButtons = Array.from(document.querySelectorAll('.mode-tab'));
const viewportButtons = Array.from(document.querySelectorAll('.viewport-button'));
const previewStage = document.getElementById('preview-stage');
const previewHeightInput = document.getElementById('preview-height');
const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
const primaryMenu = document.getElementById('primary-menu');
const currentYear = document.getElementById('current-year');

const DEFAULT_MODE = 'combined';
const DEFAULT_HEIGHT = 640;
const MIN_HEIGHT = 240;
const MAX_HEIGHT = 1600;

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
  previewDocument: '',
  previewWidth: 'desktop',
  previewHeight: DEFAULT_HEIGHT,
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

function setStatus(message, type = 'info') {
  statusElement.textContent = message;
  statusElement.className = `status status-${type}`;
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
    textarea.wrap = 'off';
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
    case 'combined': return state.combined;
    case 'div-script': return `${state.divCode}\n${state.divScript}`;
    case 'button-script': return `${state.buttonCode}\n${state.buttonScript}`;
    case 'iframe': return state.iframeCode;
    case 'html-css-js': return `<style>\n${state.cssCode}\n</style>\n${state.htmlCode}\n<script>\n${state.javascriptCode}\n<\/script>`;
    default: return '';
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

function createPreviewFrame(documentHtml) {
  const iframe = document.createElement('iframe');
  iframe.className = 'preview-frame';
  iframe.title = 'Widget Preview';
  iframe.setAttribute('sandbox', 'allow-forms allow-modals allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts');
  iframe.srcdoc = documentHtml;
  return iframe;
}

function renderPreview(documentHtml) {
  previewStage.replaceChildren(createPreviewFrame(documentHtml));
}

function runPreview() {
  const code = getSelectedCode();
  if (!code.trim()) {
    setStatus('Paste code before running the preview.', 'info');
    return;
  }
  state.previewDocument = buildDocument(code);
  renderPreview(state.previewDocument);
  setStatus('Preview updated.', 'success');
}

function reloadPreview() {
  if (!state.previewDocument) {
    setStatus('Paste code before running the preview.', 'info');
    return;
  }
  renderPreview(state.previewDocument);
  setStatus('Preview updated.', 'success');
}

async function copyCode() {
  const code = getSelectedCode();
  if (!code.trim()) {
    setStatus('Paste code before running the preview.', 'info');
    return;
  }
  try {
    await navigator.clipboard.writeText(code);
    setStatus('Code copied.', 'success');
  } catch {
    setStatus('Clipboard access failed.', 'error');
  }
}

function clearCurrentMode() {
  modeFields[state.mode].forEach((field) => { state[field.key] = ''; });
  renderEditors();
  setStatus('Current mode cleared.', 'success');
}

function resetPreview() {
  previewStage.replaceChildren();
  const empty = document.createElement('div');
  empty.id = 'preview-empty';
  empty.className = 'preview-empty';
  empty.textContent = 'Your preview will appear here after you click Run Preview.';
  previewStage.append(empty);
}

function resetAll() {
  Object.keys(state).forEach((key) => { state[key] = ''; });
  state.mode = DEFAULT_MODE;
  state.previewWidth = 'desktop';
  state.previewHeight = DEFAULT_HEIGHT;
  previewHeightInput.value = String(DEFAULT_HEIGHT);
  state.previewDocument = '';
  renderEditors();
  syncViewportButtons();
  applyPreviewSize();
  resetPreview();
  setStatus('All fields reset.', 'success');
}

function moveModeFocus(currentButton, direction) {
  const currentIndex = modeButtons.indexOf(currentButton);
  const nextButton = modeButtons[(currentIndex + direction + modeButtons.length) % modeButtons.length];
  nextButton.focus();
  setMode(nextButton.dataset.mode);
}

function syncViewportButtons() {
  viewportButtons.forEach((button) => {
    const isActive = button.dataset.width === state.previewWidth;
    button.setAttribute('aria-checked', String(isActive));
  });
}

function applyPreviewSize() {
  previewStage.classList.remove('preview-desktop', 'preview-tablet', 'preview-mobile');
  previewStage.classList.add(`preview-${state.previewWidth}`);
  previewStage.style.setProperty('--preview-height', `${state.previewHeight}px`);
}

function setViewport(width) {
  state.previewWidth = width;
  syncViewportButtons();
  applyPreviewSize();
}

function updatePreviewHeight() {
  const height = Number(previewHeightInput.value);
  if (!Number.isInteger(height) || height < MIN_HEIGHT || height > MAX_HEIGHT) {
    setStatus('Invalid preview height.', 'error');
    previewHeightInput.value = String(state.previewHeight);
    return;
  }
  state.previewHeight = height;
  applyPreviewSize();
}

modeButtons.forEach((button) => {
  button.addEventListener('click', () => setMode(button.dataset.mode));
  button.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') { event.preventDefault(); moveModeFocus(button, 1); }
    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') { event.preventDefault(); moveModeFocus(button, -1); }
    if (event.key === 'Home') { event.preventDefault(); modeButtons[0].focus(); setMode(modeButtons[0].dataset.mode); }
    if (event.key === 'End') { event.preventDefault(); modeButtons[modeButtons.length - 1].focus(); setMode(modeButtons[modeButtons.length - 1].dataset.mode); }
  });
});

viewportButtons.forEach((button) => {
  button.addEventListener('click', () => setViewport(button.dataset.width));
});

mobileMenuToggle.addEventListener('click', () => {
  const isOpen = primaryMenu.classList.toggle('is-open');
  mobileMenuToggle.setAttribute('aria-expanded', String(isOpen));
});

runButton.addEventListener('click', runPreview);
reloadButton.addEventListener('click', reloadPreview);
copyButton.addEventListener('click', copyCode);
clearButton.addEventListener('click', clearCurrentMode);
resetButton.addEventListener('click', resetAll);
previewHeightInput.addEventListener('change', updatePreviewHeight);

currentYear.textContent = String(new Date().getFullYear());
renderEditors();
applyPreviewSize();
