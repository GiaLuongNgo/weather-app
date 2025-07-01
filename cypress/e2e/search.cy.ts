/// <reference types="cypress" />

describe('Weather App - Search Functionality', () => {
  beforeEach(() => {
    cy.visit('/')
    cy.clearLocalStorage()
  })

  it('should allow typing in the search input', () => {
    cy.getByTestId('search-input')
      .type('New York')
      .should('have.value', 'New York')
  })

  it('should show clear button when text is entered', () => {
    cy.getByTestId('search-input').type('London')
    cy.getByTestId('clear-search-button').should('be.visible')
  })

  it('should clear input when clear button is clicked', () => {
    cy.getByTestId('search-input').type('Tokyo')
    cy.getByTestId('clear-search-button').click()
    cy.getByTestId('search-input').should('have.value', '')
    cy.getByTestId('clear-search-button').should('not.exist')
  })

  it('should show suggestions dropdown when typing (mock API)', () => {
    // Intercept the API call and return mock data
    cy.intercept('GET', '**/search.json*', {
      fixture: 'weather.json',
      statusCode: 200
    }).as('searchRequest')

    cy.getByTestId('search-input').type('Ne')
    
    // Wait for debounced search
    cy.wait(400)
    
    // Check if suggestions dropdown appears
    cy.getByTestId('suggestions-dropdown').should('be.visible')
  })

  it('should show no results message for invalid search', () => {
    // Intercept with empty results
    cy.intercept('GET', '**/search.json*', {
      body: [],
      statusCode: 200
    }).as('emptySearchRequest')

    cy.getByTestId('search-input').type('InvalidCityName123')
    
    // Wait for debounced search
    cy.wait(400)
    
    cy.getByTestId('no-results').should('be.visible')
    cy.contains('No locations found').should('be.visible')
  })
})
