# Tests for config module

"""Tests for the configuration module."""

import pytest
import os
from backend import config


class TestConfigLoading:
    """Tests for configuration loading."""
    
    def test_opencage_api_key_exists(self):
        """Test that OPENCAGE_API_KEY can be accessed."""
        # Should not raise an error
        api_key = config.OPENCAGE_API_KEY
        assert api_key is None or isinstance(api_key, str)
    
    def test_ephe_path_exists(self):
        """Test that EPHE_PATH can be accessed."""
        ephe_path = config.EPHE_PATH
        assert ephe_path is None or isinstance(ephe_path, str)
    
    def test_host_default(self):
        """Test that HOST has a default value."""
        assert isinstance(config.HOST, str)
        assert len(config.HOST) > 0
    
    def test_port_default(self):
        """Test that PORT has a default value."""
        assert isinstance(config.PORT, int)
        assert config.PORT > 0
    
    def test_debug_default(self):
        """Test that DEBUG has a default value."""
        assert isinstance(config.DEBUG, bool)
    
    def test_environment_default(self):
        """Test that ENVIRONMENT has a default value."""
        assert isinstance(config.ENVIRONMENT, str)
        assert config.ENVIRONMENT in ['development', 'staging', 'production']
    
    def test_log_level_default(self):
        """Test that LOG_LEVEL has a default value."""
        assert isinstance(config.LOG_LEVEL, str)
        assert config.LOG_LEVEL in ['DEBUG', 'INFO', 'WARNING', 'ERROR', 'CRITICAL']
    
    def test_cors_origins_is_list(self):
        """Test that CORS_ORIGINS is a list."""
        assert isinstance(config.CORS_ORIGINS, list)
    
    def test_cors_allow_methods_is_list(self):
        """Test that CORS_ALLOW_METHODS is a list."""
        assert isinstance(config.CORS_ALLOW_METHODS, list)
        assert len(config.CORS_ALLOW_METHODS) > 0
    
    def test_cors_allow_headers_is_list(self):
        """Test that CORS_ALLOW_HEADERS is a list."""
        assert isinstance(config.CORS_ALLOW_HEADERS, list)
        assert len(config.CORS_ALLOW_HEADERS) > 0
    
    def test_app_name_default(self):
        """Test that APP_NAME has a default value."""
        assert isinstance(config.APP_NAME, str)
        assert len(config.APP_NAME) > 0
    
    def test_app_version_default(self):
        """Test that APP_VERSION has a default value."""
        assert isinstance(config.APP_VERSION, str)
        assert len(config.APP_VERSION) > 0
    
    def test_api_prefix_default(self):
        """Test that API_PREFIX has a default value."""
        assert isinstance(config.API_PREFIX, str)
        assert config.API_PREFIX.startswith('/')
    
    def test_request_timeout_default(self):
        """Test that REQUEST_TIMEOUT has a default value."""
        assert isinstance(config.REQUEST_TIMEOUT, float)
        assert config.REQUEST_TIMEOUT > 0
    
    def test_max_request_size_default(self):
        """Test that MAX_REQUEST_SIZE has a default value."""
        assert isinstance(config.MAX_REQUEST_SIZE, int)
        assert config.MAX_REQUEST_SIZE > 0

