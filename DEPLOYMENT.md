# Deployment Notes

This project runs a FastAPI backend with Swiss Ephemeris and a static frontend
build served from `frontend-react/dist`. To deploy:

1. Install dependencies from `requirements.txt` and ensure Swiss Ephemeris data
   files are available at `EPHE_PATH` (environment variable).
2. Build the React assets inside `frontend-react/` (`npm install && npm run build`)
   so `frontend-react/dist` exists before starting the server.
3. Launch the app with the provided `Procfile` entry (`web: uvicorn backend.main:app`).

For production, set `OPENCAGE_API_KEY`, `LOG_LEVEL`, and `EPHE_PATH` in the
environment, and point logs to persistent storage if needed. Ensure time zone
and location inputs remain accurate to stay aligned with Brihat Parashara Hora
Shastra rules.
