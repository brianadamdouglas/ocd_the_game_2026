# Testing Setup Guide

## Prerequisites

This project requires Node.js and npm to be installed. If you don't have them:

1. Install Node.js from https://nodejs.org/ (LTS version recommended)
2. Verify installation:
   ```bash
   node --version
   npm --version
   ```

## Installation

1. Install dependencies:
   ```bash
   npm install
   ```

This will install:
- Jest (testing framework)
- Babel (for ES6+ support)
- jsdom (for DOM simulation)

## Running Tests

### Run all tests:
```bash
npm test
```

### Run tests in watch mode (auto-rerun on file changes):
```bash
npm run test:watch
```

### Run tests with coverage report:
```bash
npm run test:coverage
```

## Test Structure

```
tests/
├── unit/                    # Unit tests for individual methods
│   └── controllers/
│       └── Main_Controller.*.test.js
├── integration/             # Integration tests
├── helpers/                 # Test utilities
│   ├── mocks.js            # Mock objects
│   ├── fixtures.js         # Test data
│   └── testHarness.js      # Test setup utilities
└── setup.js                # Global test configuration
```

## Current Test Status

### ✅ Tests Created:
- `buildHitResult.test.js` - Pure function, fully testable
- `checkFinishLineCollision.test.js` - Simple logic, fully testable
- `checkFinishLine.test.js` - Requires mocking `getPlayerTransformRect()`
- `checkPlayerBodyCollision.test.js` - Requires jQuery mocking
- `handleObstacleCollisions.test.js` - Requires player and sprite mocks
- `buildSpriteData.test.js` - Requires model and stage mocks

### ⚠️ Note on Test Execution:

The current codebase uses global scripts loaded via `<script>` tags, which makes direct testing challenging. The tests are structured to work once:

1. **Option A:** The code is refactored to use ES modules
2. **Option B:** A test runner is configured to load scripts in order (using jsdom)
3. **Option C:** Test-specific build process is created

For now, the tests document the expected behavior and can be run once the environment is properly configured.

## Next Steps

1. Install npm dependencies: `npm install`
2. Configure test environment to load Main_Controller class
3. Run tests: `npm test`
4. Fix any failing tests
5. Add more tests as methods are refactored

