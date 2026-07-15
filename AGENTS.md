# AGENTS.md

## Repository Purpose

This repository contains Zapora's standalone **HTML & Widget Preview** tool, deployed as a static GitHub Pages site.

The tool lets users paste widget, embed, iframe, HTML, CSS, and JavaScript snippets and render them inside an in-page preview without leaving the editor.

Live deployment:

- `https://akloso.github.io/HTML---Widget-Preview/`

## Technology and File Scope

This project intentionally uses plain web technologies:

- `index.html`
- `styles.css`
- `script.js`
- `README.md`

Do not introduce React, Vite, Tailwind, npm, a backend, a build step, or a package manager unless the user explicitly changes the architecture.

Pinned external browser libraries may be used only when they provide clear value, are loaded from a reputable CDN, use an exact version, and have a graceful fallback. Prism.js `1.29.0` is currently used for syntax highlighting.

## Product Source of Truth

The main Zapora repository is:

- `akloso/whatsapp-link-generator`

When matching Zapora branding or shared navigation, inspect these source files first:

- `src/components/Header.tsx`
- `src/components/Footer.tsx`
- `src/index.css`
- `src/App.tsx`
- `public/logo.svg`

The React and Tailwind source cannot be pasted unchanged into this static project. Port its structure, spacing, behavior, typography, colors, focus states, and responsive behavior faithfully into HTML, CSS, and JavaScript.

Do not invent a different Zapora header or footer when the main repository is available.

## Protected Functionality

Preserve all five input modes:

1. Combined Code
2. DIV + Script
3. Button + Script
4. Iframe Only
5. HTML + CSS + JavaScript

Preserve, unless explicitly changed:

- in-page preview through `iframe.srcdoc`
- Run Preview
- Reload Preview
- Fullscreen Preview
- desktop, tablet, and mobile preview widths
- zoom controls
- custom preview height
- draggable editor/preview divider
- draggable preview height
- templates
- Auto Preview
- in-memory recent runs
- per-field Copy and Clear
- Copy Code, Clear, and Reset
- keyboard shortcuts
- syntax highlighting
- line numbers
- Tab indentation
- wrap toggle
- responsive stacking

Simplify presentation without removing capability.

## Security and Privacy Constraints

These rules are non-negotiable unless the user explicitly approves an architectural change:

- Never use `window.open()` for preview execution.
- Never replace or navigate the parent page when running user code.
- Render user code only inside the sandboxed preview iframe.
- Do not persist pasted code in `localStorage`, `sessionStorage`, cookies, analytics, a backend, or external services.
- Do not log pasted code.
- Do not add tracking.
- Do not silently weaken the iframe sandbox.
- Do not expose secrets, tokens, or credentials.
- Keep GitHub Pages asset paths valid.

## Visual and UX Direction

The experience should be:

- minimal in wording
- light rather than dark-heavy
- modern and professional
- lively through interaction rather than extra explanation
- consistent with Zapora
- responsive and accessible

Use Zapora emerald as the primary brand accent. Supporting mode accents may include blue, violet, amber, and cyan when they form one coherent interaction system.

Prefer:

- clean white and soft-slate surfaces
- clear visual hierarchy
- light IDE-style editing
- restrained shadows
- compact controls
- meaningful hover, focus, pressed, loading, and transition states
- mode-aware accent changes
- subtle ambient interactions
- strong preview prominence

Avoid:

- excessive helper copy
- large areas of bold black text
- dark code-input surfaces unless explicitly requested
- repeated cards and nested boxes
- heavy glassmorphism
- neon borders
- distracting infinite animations
- unnecessary gradient text
- decorative motion without a UX purpose
- clutter caused by showing every advanced option at once

Use `prefers-reduced-motion` for all nonessential motion.

## Codex Working Standard

Do not treat tasks as mechanical checklists.

Before editing:

1. Read this file.
2. Inspect the current implementation and recent changes.
3. Identify the product goal, protected behavior, and source-of-truth files.
4. Confirm the branch is based on the latest `main` before making large overlapping changes.

Use independent product and engineering judgment. You may add thoughtful improvements that were not explicitly listed when they materially improve usability, clarity, responsiveness, accessibility, performance, maintainability, or visual quality.

Creative freedom is allowed, but every extra enhancement must:

- solve a real UX or engineering problem
- fit the existing product and brand
- preserve protected functionality
- remain performant
- remain accessible
- avoid unnecessary dependencies
- avoid clutter and gimmicks

For UI/UX work, combine related requirements into one coherent visual and interaction system rather than implementing disconnected effects.

Do not stop because the code runs. Refine the actual experience.

## Required Quality Passes

Before completion, perform separate passes for:

1. Functional correctness
2. Architecture and maintainability
3. Visual hierarchy and typography
4. Interaction and motion
5. Responsive behavior
6. Accessibility
7. Performance, privacy, and security
8. Final rendered-product refinement

Correct obvious weaknesses discovered during these passes rather than only reporting them.

## Responsive Requirements

Review at minimum:

- 320px
- 360px
- 390px
- 430px
- 768px
- 1024px
- desktop

Ensure:

- no horizontal page scrolling
- no clipped controls or menus
- readable code
- synchronized syntax layer, textarea, gutter, and scrolling
- intentional mobile actions
- usable preview sizing
- correct header and footer behavior

## Accessibility Requirements

Preserve or improve:

- semantic HTML
- visible labels where meaning is otherwise unclear
- accessible names for icon-only buttons
- keyboard operation
- visible focus states
- correct ARIA states
- `aria-live` feedback
- iframe title
- fullscreen Escape behavior
- sufficient contrast
- reduced-motion support
- practical touch targets

## Validation

Run all applicable checks:

- `node --check script.js`
- HTML parser or equivalent markup smoke test
- local static server smoke test
- searches confirming no `window.open`, storage persistence, accidental logging, or unwanted new-tab preview behavior
- functional checks for all five modes
- browser interaction and console review when a browser is available

When graphical browser testing is unavailable, state that clearly. Do not claim visual or breakpoint validation that was not performed.

## Branch and Merge Hygiene

- Start new work from the latest `main`.
- Use a focused feature branch or Codex branch.
- Before opening or updating a PR, fetch or incorporate current `main` when the same files have recently changed.
- Do not overwrite newer work from another merged PR.
- Resolve conflicts deliberately and report which version was preserved.
- Do not claim a PR exists unless it exists on GitHub.
- Do not merge into `main` unless the user explicitly requests the merge.

## Completion Report

Report:

- branch and commit
- files changed
- functionality preserved
- improvements introduced
- tests run and results
- browser review performed or unavailable
- responsive widths actually checked
- accessibility checks
- remaining limitations

Never describe an implementation as exact, tested, secure, or visually verified unless the evidence supports that claim.

## Maintaining This File

Do not rewrite this file during ordinary feature work.

Update it only when the repository's architecture, product constraints, shared source-of-truth files, deployment model, security rules, or standing quality requirements materially change.