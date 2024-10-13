/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable<Subject> {
    /**
     * Enter search string and submit
     */
    searchText(query: string): Chainable<any>
  }
}
