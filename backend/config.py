# Configuration module

"""Configuration management for BPHS BTR Prototype.

This module loads environment variables from .env file and provides
configuration values to the application.
"""

import os
from pathlib import Path
from typing import Optional, List

try:
    from dotenv import load_dotenv
    # Load environment variables from .env file
    env_path = Path(__file__).parent.parent / '.env'
    load_dotenv(dotenv_path=env_path)
except ImportError:
    # python-dotenv not installed, fall back to system environment variables
    pass

# ----------------------------------------------------------------------------
# API Keys and External Services
# ----------------------------------------------------------------------------

OPENCAGE_API_KEY: Optional[str] = os.getenv('OPENCAGE_API_KEY')

# ----------------------------------------------------------------------------
# Swiss Ephemeris Configuration
# ----------------------------------------------------------------------------

EPHE_PATH: Optional[str] = os.getenv('EPHE_PATH')

# ----------------------------------------------------------------------------
# FastAPI/Uvicorn Server Configuration
# ----------------------------------------------------------------------------

HOST: str = os.getenv('HOST', '127.0.0.1')
PORT: int = int(os.getenv('PORT', '8000'))
DEBUG: bool = os.getenv('DEBUG', 'false').lower() in ('true', '1', 'yes', 'on')
ENVIRONMENT: str = os.getenv('ENVIRONMENT', 'development')
LOG_LEVEL: str = os.getenv('LOG_LEVEL', 'INFO')

# ----------------------------------------------------------------------------
# CORS Configuration
# ----------------------------------------------------------------------------

CORS_ORIGINS: List[str] = [
    origin.strip()
    for origin in os.getenv('CORS_ORIGINS', 'http://localhost:3000,http://127.0.0.1:3000').split(',')
    if origin.strip()
]
CORS_ALLOW_CREDENTIALS: bool = os.getenv('CORS_ALLOW_CREDENTIALS', 'true').lower() in ('true', '1', 'yes', 'on')
CORS_ALLOW_METHODS: List[str] = [
    method.strip()
    for method in os.getenv('CORS_ALLOW_METHODS', 'GET,POST,PUT,DELETE,OPTIONS').split(',')
    if method.strip()
]
CORS_ALLOW_HEADERS: List[str] = [
    header.strip()
    for header in os.getenv('CORS_ALLOW_HEADERS', 'Content-Type,Authorization,X-Requested-With').split(',')
    if header.strip()
]

# ----------------------------------------------------------------------------
# Application Settings
# ----------------------------------------------------------------------------

APP_NAME: str = os.getenv('APP_NAME', 'BPHS BTR Prototype')
APP_VERSION: str = os.getenv('APP_VERSION', '1.0.0')
API_PREFIX: str = os.getenv('API_PREFIX', '/api')
REQUEST_TIMEOUT: float = float(os.getenv('REQUEST_TIMEOUT', '30.0'))
MAX_REQUEST_SIZE: int = int(os.getenv('MAX_REQUEST_SIZE', '10485760'))
