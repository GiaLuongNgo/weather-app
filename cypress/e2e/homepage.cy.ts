/// <reference types="cypress" />

describe('Weather App - Homepage', () => {
  beforeEach(() => {
    // Visit the app homepage
    cy.visit('/')
    
    // Clear any existing localStorage data
    cy.clearLocalStorage()
  })

  it('should load the homepage successfully', () => {
    // Check that the main elements are visible
    cy.contains('Weather Dashboard').should('be.visible')
    cy.contains('Add cities to track their weather conditions').should('be.visible')
    cy.getByTestId('search-bar').should('be.visible')
    cy.getByTestId('search-input').should('be.visible')
    cy.getByTestId('search-icon').should('be.visible')
  })

  it('should display empty state when no widgets are added', () => {
    // Check empty state message
    cy.contains('No Weather Widgets Yet').should('be.visible')
    cy.contains('Search for a city above to add your first weather widget').should('be.visible')
    cy.contains('🌤️').should('be.visible')
  })

  it('should be responsive and mobile-friendly', () => {
    // Test mobile viewport
    cy.viewport('iphone-6')
    cy.getByTestId('search-bar').should('be.visible')
    cy.contains('Weather Dashboard').should('be.visible')
    
    // Test tablet viewport
    cy.viewport('ipad-2')
    cy.getByTestId('search-bar').should('be.visible')
    cy.contains('Weather Dashboard').should('be.visible')
    
    // Test desktop viewport
    cy.viewport(1280, 720)
    cy.getByTestId('search-bar').should('be.visible')
    cy.contains('Weather Dashboard').should('be.visible')
  })

  it('should handle keyboard navigation', () => {
    // Focus on search input
    cy.getByTestId('search-input').focus()
    cy.getByTestId('search-input').should('have.focus')
  })
})
