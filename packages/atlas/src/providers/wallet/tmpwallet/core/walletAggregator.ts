// import type { BaseWallet, BaseWalletProvider } from './types.js'
// import { InjectedWallet } from '@polkadot-onboard/injected-wallets'
//
// export class WalletAggregator {
//   walletProviders: BaseWalletProvider[]
//
//   constructor(providers: BaseWalletProvider[]) {
//     this.walletProviders = providers
//   }
//
//   async getWallets(): Promise<BaseWallet[]> {
//     const wallets: (BaseWallet | InjectedWallet)[] = []
//
//     for (const provider of this.walletProviders) {
//       const providedWallets = await provider.getWallets()
//
//       wallets.push(...providedWallets)
//     }
//     return wallets
//   }
// }
