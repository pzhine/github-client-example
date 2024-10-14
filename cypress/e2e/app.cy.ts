const RESULTS_PER_PAGE = 20 // update this if it is updated in the .env file
const SINGULAR_ISSUE_TEXT = '7779988-20241007' // this should be so rare it appears in only one issue

describe('GitHub Client example app ', () => {
  let firstText: string
  let lastText: string

  beforeEach(() => {
    cy.visit('http://localhost:3000')
    cy.get('[data-test-id="paginator:result-count"]').as('result-count')
    cy.get('[data-test-id="paginator:next-page"]').as('next-page')
    cy.get('[data-test-id="issueList:container"]').as('issue-list')
    cy.get('@issue-list').get('a').as('issue-rows')

    // capture first and last item text
    cy.get('@issue-rows')
      .get('.issue-title')
      .first()
      .invoke('text')
      .then((txt) => {
        firstText = txt
      })
    cy.get('@issue-rows')
      .get('.issue-title')
      .last()
      .invoke('text')
      .then((txt) => {
        lastText = txt
      })
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
    it('maintains original items when next page is added', () => {
      cy.get('@next-page').click().should('be.enabled')
      cy.get('@issue-rows').first().should('contain.text', firstText)
      cy.get('@issue-rows')
        .eq(RESULTS_PER_PAGE - 1)
        .should('contain.text', lastText)
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
    it('paginates search results', () => {
      cy.searchText('testing')
      cy.get('@next-page').click().should('be.enabled')
      cy.get('@issue-rows').should('have.length', RESULTS_PER_PAGE * 2)
      cy.get('@result-count').contains(`Showing ${RESULTS_PER_PAGE * 2}`)
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
    it('persists the search after page reload', () => {
      cy.searchText(SINGULAR_ISSUE_TEXT)
      cy.reload()
      cy.get('@issue-rows')
        .should('have.length', 1)
        .eq(0)
        .contains(SINGULAR_ISSUE_TEXT)
    })
  })
  context('navigation', () => {
    it('navigates to issue detail and back', () => {
      cy.get('@issue-rows').eq(0).click()
      cy.url().should('match', /\/issue\/[0-9]+/)
      cy.get('[data-test-id="issue:head"]').should(
        'contain.text',
        firstText
      )
      cy.go('back')
      cy.get('@issue-rows').should('have.length', RESULTS_PER_PAGE)
    })
    it('navigates from search to issue detail and back', () => {
      cy.searchText(SINGULAR_ISSUE_TEXT)
      cy.get('@next-page').should('not.exist')
      cy.get('@issue-rows').eq(0).click()
      cy.get('[data-test-id="issue:head"]').should(
        'contain.text',
        SINGULAR_ISSUE_TEXT
      )
      cy.go('back')
      cy.get('@issue-rows').should('have.length', 1)
    })
  })
  context('filtering', () => {
    beforeEach(() => {
      cy.get('[data-test-id="filter:select"]').as('filter-select')
    })

    it('only shows open issues when status filter is "open"', () => {
      cy.get('@filter-select').select('open')
      cy.get('@issue-rows')
        .get('[data-issue-status="OPEN"]')
        .should('have.length', RESULTS_PER_PAGE)
      cy.get('@issue-rows')
        .get('[data-issue-status="CLOSED"]')
        .should('not.exist')
    })
    it('only shows closed issues when status filter is "closed"', () => {
      cy.get('@filter-select').select('closed')
      cy.get('@issue-rows')
        .get('[data-issue-status="CLOSED"]')
        .should('have.length', RESULTS_PER_PAGE)
      cy.get('@issue-rows')
        .get('[data-issue-status="OPEN"]')
        .should('not.exist')
    })
    it('only shows filtered issues after loading next page', () => {
      cy.get('@filter-select').select('open')
      cy.get('@issue-rows')
        .get('[data-issue-status="OPEN"]')
        .should('have.length', RESULTS_PER_PAGE)
      cy.get('@next-page').click().should('be.enabled')
      cy.get('@issue-rows')
        .get('[data-issue-status="OPEN"]')
        .should('have.length', RESULTS_PER_PAGE * 2)
      cy.get('@issue-rows')
        .get('[data-issue-status="CLOSED"]')
        .should('not.exist')
    })
    it('only shows filtered issues after searching', () => {
      cy.get('@filter-select').select('open')
      cy.searchText('testing')
      cy.get('@issue-rows')
        .get('[data-issue-status="OPEN"]')
        .should('have.length', RESULTS_PER_PAGE)
      cy.get('@issue-rows')
        .get('[data-issue-status="CLOSED"]')
        .should('not.exist')
    })
    it('persists filter on reload', () => {
      cy.get('@filter-select').select('open')
      cy.get('@issue-rows')
        .get('[data-issue-status="OPEN"]')
        .should('have.length', RESULTS_PER_PAGE)
      cy.reload()
      cy.get('@issue-rows')
        .get('[data-issue-status="OPEN"]')
        .should('have.length', RESULTS_PER_PAGE)
      cy.get('@issue-rows')
        .get('[data-issue-status="CLOSED"]')
        .should('not.exist')
      cy.get('@filter-select').select('closed')
      cy.get('@issue-rows')
        .get('[data-issue-status="CLOSED"]')
        .should('have.length', RESULTS_PER_PAGE)
      cy.reload()
      cy.get('@issue-rows')
        .get('[data-issue-status="CLOSED"]')
        .should('have.length', RESULTS_PER_PAGE)
      cy.get('@issue-rows')
        .get('[data-issue-status="OPEN"]')
        .should('not.exist')
    })
  })
})
