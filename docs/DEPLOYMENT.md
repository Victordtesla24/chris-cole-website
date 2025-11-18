# Deployment Guide – BPHS BTR Prototype

## Prerequisites
- Python 3.10+ (matches `runtime.txt`)
- Node.js 18+ (for building the React frontend)
- OpenCage API key for geocoding
- **Build artefact required**: `frontend-react/dist` must exist before the backend process starts (the FastAPI app raises if the build is missing).

## Environment Variables
- `OPENCAGE_API_KEY` (required) – OpenCage Geocoding key.
- `EPHE_PATH` (optional) – Custom Swiss Ephemeris data path.
- `PORT` (platform provided) – Bind port for uvicorn/ASGI.

## Processes
- Backend: `uvicorn backend.main:app --host 0.0.0.0 --port $PORT`
- Frontend: Build with `npm run build` inside `frontend-react/`. Serve `frontend-react/dist` via your host or behind the backend static mount.

## Files
- `Procfile` – Declares gunicorn/uvicorn command.
- `runtime.txt` – Python version pin.
- `requirements.txt` – Backend dependencies.
- `frontend-react/` – React app; run `npm run build`.
