# BTR Frontend (React + TypeScript + Vite)

This app is a thin UI over the BPHS BTR backend. The backend serves the production build from `frontend-react/dist` and expects the API at `http://localhost:8000/api`.

## Scripts
- `npm run dev` – local dev server (Vite, default `http://localhost:5173` with `/api` proxy to `http://localhost:8000`)
- `npm run build` – production build consumed by FastAPI
- `npm run preview` – preview the built assets locally

## Notes
- Node.js 18+ recommended (matches repository root docs).
- The backend process will fail to start if `dist/index.html` is missing; run `npm install && npm run build` before starting the API in production environments.
