// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

/// <reference types="cypress" />

// Weather app specific commands
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to select DOM element by data-testid attribute.
       * @example cy.getByTestId('search-input')
       */
      getByTestId(testId: string): Chainable<JQuery<HTMLElement>>
      
      /**
       * Custom command to search for a city in the weather app.
       * @example cy.searchForCity('New York')
       */
      searchForCity(cityName: string): Chainable<Element>
      
      /**
       * Custom command to add a weather widget with mocked API responses.
       * @example cy.addWeatherWidget('London')
       */
      addWeatherWidget(cityName: string): Chainable<Element>
    }
  }
}

Cypress.Commands.add('getByTestId', (testId: string) => {
  return cy.get(`[data-testid="${testId}"]`)
})

Cypress.Commands.add('searchForCity', (cityName: string) => {
  cy.getByTestId('search-input').type(cityName)
  cy.wait(400) // Wait for debounce
  cy.getByTestId('suggestions-dropdown').should('be.visible')
  cy.get(`[data-testid^="suggestion-${cityName}"]`).first().click()
})

Cypress.Commands.add('addWeatherWidget', (cityName: string) => {
  // Mock the API responses
  cy.intercept('GET', `**/search.json*${cityName}*`, {
    body: [{ name: cityName, country: 'Test Country', lat: 0, lon: 0 }]
  }).as(`${cityName}Search`)
  
  cy.intercept('GET', '**/current.json*', { fixture: 'weather.json' }).as('currentWeather')
  cy.intercept('GET', '**/forecast.json*', { fixture: 'weather.json' }).as('forecast')
  
  // Perform the search and selection
  cy.searchForCity(cityName)
  
  // Wait for API calls
  cy.wait([`@${cityName}Search`, '@currentWeather', '@forecast'])
  
  // Verify widget was added
  cy.get(`[data-testid="weather-widget"]`).should('contain', cityName)
})

export {}
