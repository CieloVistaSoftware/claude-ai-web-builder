# Website Builder Tests

This folder contains automated tests for the Website Builder application.

## Setup

To run tests, first install the dependencies:

```bash
cd tests
npm install
```

## Running Tests

### Run tests in headless mode (default)

```bash
npm test
```

### Run tests in headed mode (with browser UI visible)

```bash
npm run test:headed
```

### Run tests with Playwright UI

```bash
npm run test:ui
```

### View Test Report

```bash
npm run report
```

## Test Coverage

The tests cover the following aspects of the Website Builder:

1. Control Panel Visibility and Functionality
2. Edit Mode Toggle
3. Layout Selection (Top/Left/Right Navigation)
4. Theme Selection
5. Dark/Light Mode Toggle
6. Color Explorer Sliders
7. Gradient Background Toggle
8. Panel Minimization
9. Save Website Functionality
10. Various combinations of the above features

## Adding New Tests

To add new tests, create a new file in this directory following the naming pattern `*.spec.js`.
