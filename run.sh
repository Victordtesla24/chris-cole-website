#!/bin/bash
# Run script for BPHS BTR Prototype

# Activate virtual environment
if [ -d "venv" ]; then
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

# Start the server
echo "🚀 Starting BPHS BTR Prototype server..."
uvicorn backend.main:app --reload --host 127.0.0.1 --port 8000

