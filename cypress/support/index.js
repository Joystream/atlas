// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************
// Import commands.js using ES2015 syntax:
import './commands'

// Alternatively you can use CommonJS syntax:
// require('./commands')
const resizeObserverLoopErrRe = /^[^(ResizeObserver loop limit exceeded)]/
Cypress.on('uncaught:exception', (err) => {
  /* returning false here prevents Cypress from failing the test */
  if (resizeObserverLoopErrRe.test(err.message)) {
    return false
  }
})

Cypress.on('window:before:load', (window) => {
  const enable = async () => {
    return {
      accounts: {
        get: () => new Promise((resolve) => resolve(Cypress.env('accounts'))),
      },
    }
  }

  window['injectedWeb3'] = {
    'polkadot-js': {
      enable,
      version: '0.38.3',
    },
  }
})

before(() => {
  cy.visit('/')
})
