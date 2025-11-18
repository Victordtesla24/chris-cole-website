#!/bin/bash
# Run script for BPHS BTR Prototype

# Activate virtual environment
if [ -d "venv" ]; then
    # shellcheck disable=SC1091
    source venv/bin/activate
else
    echo "❌ Virtual environment not found. Run ./setup.sh first."
    exit 1
fi

# Check for .env file
if [ ! -f ".env" ]; then
    echo "⚠️  Warning: .env file not found. Some features may not work."
    echo "   Run ./setup.sh to create a template .env file."
fi

LOG_DIR="logs"
mkdir -p "$LOG_DIR"

# Flush logs on every restart
BACKEND_LOG="$LOG_DIR/backend.log"
FRONTEND_LOG="$LOG_DIR/frontend.log"
: > "$BACKEND_LOG"
: > "$FRONTEND_LOG"

echo "🧹 Cleared logs: $BACKEND_LOG, $FRONTEND_LOG"

has_stdbuf=false
if command -v stdbuf >/dev/null 2>&1; then
    has_stdbuf=true
fi
# Helper to optionally wrap commands with stdbuf for line-buffered output
maybe_stdbuf() {
    if [ "$has_stdbuf" = true ]; then
        stdbuf -oL -eL "$@"
    else
        "$@"
    fi
}

trap 'echo "🛑 Stopping servers..."; kill ${BACKEND_PID:-0} ${FRONTEND_PID:-0} 2>/dev/null' EXIT

echo "🚀 Starting BPHS BTR Prototype servers (frontend + backend)..."

# Start backend (unbuffered for immediate flush)
PYTHONUNBUFFERED=1 maybe_stdbuf uvicorn backend.main:app --reload --host 127.0.0.1 --port 8000 \
  >"$BACKEND_LOG" 2>&1 &
BACKEND_PID=$!
echo "📜 Backend logs: $BACKEND_LOG (pid: $BACKEND_PID)"

# Start frontend dev server (Vite) with line-buffered output
(
  cd frontend-react || exit 1
  maybe_stdbuf npm run dev -- --host --port 5173
) >"$FRONTEND_LOG" 2>&1 &
FRONTEND_PID=$!
echo "📜 Frontend logs: $FRONTEND_LOG (pid: $FRONTEND_PID)"

echo "🌐 Frontend: http://localhost:5173"
echo "🩺 Backend API: http://127.0.0.1:8000"
echo "⌛ Press Ctrl+C to stop. Logs are streaming to $LOG_DIR/"

wait
