# Cypress E2E Tests

This directory contains end-to-end tests for the Weather App using Cypress.

## Test Structure

### Test Files
- `homepage.cy.ts` - Tests for the main homepage functionality
- `search.cy.ts` - Tests for the search functionality and API interactions
- `widgets.cy.ts` - Tests for weather widget management (add, delete, update)
- `accessibility.cy.ts` - Tests for accessibility features and compliance
- `performance.cy.ts` - Tests for performance and user experience
- `integration.cy.ts` - Full user journey integration tests
- `custom-commands.cy.ts` - Demonstration of custom Cypress commands

### Support Files
- `support/e2e.ts` - Main support file for E2E tests
- `support/commands.ts` - Custom Cypress commands specific to the Weather App
- `support/component.ts` - Support file for component tests (if needed)

### Fixtures
- `fixtures/weather.json` - Mock weather data for testing

## Running Tests

### Prerequisites
1. Install dependencies: `npm install`
2. Ensure the development server is running: `npm run dev`

### Running Tests Locally

#### Interactive Mode (Cypress Test Runner)
```bash
npm run cypress:open
```

#### Headless Mode
```bash
npm run e2e
# or
npm run cypress:run
```

#### Headless Mode (explicit)
```bash
npm run cypress:run:headless
```

### Running Specific Tests
```bash
# Run a specific test file
npx cypress run --spec "cypress/e2e/homepage.cy.ts"

# Run tests matching a pattern
npx cypress run --spec "cypress/e2e/**/*search*"
```

## Custom Commands

The test suite includes custom commands to simplify common operations:

### `cy.getByTestId(testId)`
Selects elements by `data-testid` attribute.
```javascript
cy.getByTestId('search-input').type('London')
```

### `cy.searchForCity(cityName)`
Performs a search for a city including debounce wait.
```javascript
cy.searchForCity('New York')
```

### `cy.addWeatherWidget(cityName)`
Adds a weather widget with all necessary API mocking.
```javascript
cy.addWeatherWidget('Tokyo')
```

## Test Categories

### 1. Homepage Tests (`homepage.cy.ts`)
- Page loading and initial state
- Responsive design
- Basic navigation
- Empty state display

### 2. Search Tests (`search.cy.ts`)
- Search input functionality
- API request handling
- Suggestions dropdown
- Loading states
- Error handling
- Debouncing

### 3. Widget Tests (`widgets.cy.ts`)
- Adding weather widgets
- Deleting widgets
- Widget persistence
- Multiple widget management
- API error handling

### 4. Accessibility Tests (`accessibility.cy.ts`)
- ARIA labels and roles
- Keyboard navigation
- Focus management
- Screen reader compatibility
- Color contrast
- Loading state accessibility

### 5. Performance Tests (`performance.cy.ts`)
- Page load times
- API response handling
- Memory usage
- Animation performance
- Network condition handling
- Debouncing effectiveness

### 6. Integration Tests (`integration.cy.ts`)
- Complete user journeys
- Multi-step workflows
- Cross-feature interactions
- Error recovery flows
- Responsive behavior

## Mock Data and API Interception

Tests use Cypress's `cy.intercept()` to mock API responses:

```javascript
// Mock search API
cy.intercept('GET', '**/search.json*', {
  body: [{ name: 'London', country: 'UK', lat: 51.5074, lon: -0.1278 }]
}).as('searchRequest')

// Mock weather API
cy.intercept('GET', '**/current.json*', {
  fixture: 'weather.json'
}).as('weatherRequest')
```

## Configuration

### Cypress Configuration (`cypress.config.ts`)
- Base URL: `http://localhost:3000`
- Viewport: 1280x720
- Timeouts: 10 seconds
- Screenshots on failure: enabled
- Video recording: disabled (for faster tests)

### Environment Variables
Tests can be configured with environment variables:
- `CYPRESS_baseUrl` - Override base URL
- `CYPRESS_defaultCommandTimeout` - Override command timeout

## CI/CD Integration

Tests are configured to run in GitHub Actions (see `.github/workflows/e2e.yml`):
- Runs on push to main/develop branches
- Runs on pull requests
- Uses Chrome browser
- Uploads screenshots and videos on failure

### Running in CI
```bash
# Install dependencies
npm ci

# Build the application
npm run build

# Start the application
npm start &

# Run tests
npm run e2e
```

## Best Practices

### 1. Data Attributes
Use `data-testid` attributes for reliable element selection:
```jsx
<input data-testid="search-input" />
```

### 2. API Mocking
Always mock external API calls for reliable, fast tests:
```javascript
cy.intercept('GET', '/api/weather', { fixture: 'weather.json' })
```

### 3. Wait Strategies
Use appropriate wait strategies:
```javascript
// Wait for API calls
cy.wait('@apiRequest')

// Wait for elements
cy.get('[data-testid="widget"]').should('be.visible')

// Wait for debounce
cy.wait(400)
```

### 4. Clean State
Always start with a clean state:
```javascript
beforeEach(() => {
  cy.visit('/')
  cy.clearLocalStorage()
})
```

### 5. Custom Commands
Use custom commands for repeated operations:
```javascript
cy.addWeatherWidget('London')
```

## Debugging

### Visual Testing
- Screenshots are automatically taken on test failures
- Use `cy.screenshot()` for manual screenshots
- Use `cy.pause()` to pause test execution

### Network Testing
- Use `cy.intercept()` to inspect network requests
- Check the Network tab in Cypress Test Runner
- Use `cy.wait('@alias')` to debug API calls

### Console Logs
```javascript
cy.window().then((win) => {
  console.log(win.localStorage.getItem('weatherWidgets'))
})
```

## Troubleshooting

### Common Issues

1. **Test timeouts**: Increase timeout values in configuration
2. **Element not found**: Check data-testid attributes exist
3. **API mocking issues**: Verify intercept patterns match actual requests
4. **Flaky tests**: Add proper waits and assertions

### Debug Commands
```bash
# Run with debug output
DEBUG=cypress:* npm run cypress:run

# Run with browser console open
npx cypress open --config video=false
```

## Contributing

When adding new tests:
1. Follow the existing naming conventions
2. Add appropriate data-testid attributes to components
3. Mock all external API calls
4. Include both happy path and error scenarios
5. Update this README if adding new test categories
