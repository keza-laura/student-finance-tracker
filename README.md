# Student Finance Tracker

A small, client-side app to track student finances (income, expenses, balances).

## Quick Start

- **Open:** Launch the app by opening [index.html](index.html) in your browser.
- **Seed Data:** Use [seed.json](seed.json) to preload sample transactions.

## Files

- **index:** [index.html](index.html) — main UI entry point.
- **Scripts:** [scripts/search.js](scripts/search.js), [scripts/state.js](scripts/state.js), [scripts/storage.js](scripts/storage.js), [scripts/ui.js](scripts/ui.js), [scripts/validators.js](scripts/validators.js) — app logic and helpers.
- **Styles:** [styles/main.css](styles/main.css) — styling for the UI.

## Usage

- Add transactions using the UI controls on the main page.
- The app stores data locally (see [scripts/storage.js](scripts/storage.js)).
- Use the search box to filter transactions (see [scripts/search.js](scripts/search.js)).

## Notes & Next Steps

- This is a static app; no backend required. Host on any static-file server if needed.
- Suggested improvements: CSV export/import, remote sync, enhanced validations.

## License

- Unlicensed — adapt freely for learning or personal projects.

## Chosen Theme

- **Minimal & Accessible:** clean typography, generous spacing, high-contrast colors for readability, and clear affordances for forms and buttons. Designed to be legible on small screens and usable with keyboard-only navigation.

## Key Features

- Quick-add transactions (income/expense)
- Persistent local storage (IndexedDB/localStorage via `scripts/storage.js`)
- Search & filter transactions
- Edit / delete transactions inline
- Lightweight, responsive UI suitable for mobile and desktop

## Regex Catalog (patterns + examples)

Note: JavaScript regex literals shown; use flags (`i`, `g`) as needed.

- Transaction ID

	- Pattern: `/^txn_[A-Za-z0-9_-]{4,}$/`
	- Example: `txn_0001`

- Amount (decimal with optional sign)

	- Pattern: `/^[+-]?\d{1,3}(?:,\d{3})*(?:\.\d{1,2})?$/`
	- Examples: `12.50`, `-5`, `1,234.99`

- Simple Currency Code (ISO 4217)

	- Pattern: `/^[A-Z]{3}$/`
	- Examples: `USD`, `EUR`, `JPY`

- Date (ISO YYYY-MM-DD)

	- Pattern: `/^\d{4}-\d{2}-\d{2}$/`
	- Examples: `2025-09-29`, `2026-02-20`

- ISO 8601 Datetime (basic validation)

	- Pattern: `/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/`
	- Example: `2025-09-29T12:34:56Z`

Adjust patterns in `scripts/validators.js` as needed for stricter validation.

## Keyboard Map (Shortcuts)

- `/` : Focus search input
- `N` or `A` : Open "Add Transaction" form
- `Enter` : Submit focused form control (or save when in modal)
- `Esc` : Close modal / cancel edit
- `ArrowUp` / `ArrowDown` : Navigate transaction list
- `Ctrl/Cmd + S` : Export or open export dialog (if implemented)

Shortcuts are implemented in `scripts/ui.js` when present; customize as needed.

## Accessibility Notes

- Semantic HTML: use landmarks and appropriate form labels
- Focus management: visible focus styles and logical tab order
- `aria-live` regions for success/error messages
- Keyboard operability: all interactive elements reachable and usable with keyboard only
- Color contrast: ensure text contrasts meet WCAG AA (4.5:1 for normal text)

Use browser accessibility tools (Lighthouse, Accessibility Inspector) to audit and iterate.

## How to Run Tests

- Manual test page: open [test.html](test.html) in your browser and follow the test scenarios described there.
- Local static server (recommended for accurate file loading):

```bash
# from the project root
python -m http.server 8000
# then open http://localhost:8000/test.html
```

- Suggested automated tests (optional):
	- Add end-to-end tests with Playwright or Cypress. Example (Playwright):

```bash
npm init -y
npm i -D @playwright/test
npx playwright test --project=chromium
```

Include test scenarios that create/edit/delete transactions, verify storage, and exercise keyboard shortcuts.
