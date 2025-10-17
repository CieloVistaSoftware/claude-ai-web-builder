# Global Configuration System

The Website Builder project now uses a centralized configuration system that provides a single source of truth for file paths, URLs, and settings used throughout both the application and test suite.

## Overview

The configuration system consists of:

- `config.js` - The main configuration file that defines all paths, URLs, and settings
- `tests/test.config.js` - Test-specific configuration that extends the main config

## Key Features

- **ES Modules**: All configuration files use ES modules (import/export) syntax
- **Environment-aware URLs**: Functions to get the appropriate URL for different environments
- **Centralized settings**: All settings defined in one place for easy updates
- **Test-specific configuration**: Extended configuration for testing needs

## Usage

### In Application Code

```javascript
import config from './config.js';

// Use application paths
const appPath = config.paths.app.indexHtml;

// Use application settings
const defaultTheme = config.settings.defaultTheme;

// Get environment-specific URLs
const fileUrl = config.getMainUrl('file');
const localUrl = config.getMainUrl('local');
```

### In Test Code

```javascript
import { testConfig } from './tests/test.config.js';

// Use test-specific settings
const testTimeout = testConfig.timeouts.test;

// Use URLs for tests
const testUrl = testConfig.urls.file;

// Use server settings
const serverPort = testConfig.server.port;
```

## Configuration Structure

### Main Configuration (config.js)

- `paths` - File system paths for the application and tests
- `urls` - URLs for different environments (file, local, production)
- `settings` - Application settings like themes, layouts, timeouts, etc.
- `getMainUrl()` - Function to get the appropriate URL for the main HTML file
- `getLegacyUrl()` - Function to get the appropriate URL for the legacy HTML file

### Test Configuration (tests/test.config.js)

- `baseUrl` - Base URL for tests
- `urls` - URLs for different test environments
- `timeouts` - Timeouts for tests, actions, etc.
- `storage` - Test data storage keys
- `defaults` - Default settings for tests
- `server` - Server settings for the test environment

## Running Tests with the New Configuration

To run tests using the new configuration system:

```bash
# Run tests with fail-fast option (stop at first failure)
npm run test:failfast

# Run tests with the configuration system
npm run test:config
```

## Benefits

1. **Consistency**: All parts of the application use the same configuration values
2. **Maintainability**: Change paths and settings in one place
3. **Flexibility**: Easy to switch between different environments
4. **Modularity**: ES modules ensure proper encapsulation and dependencies
5. **Scalability**: Easy to add new configuration sections as needed
