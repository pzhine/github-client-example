/// <reference types="cypress" />

Cypress.Commands.add('searchText', function (query: string) {
  const sb = cy.get('[data-test-id="searchBar:input"]').as('search-input')
  sb.clear()
  sb.type(`${query}{enter}`)
  return sb
})
