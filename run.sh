#!/bin/bash
# Run script for BPHS BTR Prototype

set -euo pipefail

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
BACKEND_LOG_LEVEL_RAW="${BACKEND_LOG_LEVEL:-debug}"
FRONTEND_LOG_LEVEL="${FRONTEND_LOG_LEVEL:-info}"
# uvicorn expects lowercase log levels; normalize to keep CLI happy
BACKEND_LOG_LEVEL="$(printf '%s' "$BACKEND_LOG_LEVEL_RAW" | tr '[:upper:]' '[:lower:]')"
export LOG_LEVEL="${LOG_LEVEL:-$BACKEND_LOG_LEVEL}"
export UVICORN_ACCESS_LOG="${UVICORN_ACCESS_LOG:-1}"
export VITE_VERBOSE_LOGGING="${VITE_VERBOSE_LOGGING:-true}"

# Flush logs on every restart
BACKEND_LOG="$LOG_DIR/backend.log"
FRONTEND_LOG="$LOG_DIR/frontend.log"
: > "$BACKEND_LOG"
: > "$FRONTEND_LOG"

echo "🧹 Cleared logs: $BACKEND_LOG, $FRONTEND_LOG"
echo "🔍 Verbose logging -> backend: $BACKEND_LOG_LEVEL, frontend: $FRONTEND_LOG_LEVEL (VITE_VERBOSE_LOGGING=$VITE_VERBOSE_LOGGING)"

ensure_port_free() {
    # Attempt graceful termination on the given TCP port, then force-kill if needed.
    local port="$1"
    local name="$2"
    local pids
    pids=$(lsof -ti tcp:"$port" 2>/dev/null || true)
    if [ -n "$pids" ]; then
        echo "⚠️  Port $port ($name) is in use by PID(s): $pids. Stopping them..."
        kill $pids 2>/dev/null || true
        sleep 1
        local still
        still=$(lsof -ti tcp:"$port" 2>/dev/null || true)
        if [ -n "$still" ]; then
            echo "⚠️  Port $port still busy; forcing termination (SIGKILL) on: $still"
            kill -9 $still 2>/dev/null || true
            sleep 0.5
        fi
    fi
}

FRONTEND_PORT=5173
ALTERNATE_FRONTEND_PORT=5174
BACKEND_PORT=8000

# Make sure previously crashed servers are not holding ports
ensure_port_free "$BACKEND_PORT" "backend"
ensure_port_free "$FRONTEND_PORT" "frontend (primary)"
ensure_port_free "$ALTERNATE_FRONTEND_PORT" "frontend (fallback)"

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

BACKEND_PID=0
FRONTEND_PID=0
trap 'echo "🛑 Stopping servers..."; kill ${BACKEND_PID:-0} ${FRONTEND_PID:-0} 2>/dev/null' EXIT

echo "🚀 Starting BPHS BTR Prototype servers (frontend + backend)..."

# Start backend (unbuffered for immediate flush)
PYTHONUNBUFFERED=1 maybe_stdbuf uvicorn backend.main:app --reload --host 127.0.0.1 --port "$BACKEND_PORT" \
  --log-level "$BACKEND_LOG_LEVEL" --access-log &
BACKEND_PID=$!
echo "📜 Backend logs: $BACKEND_LOG (pid: $BACKEND_PID)"

# Start frontend dev server (Vite) with line-buffered output
(
  cd frontend-react || exit 1
  maybe_stdbuf npm run dev -- --host --port "$FRONTEND_PORT" --clearScreen false --logLevel "$FRONTEND_LOG_LEVEL"
) >"$FRONTEND_LOG" 2>&1 &
FRONTEND_PID=$!
echo "📜 Frontend logs: $FRONTEND_LOG (pid: $FRONTEND_PID)"

echo "🌐 Frontend: http://localhost:${FRONTEND_PORT}"
echo "🩺 Backend API: http://127.0.0.1:8000"
echo "⌛ Press Ctrl+C to stop. Logs are streaming to $LOG_DIR/"

wait
