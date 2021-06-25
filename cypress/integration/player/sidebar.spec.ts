// /// <reference path="../../support/index.d.ts" />
/// <reference types="Cypress" />
before(() => {
  cy.login()
})

describe('Sidebar', () => {
  it('open sidebar and go to sign in screen', () => {
    cy.findByLabelText(/Main menu/i).click()
    cy.findByRole('link', { name: /Joystream studio/i }).click()
    cy.findAllByLabelText(/Sign in/i).should('exist')
  })
})
