# HTML & Widget Preview | Zapora

HTML & Widget Preview is a static GitHub Pages tool for checking HTML, iframe, form, button, and JavaScript widget snippets directly on the page.

## Purpose

Paste HTML, iframe, form, or JavaScript widget code and preview it directly on the page. The tool renders user code in an isolated in-page iframe so the editor interface remains available while testing embeds, marketing forms, buttons, script widgets, and hand-written HTML/CSS/JavaScript snippets.

## GitHub Pages URL

https://akloso.github.io/HTML---Widget-Preview/

## Supported input modes

1. Combined Code
2. DIV + Script
3. Button + Script
4. Iframe Only
5. HTML + CSS + JavaScript

## In-page preview behavior

- Run Preview combines the active input mode and renders it in the preview panel.
- Reload Preview recreates the iframe from the last rendered document.
- Copy Code copies the final combined code for the active mode.
- Clear removes only the current mode's inputs.
- Reset clears all modes, restores Combined Code, and empties the preview panel.
- Code is not saved to localStorage, sessionStorage, cookies, analytics, or a backend.

## File structure

- `index.html` — semantic page structure, SEO metadata, Zapora header/footer, mode controls, editor area, action buttons, status region, and in-page preview panel
- `styles.css` — responsive Zapora-style layout, cards, navigation, preview sizing, accessible focus states, and mobile-safe styling
- `script.js` — mode state, editor rendering, preview document generation, iframe rendering/reloading, copy, clear, reset, status, and responsive menu behavior
- `README.md` — project overview, usage notes, file structure, and technology constraints

## Technology

This project intentionally uses only plain HTML, CSS, and JavaScript.

- No dependencies
- No installation required
- No package manager setup
- No React, Vite, Tailwind, Bootstrap, or external UI libraries
- No backend, analytics, environment variables, cookies, localStorage, or sessionStorage
