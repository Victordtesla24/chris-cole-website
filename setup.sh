#!/bin/bash
# Setup script for BPHS BTR Prototype - Local Development

set -e

echo "🚀 Setting up BPHS BTR Prototype..."

# Check Python version
echo "📋 Checking Python version..."
python_version=$(python3 --version 2>&1 | awk '{print $2}' | cut -d. -f1,2)
required_version="3.10"

if [ "$(printf '%s\n' "$required_version" "$python_version" | sort -V | head -n1)" != "$required_version" ]; then
    echo "❌ Error: Python 3.10 or higher is required. Found: $python_version"
    exit 1
fi
echo "✅ Python version: $python_version"

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "🔌 Activating virtual environment..."
source venv/bin/activate

# Upgrade pip
echo "⬆️  Upgrading pip..."
pip install --upgrade pip setuptools wheel

# Install dependencies
echo "📥 Installing dependencies..."
pip install -r requirements.txt

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file template..."
    cat > .env << EOF
# OpenCage Geocoding API Key
# Get your free API key from: https://opencagedata.com/api
OPENCAGE_API_KEY=your_opencage_api_key_here

# Swiss Ephemeris Data Path (optional)
EPHE_PATH=

# Server Configuration
HOST=127.0.0.1
PORT=8000
DEBUG=false
ENVIRONMENT=development
LOG_LEVEL=INFO
EOF
    echo "⚠️  Please edit .env file and add your OPENCAGE_API_KEY"
else
    echo "✅ .env file already exists"
fi

# Run tests
echo "🧪 Running tests..."
pytest tests/ -v || echo "⚠️  Some tests failed, but setup continues..."

echo ""
echo "✅ Setup complete!"
echo ""
echo "To start the server:"
echo "  source venv/bin/activate"
echo "  uvicorn backend.main:app --reload"
echo ""
echo "Or use the run script:"
echo "  ./run.sh"
echo ""

