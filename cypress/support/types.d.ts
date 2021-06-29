import { InjectedAccount } from '@polkadot/extension-inject/types'

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to login into Atlas with a test membership.
       */
      login(): Chainable<void>
      /**
       * Custom command to make the polkadot api available and add accounts, memberships, etc.. to it.
       */
      injectPolkadot(accounts: InjectedAccount[]): Chainable<void>
    }
  }
}
