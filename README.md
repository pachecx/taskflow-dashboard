# TaskFlow

TaskFlow is a responsive project and task management dashboard for small teams. It brings project progress, team activity, and upcoming work into one calm, practical workspace.

## Screenshots

Add current product screenshots to `screenshots/` before publishing the portfolio project.

| Dashboard                   | Projects                   |
| --------------------------- | -------------------------- |
| `screenshots/dashboard.png` | `screenshots/projects.png` |

## Live project

Not published yet. Add the deployed URL here after deploying the project (for example, with Vercel or Netlify).

## Features

- Simulated sign-in with email and password validation, password visibility, and a remember-me option.
- Responsive workspace navigation, global quick links, notification panel, and persistent light/dark theme.
- Dashboard metrics, responsive task charts, and a recent projects table.
- Project search, status filters, sorting, pagination, creation modal, and project details.
- Task search, status and priority filters, pagination, and live status updates.
- Team directory, deadline calendar, and personal notification preferences.
- Editable user profile with avatar preview and local persistence.
- Loading skeletons, error and empty states, form validation, and success feedback.
- Mock API isolated from presentation code and queried through TanStack Query.

## Tech stack

- React 19, TypeScript, and Vite
- Tailwind CSS 4
- React Router 7
- TanStack Query 5
- Recharts
- Lucide React

## Project structure

```text
src/
├── assets/
├── components/
│   ├── dashboard/
│   ├── layout/
│   └── ui/
├── data/
├── hooks/
├── layouts/
├── pages/
│   ├── Calendar/
│   ├── Dashboard/
│   ├── Login/
│   ├── Projects/
│   ├── Settings/
│   ├── Tasks/
│   ├── Team/
│   └── _shared/
├── services/
├── types/
├── utils/
├── App.tsx
├── index.css
└── main.tsx
```

Page entry points live in their corresponding directories. Shared project, task, team, calendar, and settings page components are kept in `pages/_shared/WorkPages.tsx` to avoid duplicating their common table and form behavior.

## Run locally

Requirements: Node.js 20.19+ or 22.12+ and npm.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite. To enter the demo workspace, use any valid email address and a password with at least six characters.

## Quality checks

```bash
npm run lint
npm run build
```

## Data layer

The mock API in `src/services/api.ts` simulates network latency and keeps project creation and task status changes in memory for the current session. `src/data.ts` contains the demo workspace data. TanStack Query handles request caching, loading, errors, and invalidation.

## Deployment

Build with `npm run build` and deploy the generated `dist/` directory to a static hosting provider. Configure the host to serve `index.html` as a fallback for client-side routes.
