/// <reference types="cypress" />

describe('Weather App - Widget Management', () => {
  beforeEach(() => {
    cy.visit('/')
    cy.clearLocalStorage()
  })

  it('should delete widgets when delete button is clicked', () => {
    // First add a widget
    cy.intercept('GET', '**/search.json*', {
      body: [{ name: 'Paris', country: 'France', lat: 48.8566, lon: 2.3522 }]
    })
    cy.intercept('GET', '**/current.json*', { fixture: 'weather.json' })
    cy.intercept('GET', '**/forecast.json*', { fixture: 'weather.json' })

    cy.getByTestId('search-input').type('Paris')
    cy.wait(400)
    cy.get('[data-testid^="suggestion-Paris"]').first().click()
    
    cy.get('[data-testid="weather-widget"]').should('be.visible')
    
    // Click delete button
    cy.get('[data-testid="delete-button"]').first().click()
    
    cy.get('[data-testid="weather-widget"]').should('not.exist')
    
    cy.contains('No Weather Widgets Yet').should('be.visible')
  })

  it('should allow adding multiple widgets', () => {
    const cities = [
      { name: 'London', country: 'UK', lat: 51.5074, lon: -0.1278 },
      { name: 'Tokyo', country: 'Japan', lat: 35.6762, lon: 139.6503 },
      { name: 'New York', country: 'USA', lat: 40.7128, lon: -74.0060 }
    ]

    // Intercept API calls
    cy.intercept('GET', '**/current.json*', { fixture: 'weather.json' })
    cy.intercept('GET', '**/forecast.json*', { fixture: 'weather.json' })

    cities.forEach((city, index) => {
      cy.intercept('GET', '**/search.json*', {
        body: [city]
      }).as(`searchRequest${index}`)

      cy.getByTestId('search-input').type(city.name)
      cy.wait(400)
      cy.get(`[data-testid^="suggestion-${city.name}"]`).first().click()
      cy.wait(500)
    })
    cy.get('[data-testid="weather-widget"]').should('have.length', 3)
  })

  it('should display weather information correctly', () => {
    cy.intercept('GET', '**/search.json*', {
      body: [{ name: 'Berlin', country: 'Germany', lat: 52.5200, lon: 13.4050 }]
    })
    cy.intercept('GET', '**/current.json*', { fixture: 'weather.json' })
    cy.intercept('GET', '**/forecast.json*', { fixture: 'weather.json' })

    cy.getByTestId('search-input').type('Berlin')
    cy.wait(400)
    cy.get('[data-testid^="suggestion-Berlin"]').first().click()
    
    cy.get('[data-testid="weather-widget"]').within(() => {
      cy.contains('Berlin').should('be.visible')
      cy.get('[data-testid="last-updated"]').should('be.visible')
    })
  })
})
