# Student Finance Tracker

## 1. Theme

Student Finance Tracker — a simple budgeting tool for students.

## 2. Purpose

Help students track spending and build budgeting habits with minimal friction.

## Sketches

- Dashboard: balance at top, quick add button, recent transactions list, category sparklines.

	[Top] Balance | Add [+]
	-------------------------
	Recent transactions
	- Lunch — $12.50 — Food

- Add Transaction modal: fields for description, amount, currency, category (dropdown), date, save/cancel.

- Transactions view: searchable, sortable list with filters (date range, category) and inline edit/delete.

- Category/Budgets view: list of categories with monthly budgets and progress bars.

- Settings: export/import JSON, currency selection, accessibility toggles (reduce motion, high contrast).

## Wireframe

student-finance-tracker/
│
├── index.html
├── tests.html
├── seed.json
│
├── styles/
│   └── main.css
│
├── scripts/
│   ├── state.js
│   ├── storage.js
│   ├── validators.js
│   ├── search.js
│   └── ui.js
│
└── README.md



## 3. Data Models

Transaction (example):

```json
{
	"id": "txn_0001",
	"description": "Lunch",
	"amount": 12.50,
	"currency": "USD",
	"category": "cat_food",
	"date": "2025-09-29",
	"createdAt": "2025-09-29T12:34:56Z",
	"updatedAt": "2025-09-29T12:34:56Z"
}
```

Category (example):

```json
{
	"id": "cat_food",
	"name": "Food",
	"monthlyBudget": 200.00
}
```

Notes:
- `id`: string, unique identifier
- `amount`/`monthlyBudget`: numbers (decimals allowed)
- `date`, `createdAt`, `updatedAt`: ISO 8601 strings

## 4. Accessibility Plan

- Skip to content link: add a visible "Skip to content" link at the top of pages.
- Visible focus styles: ensure high-contrast focus outlines for all interactive elements.
- `aria-live` region for alerts: use a polite region for non-blocking success/error/capacity messages.
- Keyboard navigation: all features (navigation, forms, add/edit transactions, modals) must be operable via keyboard only.

## 5. Breakpoints

- 360px — Mobile
- 768px — Tablet
- 1024px — Desktop
