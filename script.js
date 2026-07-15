const $ = (id) => document.getElementById(id);
const editorArea = $('editor-area');
const statusElement = $('status');
const statusDot = $('status-dot');
const activeModeLabel = $('active-mode-label');
const runButton = $('run-preview');
const reloadButton = $('reload-preview');
const copyButton = $('copy-code');
const clearButton = $('clear-code');
const resetButton = $('reset-all');
const modeButtons = Array.from(document.querySelectorAll('.mode-tab'));
const modeSelect = $('mode-select');
const viewportButtons = Array.from(document.querySelectorAll('.viewport-button'));
const previewStage = $('preview-stage');
const previewHeightInput = $('preview-height');
const mobileMenuToggle = $('mobile-menu-toggle');
const primaryMenu = $('primary-menu');
const toolsMenu = document.querySelector('[data-tools-menu]');
const toolsButton = $('tools-button');
const otherTools = document.querySelector('[data-other-tools]');
const otherToolsButton = otherTools.querySelector('button');
const currentYear = $('current-year');
const previewStatusChip = $('preview-status-chip');
const deviceMeta = $('device-meta');
const zoomSelect = $('zoom-select');
const browserZoom = $('browser-zoom');
const wrapToggle = $('wrap-toggle');
const templateSelect = $('template-select');
const autoPreviewToggle = $('auto-preview');
const recentRunsSelect = $('recent-runs');
const moreToggle = $('more-toggle');
const morePopover = $('more-popover');
const fullscreenOverlay = $('fullscreen-overlay');
const fullscreenStage = $('fullscreen-stage');
const fullscreenMeta = $('fullscreen-meta');
const closeFullscreenButton = $('close-fullscreen');
const panelDivider = $('panel-divider');
const workspacePanels = $('workspace-panels');
const heightResizer = $('height-resizer');
const workspace = $('workspace');

const DEFAULT_MODE = 'combined';
const DEFAULT_HEIGHT = 640;
const MIN_HEIGHT = 240;
const MAX_HEIGHT = 1600;
const AUTOPREVIEW_DELAY = 850;

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
  zoom: 1,
  wrap: true,
  autoPreview: false,
  recentRuns: [],
  status: 'Ready',
};

const modes = {
  combined: { label: 'Combined', fullLabel: 'Combined Code', language: 'markup', fields: [{ key: 'combined', label: 'Complete widget or embed code', placeholder: '<div>Widget container</div>\n<script>document.body.dataset.widgetStatus = "loaded"<\/script>' }] },
  'div-script': { label: 'DIV + Script', fullLabel: 'DIV + Script', language: 'markup', fields: [{ key: 'divCode', label: 'DIV / Placeholder Code', placeholder: '<div id="widget-root"></div>' }, { key: 'divScript', label: 'Script Code', placeholder: '<script>document.getElementById("widget-root").textContent = "Widget loaded";<\/script>' }] },
  'button-script': { label: 'Button + Script', fullLabel: 'Button + Script', language: 'markup', fields: [{ key: 'buttonCode', label: 'Button Code', placeholder: '<button id="open-widget" type="button">Open widget</button>' }, { key: 'buttonScript', label: 'Script and Configuration Code', placeholder: '<script>document.getElementById("open-widget").addEventListener("click", () => alert("Popup widget"));<\/script>' }] },
  iframe: { label: 'Iframe', fullLabel: 'Iframe Only', language: 'markup', fields: [{ key: 'iframeCode', label: 'Iframe Embed Code', placeholder: '<iframe src="https://example.com" width="100%" height="480" title="Example"><\/iframe>' }] },
  'html-css-js': { label: 'HTML/CSS/JS', fullLabel: 'HTML + CSS + JavaScript', language: 'markup', fields: [{ key: 'htmlCode', label: 'HTML', language: 'markup', placeholder: '<button id="test">Click me</button>' }, { key: 'cssCode', label: 'CSS', language: 'css', placeholder: 'button { padding: 12px 20px; border-radius: 10px; }' }, { key: 'javascriptCode', label: 'JavaScript', language: 'javascript', placeholder: 'document.getElementById("test").onclick = () => alert("Working");' }] },
};

const templates = {
  basic: { label: 'Basic HTML', mode: 'combined', values: { combined: '<section style="font-family: system-ui; padding: 24px; border: 1px solid #e5e7eb; border-radius: 16px;">\n  <h2>Hello from the preview</h2>\n  <p>This starter renders inside the iframe.</p>\n</section>' } },
  div: { label: 'DIV + Script Widget', mode: 'div-script', values: { divCode: '<div id="generic-widget"></div>', divScript: '<script>\n  const root = document.getElementById("generic-widget");\n  root.innerHTML = "<strong>Generic widget loaded</strong><p>No external provider required.</p>";\n<\/script>' } },
  popup: { label: 'Popup Button Widget', mode: 'button-script', values: { buttonCode: '<button id="open-popup" type="button">Open popup</button>\n<div id="popup-output" aria-live="polite"></div>', buttonScript: '<script>\n  document.getElementById("open-popup").addEventListener("click", () => {\n    document.getElementById("popup-output").textContent = "Popup action triggered.";\n  });\n<\/script>' } },
  iframe: { label: 'Iframe Embed', mode: 'iframe', values: { iframeCode: '<iframe title="Inline example" srcdoc="<h1 style=&quot;font-family:system-ui&quot;>Iframe preview</h1><p>Embedded safely with srcdoc.</p>" width="100%" height="320"></iframe>' } },
  contact: { label: 'Contact Form', mode: 'html-css-js', values: { htmlCode: '<form>\n  <label>Name <input name="name" placeholder="Asha Rao"></label>\n  <label>Email <input name="email" type="email" placeholder="asha@example.com"></label>\n  <button type="submit">Send</button>\n  <p id="form-status" role="status"></p>\n</form>', cssCode: 'form { display: grid; gap: 12px; max-width: 420px; font-family: system-ui; }\nlabel { display: grid; gap: 6px; font-weight: 600; }\ninput, button { padding: 12px; border: 1px solid #d1d5db; border-radius: 10px; }\nbutton { background: #16a34a; color: white; font-weight: 600; }', javascriptCode: 'document.querySelector("form").addEventListener("submit", (event) => {\n  event.preventDefault();\n  document.getElementById("form-status").textContent = "Form preview submitted locally.";\n});' } },
};

let autoPreviewTimer;
let closeToolsTimer;
let lastFocusedElement;

function hasPrism() {
  return Boolean(window.Prism && Prism.highlight && Prism.languages.markup);
}

function escapeHtml(value) {
  return value.replace(/[&<>"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[char]));
}

function highlightCode(value, language) {
  if (!hasPrism()) return escapeHtml(value);
  const grammar = Prism.languages[language] || Prism.languages.markup;
  return Prism.highlight(value, grammar, language);
}

function setStatus(message, type = 'ready') {
  state.status = message;
  statusElement.textContent = message;
  statusDot.className = `status-dot is-${type}`;
  previewStatusChip.className = `status-badge is-${type}`;
  previewStatusChip.innerHTML = `<span></span>${message}`;
}

function getSelectedCode() {
  if (state.mode === 'combined') return state.combined;
  if (state.mode === 'div-script') return `${state.divCode}\n${state.divScript}`;
  if (state.mode === 'button-script') return `${state.buttonCode}\n${state.buttonScript}`;
  if (state.mode === 'iframe') return state.iframeCode;
  return `<style>\n${state.cssCode}\n</style>\n${state.htmlCode}\n<script>\n${state.javascriptCode}\n<\/script>`;
}

function resetTextareaScroll() {
  editorArea.querySelectorAll('textarea').forEach((textarea) => { textarea.scrollLeft = 0; });
}

function queueAutoPreview() {
  clearTimeout(autoPreviewTimer);
  if (!state.autoPreview) return;
  autoPreviewTimer = setTimeout(() => { if (getSelectedCode().trim()) runPreview(); }, AUTOPREVIEW_DELAY);
}

function syncChrome() {
  const mode = modes[state.mode];
  activeModeLabel.textContent = mode.label;
  document.body.className = `mode-${state.mode}`;
  modeSelect.value = state.mode;
  viewportButtons.forEach((button) => button.setAttribute('aria-checked', String(button.dataset.width === state.previewWidth)));
  zoomSelect.value = String(state.zoom);
  browserZoom.textContent = `${Math.round(state.zoom * 100)}%`;
  const widthLabel = state.previewWidth === 'desktop' ? 'auto' : state.previewWidth === 'tablet' ? '768' : '390';
  const deviceLabel = state.previewWidth[0].toUpperCase() + state.previewWidth.slice(1);
  deviceMeta.textContent = `${deviceLabel} · ${widthLabel} × ${state.previewHeight}`;
  fullscreenMeta.textContent = `${deviceLabel} · ${Math.round(state.zoom * 100)}%`;
  heightResizer.setAttribute('aria-valuenow', String(state.previewHeight));
}

function syncModeButtons() {
  modeButtons.forEach((button) => {
    const active = button.dataset.mode === state.mode;
    button.setAttribute('aria-checked', String(active));
    button.tabIndex = active ? 0 : -1;
  });
}

function updateLineNumbers(textarea, lineNumbers) {
  const lines = Math.max(1, textarea.value.split('\n').length);
  lineNumbers.textContent = Array.from({ length: lines }, (_, index) => index + 1).join('\n');
  lineNumbers.scrollTop = textarea.scrollTop;
}

function createEditor(field) {
  const language = field.language || modes[state.mode].language;
  const wrapper = document.createElement('div');
  wrapper.className = hasPrism() ? 'editor-block' : 'editor-block no-highlight';

  const header = document.createElement('div');
  header.className = 'editor-field-header';
  const title = document.createElement('div');
  title.className = 'field-title';
  title.textContent = field.label;
  const actions = document.createElement('div');
  actions.className = 'field-actions';
  const count = document.createElement('span');
  count.className = 'field-count';
  const copy = document.createElement('button');
  copy.className = 'field-button';
  copy.type = 'button';
  copy.title = `Copy ${field.label}`;
  copy.setAttribute('aria-label', `Copy ${field.label}`);
  copy.textContent = '⧉';
  const clear = document.createElement('button');
  clear.className = 'field-button';
  clear.type = 'button';
  clear.title = `Clear ${field.label}`;
  clear.setAttribute('aria-label', `Clear ${field.label}`);
  clear.textContent = '⌫';
  actions.append(count, copy, clear);
  header.append(title, actions);

  const codeWrap = document.createElement('div');
  codeWrap.className = 'code-wrap';
  const lineNumbers = document.createElement('pre');
  lineNumbers.className = 'line-numbers';
  lineNumbers.setAttribute('aria-hidden', 'true');
  const stack = document.createElement('div');
  stack.className = 'editor-stack';
  const highlight = document.createElement('pre');
  highlight.className = `highlight-layer language-${language}${state.wrap ? '' : ' no-wrap'}`;
  highlight.setAttribute('aria-hidden', 'true');
  const code = document.createElement('code');
  code.className = `language-${language}`;
  highlight.append(code);
  const textarea = document.createElement('textarea');
  textarea.id = field.key;
  textarea.name = field.key;
  textarea.className = `code-input${state.wrap ? '' : ' no-wrap'}`;
  textarea.value = state[field.key];
  textarea.placeholder = field.placeholder;
  textarea.spellcheck = false;
  textarea.autocapitalize = 'off';
  textarea.autocomplete = 'off';
  textarea.wrap = state.wrap ? 'soft' : 'off';

  const syncField = () => {
    state[field.key] = textarea.value;
    count.textContent = `${textarea.value.length}`;
    code.innerHTML = `${highlightCode(textarea.value, language)}\n`;
    updateLineNumbers(textarea, lineNumbers);
    syncChrome();
    queueAutoPreview();
  };

  textarea.addEventListener('input', syncField);
  textarea.addEventListener('scroll', () => {
    lineNumbers.scrollTop = textarea.scrollTop;
    highlight.scrollTop = textarea.scrollTop;
    highlight.scrollLeft = textarea.scrollLeft;
  });
  textarea.addEventListener('keydown', (event) => {
    if (event.key === 'Tab') {
      event.preventDefault();
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      textarea.setRangeText('  ', start, end, 'end');
      syncField();
    }
  });
  copy.addEventListener('click', () => copyText(textarea.value, 'Copied'));
  clear.addEventListener('click', () => {
    textarea.value = '';
    syncField();
    textarea.focus();
    setStatus('Ready', 'ready');
    resetTextareaScroll();
  });

  stack.append(highlight, textarea);
  codeWrap.append(lineNumbers, stack);
  wrapper.append(header, codeWrap);
  syncField();
  return wrapper;
}

function renderEditors() {
  editorArea.replaceChildren(...modes[state.mode].fields.map(createEditor));
  syncModeButtons();
  syncChrome();
  resetTextareaScroll();
}

function setMode(mode) {
  if (!modes[mode]) return;
  state.mode = mode;
  renderEditors();
  setStatus('Ready', 'ready');
  if (state.autoPreview) queueAutoPreview();
}

function buildDocument(code) {
  return `<!doctype html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8" />\n  <meta name="viewport" content="width=device-width, initial-scale=1" />\n  <title>Widget Preview</title>\n  <style>html{box-sizing:border-box}*,*::before,*::after{box-sizing:inherit}body{margin:0;min-height:100vh;padding:16px;font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}</style>\n</head>\n<body>\n${code}\n</body>\n</html>`;
}

function createPreviewFrame(documentHtml) {
  const iframe = document.createElement('iframe');
  iframe.className = 'preview-frame';
  iframe.title = 'Widget Preview';
  iframe.setAttribute('sandbox', 'allow-forms allow-modals allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts');
  iframe.srcdoc = documentHtml;
  return iframe;
}

function renderPreview(documentHtml, target = previewStage) {
  target.replaceChildren(createPreviewFrame(documentHtml));
}

function hasLikelyVisibleOutput(code) {
  return code.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<style[\s\S]*?<\/style>/gi, '').replace(/<!--[\s\S]*?-->/g, '').trim().length > 0;
}

function runPreview() {
  const code = getSelectedCode();
  if (!code.trim()) {
    setStatus('Empty', 'empty');
    return;
  }
  setStatus('Rendering', 'rendering');
  previewStage.classList.add('is-refreshing');
  state.previewDocument = buildDocument(code);
  setTimeout(() => {
    renderPreview(state.previewDocument);
    previewStage.classList.remove('is-refreshing');
    setStatus(hasLikelyVisibleOutput(code) ? 'Rendered' : 'Empty', hasLikelyVisibleOutput(code) ? 'rendered' : 'empty');
    rememberRun();
    resetTextareaScroll();
  }, 120);
}

function reloadPreview() {
  if (!state.previewDocument) {
    setStatus('Empty', 'empty');
    return;
  }
  previewStage.classList.add('is-refreshing');
  setTimeout(() => {
    renderPreview(state.previewDocument);
    previewStage.classList.remove('is-refreshing');
    setStatus('Rendered', 'rendered');
    resetTextareaScroll();
  }, 120);
}

async function copyText(text, successMessage) {
  if (!text.trim()) {
    setStatus('Empty', 'empty');
    return;
  }
  try {
    await navigator.clipboard.writeText(text);
    setStatus(successMessage, 'rendered');
  } catch {
    const helper = document.createElement('textarea');
    helper.value = text;
    document.body.append(helper);
    helper.select();
    document.execCommand('copy');
    helper.remove();
    setStatus(successMessage, 'rendered');
  }
}

function copyCode() { copyText(getSelectedCode(), 'Copied'); }

function clearCurrentMode() {
  modes[state.mode].fields.forEach((field) => { state[field.key] = ''; });
  renderEditors();
  setStatus('Ready', 'ready');
  resetTextareaScroll();
  queueAutoPreview();
}

function resetPreview() {
  previewStage.innerHTML = '<div id="preview-empty" class="preview-empty"><span class="empty-icon" aria-hidden="true">▱</span><strong>Ready</strong><span>Run a preview to begin.</span></div>';
  setStatus('Ready', 'ready');
}

function resetAll() {
  Object.keys(state).forEach((key) => { if (typeof state[key] === 'string') state[key] = ''; });
  state.mode = DEFAULT_MODE;
  state.previewWidth = 'desktop';
  state.previewHeight = DEFAULT_HEIGHT;
  state.zoom = 1;
  state.wrap = true;
  state.autoPreview = false;
  state.recentRuns = [];
  previewHeightInput.value = String(DEFAULT_HEIGHT);
  wrapToggle.checked = true;
  autoPreviewToggle.checked = false;
  updateRecentRuns();
  renderEditors();
  applyPreviewSize();
  resetPreview();
}

function applyPreviewSize() {
  previewStage.classList.remove('preview-desktop', 'preview-tablet', 'preview-mobile');
  previewStage.classList.add(`preview-${state.previewWidth}`);
  previewStage.style.setProperty('--preview-height', `${state.previewHeight}px`);
  previewStage.style.setProperty('--preview-zoom', String(state.zoom));
  syncChrome();
}

function setViewport(width) {
  state.previewWidth = width;
  applyPreviewSize();
}

function updatePreviewHeight(value = Number(previewHeightInput.value)) {
  const height = Math.round(Number(value));
  if (!Number.isFinite(height) || height < MIN_HEIGHT || height > MAX_HEIGHT) {
    setStatus('Error', 'error');
    previewHeightInput.value = String(state.previewHeight);
    return;
  }
  state.previewHeight = height;
  previewHeightInput.value = String(height);
  applyPreviewSize();
}

function openFullscreen() {
  if (!state.previewDocument) {
    setStatus('Empty', 'empty');
    return;
  }
  lastFocusedElement = document.activeElement;
  renderPreview(state.previewDocument, fullscreenStage);
  fullscreenStage.style.setProperty('--preview-height', `${state.previewHeight}px`);
  fullscreenStage.style.setProperty('--preview-zoom', String(state.zoom));
  fullscreenStage.className = `fullscreen-stage preview-${state.previewWidth}`;
  fullscreenOverlay.hidden = false;
  document.body.style.overflow = 'hidden';
  syncChrome();
  closeFullscreenButton.focus();
}

function closeFullscreen() {
  fullscreenOverlay.hidden = true;
  fullscreenStage.replaceChildren();
  document.body.style.overflow = '';
  if (lastFocusedElement) lastFocusedElement.focus();
}

function fieldsHaveContent() {
  return Object.values(modes).some((mode) => mode.fields.some((field) => state[field.key].trim()));
}

function applyTemplate(key) {
  const template = templates[key];
  if (!template) return;
  if (fieldsHaveContent() && !confirm('Replace current code with this starter template?')) {
    templateSelect.value = '';
    return;
  }
  Object.values(modes).flatMap((mode) => mode.fields).forEach((field) => { state[field.key] = ''; });
  Object.assign(state, template.values);
  setMode(template.mode);
  templateSelect.value = '';
  setStatus('Ready', 'ready');
}

function rememberRun() {
  const snapshot = { label: `${modes[state.mode].label} · ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`, mode: state.mode, values: {} };
  modes[state.mode].fields.forEach((field) => { snapshot.values[field.key] = state[field.key]; });
  state.recentRuns = [snapshot, ...state.recentRuns].slice(0, 3);
  updateRecentRuns();
}

function updateRecentRuns() {
  recentRunsSelect.replaceChildren();
  if (!state.recentRuns.length) {
    recentRunsSelect.add(new Option('No runs yet', ''));
    recentRunsSelect.disabled = true;
    return;
  }
  recentRunsSelect.add(new Option('Restore recent…', ''));
  state.recentRuns.forEach((run, index) => recentRunsSelect.add(new Option(run.label, String(index))));
  recentRunsSelect.disabled = false;
}

function restoreRecent(index) {
  const run = state.recentRuns[Number(index)];
  if (!run) return;
  Object.assign(state, run.values);
  setMode(run.mode);
  recentRunsSelect.value = '';
  if (state.autoPreview) queueAutoPreview();
}

function setToolsOpen(open) {
  toolsMenu.classList.toggle('is-open', open);
  toolsButton.setAttribute('aria-expanded', String(open));
  if (!open) setOtherToolsOpen(false);
}

function setOtherToolsOpen(open) {
  otherTools.classList.toggle('is-open', open);
  otherToolsButton.setAttribute('aria-expanded', String(open));
}

function setMoreOpen(open) {
  morePopover.hidden = !open;
  moreToggle.setAttribute('aria-expanded', String(open));
}

Object.entries(templates).forEach(([key, template]) => templateSelect.add(new Option(template.label, key)));
Object.entries(modes).forEach(([key, mode]) => modeSelect.add(new Option(mode.fullLabel, key)));

modeButtons.forEach((button) => {
  button.addEventListener('click', () => setMode(button.dataset.mode));
  button.addEventListener('keydown', (event) => {
    const index = modeButtons.indexOf(button);
    const move = (offset) => {
      const next = modeButtons[(index + offset + modeButtons.length) % modeButtons.length];
      next.focus();
      setMode(next.dataset.mode);
    };
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') { event.preventDefault(); move(1); }
    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') { event.preventDefault(); move(-1); }
    if (event.key === 'Home') { event.preventDefault(); modeButtons[0].focus(); setMode(modeButtons[0].dataset.mode); }
    if (event.key === 'End') { event.preventDefault(); modeButtons.at(-1).focus(); setMode(modeButtons.at(-1).dataset.mode); }
  });
});

viewportButtons.forEach((button) => button.addEventListener('click', () => setViewport(button.dataset.width)));
mobileMenuToggle.addEventListener('click', () => {
  const isOpen = primaryMenu.classList.toggle('is-open');
  mobileMenuToggle.setAttribute('aria-expanded', String(isOpen));
});
toolsButton.addEventListener('click', () => setToolsOpen(!toolsMenu.classList.contains('is-open')));
toolsButton.addEventListener('focus', () => setToolsOpen(true));
toolsMenu.addEventListener('mouseenter', () => { clearTimeout(closeToolsTimer); setToolsOpen(true); });
toolsMenu.addEventListener('mouseleave', () => { closeToolsTimer = setTimeout(() => setToolsOpen(false), 350); });
otherToolsButton.addEventListener('click', () => setOtherToolsOpen(!otherTools.classList.contains('is-open')));
otherToolsButton.addEventListener('focus', () => setOtherToolsOpen(true));
otherTools.addEventListener('mouseenter', () => setOtherToolsOpen(true));
otherTools.addEventListener('mouseleave', () => setOtherToolsOpen(false));
moreToggle.addEventListener('click', () => setMoreOpen(morePopover.hidden));
runButton.addEventListener('click', runPreview);
reloadButton.addEventListener('click', reloadPreview);
$('browser-reload').addEventListener('click', reloadPreview);
copyButton.addEventListener('click', copyCode);
clearButton.addEventListener('click', clearCurrentMode);
resetButton.addEventListener('click', resetAll);
previewHeightInput.addEventListener('change', () => updatePreviewHeight());
modeSelect.addEventListener('change', (event) => setMode(event.target.value));
zoomSelect.addEventListener('change', (event) => { state.zoom = Number(event.target.value); applyPreviewSize(); });
wrapToggle.addEventListener('change', () => { state.wrap = wrapToggle.checked; renderEditors(); });
autoPreviewToggle.addEventListener('change', () => { state.autoPreview = autoPreviewToggle.checked; if (state.autoPreview) queueAutoPreview(); });
templateSelect.addEventListener('change', (event) => applyTemplate(event.target.value));
recentRunsSelect.addEventListener('change', (event) => restoreRecent(event.target.value));
['fullscreen-preview', 'toolbar-fullscreen', 'browser-fullscreen'].forEach((id) => $(id).addEventListener('click', openFullscreen));
closeFullscreenButton.addEventListener('click', closeFullscreen);

document.addEventListener('click', (event) => {
  if (!toolsMenu.contains(event.target)) setToolsOpen(false);
  if (!morePopover.contains(event.target) && event.target !== moreToggle) setMoreOpen(false);
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    if (!fullscreenOverlay.hidden) closeFullscreen();
    setToolsOpen(false);
    setMoreOpen(false);
    primaryMenu.classList.remove('is-open');
    mobileMenuToggle.setAttribute('aria-expanded', 'false');
  }
  const mod = event.ctrlKey || event.metaKey;
  if (!mod) return;
  if (event.key === 'Enter') { event.preventDefault(); runPreview(); }
  if (event.shiftKey && event.key.toLowerCase() === 'r') { event.preventDefault(); reloadPreview(); }
  if (event.shiftKey && event.key.toLowerCase() === 'c') { event.preventDefault(); copyCode(); }
});

workspace.addEventListener('pointermove', (event) => {
  const rect = workspace.getBoundingClientRect();
  const localX = ((event.clientX - rect.left) / rect.width) * 100;
  workspace.style.setProperty('--glow-local-x', `${localX}%`);
  document.body.style.setProperty('--glow-x', `${event.clientX}px`);
});

function startHeightResize(startY) {
  const startHeight = state.previewHeight;
  const move = (event) => updatePreviewHeight(Math.min(MAX_HEIGHT, Math.max(MIN_HEIGHT, startHeight + event.clientY - startY)));
  const stop = () => {
    document.removeEventListener('pointermove', move);
    document.removeEventListener('pointerup', stop);
    heightResizer.classList.remove('is-dragging');
    document.body.style.cursor = '';
  };
  heightResizer.classList.add('is-dragging');
  document.body.style.cursor = 'ns-resize';
  document.addEventListener('pointermove', move);
  document.addEventListener('pointerup', stop);
}
heightResizer.addEventListener('pointerdown', (event) => {
  if (matchMedia('(max-width: 1050px)').matches) return;
  startHeightResize(event.clientY);
});

panelDivider.addEventListener('pointerdown', () => {
  if (matchMedia('(max-width: 1050px)').matches) return;
  const rect = workspacePanels.getBoundingClientRect();
  const move = (moveEvent) => {
    const percent = ((moveEvent.clientX - rect.left) / rect.width) * 100;
    const left = Math.min(62, Math.max(34, percent));
    workspacePanels.style.gridTemplateColumns = `${left}fr 12px ${100 - left}fr`;
  };
  const stop = () => {
    document.removeEventListener('pointermove', move);
    document.removeEventListener('pointerup', stop);
    panelDivider.classList.remove('is-dragging');
    document.body.style.cursor = '';
  };
  panelDivider.classList.add('is-dragging');
  document.body.style.cursor = 'col-resize';
  document.addEventListener('pointermove', move);
  document.addEventListener('pointerup', stop);
});

panelDivider.addEventListener('keydown', (event) => {
  const current = Number((workspacePanels.style.gridTemplateColumns.match(/([\d.]+)fr/) || [0, 45])[1]);
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    event.preventDefault();
    const next = Math.min(62, Math.max(34, current + (event.key === 'ArrowRight' ? 3 : -3)));
    workspacePanels.style.gridTemplateColumns = `${next}fr 12px ${100 - next}fr`;
  }
});

currentYear.textContent = String(new Date().getFullYear());
window.addEventListener('load', renderEditors);
applyPreviewSize();
updateRecentRuns();
setStatus('Ready', 'ready');
