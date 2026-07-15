# HTML & Widget Preview | Zapora

A lightweight GitHub Pages workspace for pasting HTML, iframe, form, button, and JavaScript widget snippets and previewing them instantly in-page.

## Features

- Plain HTML, CSS, and JavaScript; no build step and no npm dependencies.
- Five modes: Combined, DIV + Script, Button + Script, Iframe, and HTML/CSS/JS.
- In-page iframe preview using `srcdoc`; the tool does not open a preview tab or replace the parent page.
- Device presets, zoom, fullscreen preview, custom height, draggable panel divider, and draggable preview height.
- Light code editor with line numbers, Tab indentation, wrap toggle, field copy/clear, and Prism-powered syntax highlighting.
- More menu for templates, Auto Preview, recent runs, wrap control, and shortcut help.
- Session recent runs are memory-only and disappear on reload.

## Privacy

User code stays in the browser and is rendered only inside the preview iframe. The project does not add tracking, backend calls, cookies, or storage persistence.

## GitHub Pages URL

https://akloso.github.io/HTML---Widget-Preview/

## Files

- `index.html` — Zapora header/footer translation, workspace markup, Prism CDN scripts, preview shell, and fullscreen dialog.
- `styles.css` — Zapora-aligned typography, light workspace visual system, editor highlighting theme, responsive layout, and interaction states.
- `script.js` — mode state, editor synchronization, Prism fallback, iframe `srcdoc` rendering, More popover, templates, auto preview, recent runs, device/zoom/fullscreen controls, and keyboard shortcuts.
