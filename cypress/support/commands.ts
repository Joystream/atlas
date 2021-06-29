import '@testing-library/cypress/add-commands'

// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('injectPolkadot', (accounts = []) => {
  const enable = async () => {
    return {
      accounts: {
        get: () => new Promise((resolve) => resolve(accounts)),
      },
    }
  }
  cy.window().then((window) => {
    window['injectedWeb3'] = {
      'polkadot-js': {
        enable,
        version: '0.38.3',
      },
    }
  })
})

Cypress.Commands.add('login', () => {
  cy.injectPolkadot(Cypress.env('accounts'))
})
