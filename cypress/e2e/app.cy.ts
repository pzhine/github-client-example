const RESULTS_PER_PAGE = 20 // update this if it is updated in the .env file
const SINGULAR_ISSUE_TEXT = '7779988-20241007' // this should be so rare it appears in only one issue

describe('GitHub Client example app ', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000')
    cy.get('[data-test-id="paginator:result-count"]').as('result-count')
    cy.get('[data-test-id="paginator:next-page"]').as('next-page')
    cy.get('[data-test-id="issueList:container"]').as('issue-list')
    cy.get('@issue-list').get('a').as('issue-rows')
  })
  context('paging', () => {
    it('shows the right number of rows initially', () => {
      cy.get('@issue-rows').should('have.length', RESULTS_PER_PAGE)
      cy.get('@result-count').contains(`Showing ${RESULTS_PER_PAGE}`)
    })
    it('increases results when next page button is clicked', () => {
      // click the button and wait for the results to load
      cy.get('@next-page').click().should('be.enabled')
      cy.get('@issue-rows').should('have.length', RESULTS_PER_PAGE * 2)
      cy.get('@result-count').contains(`Showing ${RESULTS_PER_PAGE * 2}`)
    })
    it('increases results exactly twice when next page is clicked twice', () => {
      // click the button twice
      cy.get('@next-page').click().should('be.enabled')
      cy.get('@next-page').click().should('be.enabled')
      cy.get('@issue-rows').should('have.length', RESULTS_PER_PAGE * 3)
      cy.get('@result-count').contains(`Showing ${RESULTS_PER_PAGE * 3}`)
    })
    it('persists the result count after page reload', () => {
      cy.get('@next-page').click().should('be.enabled')
      cy.reload()
      cy.get('@issue-rows').should('have.length', RESULTS_PER_PAGE * 2)
      cy.get('@result-count').contains(`Showing ${RESULTS_PER_PAGE * 2}`)
    })
    it('hides the next button when there are no more results', () => {
      cy.searchText(SINGULAR_ISSUE_TEXT)
      cy.get('@next-page').should('not.exist')
    })
  })

  context('searching', () => {
    it('finds a singular search result', () => {
      cy.searchText(SINGULAR_ISSUE_TEXT)
      cy.get('@issue-rows')
        .should('have.length', 1)
        .eq(0)
        .contains(SINGULAR_ISSUE_TEXT)
    })
    it('updates search results', () => {
      cy.searchText(SINGULAR_ISSUE_TEXT)
      cy.searchText('testing')
      cy.get('@issue-rows').should('have.length.greaterThan', 1)
    })
    it('restores search results on back/forward nav', () => {
      cy.searchText(SINGULAR_ISSUE_TEXT)
      cy.searchText('testing')
      cy.go('back')
      cy.get('@issue-rows')
        .should('have.length', 1)
        .eq(0)
        .contains(SINGULAR_ISSUE_TEXT)
      cy.go('forward')
      cy.get('@issue-rows').should('have.length.greaterThan', 1)
    })
    it('correctly reports no results', () => {
      cy.searchText(`${SINGULAR_ISSUE_TEXT}${SINGULAR_ISSUE_TEXT}`)
      cy.get('@issue-list').contains('no results', { matchCase: false })
    })
  })
})
