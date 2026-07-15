# HTML & Widget Preview | Zapora

HTML & Widget Preview is a dependency-free GitHub Pages workspace for testing HTML, iframe, form, button, and JavaScript widget snippets directly on the page.

## What it does

- Provides a connected editor-and-preview workspace built with plain HTML, CSS, and JavaScript.
- Keeps preview rendering in an isolated in-page iframe; it does not open new tabs or replace the current page.
- Supports five input modes: Combined Code, DIV + Script, Button + Script, Iframe Only, and HTML + CSS + JavaScript.
- Includes Desktop, Tablet, and Mobile device presets with visible dimensions.
- Adds preview zoom controls for 75%, 100%, and 125%.
- Offers fullscreen preview with Escape-to-close behavior.
- Includes line numbers, tab indentation, line-wrap control, field-level copy/clear actions, and character counts.
- Provides starter templates for Basic HTML, DIV + Script Widget, Popup Button Widget, Iframe Embed, and Contact Form.
- Supports manual Run Preview plus optional debounced Auto Preview.
- Keeps the last three successful runs in memory only for quick restore.

## Privacy and persistence

User code stays in the browser and is rendered only inside the preview iframe. The tool does not use browser storage, cookies, tracking, a backend, or any persistence after reload.

## GitHub Pages URL

https://akloso.github.io/HTML---Widget-Preview/

## File structure

- `index.html` — semantic page structure, SEO metadata, Zapora header/footer, workspace controls, editor, actions, status regions, and in-page preview shell.
- `styles.css` — responsive Zapora visual system, connected workspace layout, editor surface, preview browser frame, focus states, motion, and mobile behavior.
- `script.js` — mode state, editor rendering, line numbers, templates, iframe `srcdoc` rendering, device sizing, zoom, fullscreen, auto preview, recent runs, copy/clear/reset, and shortcuts.
- `README.md` — concise project overview and technology constraints.

## Technology

This project intentionally uses only plain HTML, CSS, and JavaScript.

- No dependencies
- No installation required
- No package manager setup
- No React, Vite, Tailwind, Bootstrap, or external UI libraries
- No backend, tracking, environment variables, cookies, or browser storage persistence
