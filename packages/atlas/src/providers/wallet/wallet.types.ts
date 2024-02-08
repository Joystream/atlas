import { Wallet, WalletAccount } from '@talismn/connect-wallets'

export type SignerWallet = Wallet
export type SignerWalletStatus = 'unknown' | 'connected' | 'disconnected' | 'pending'
export type SignerWalletAccount = WalletAccount

export type WalletContextValue = {
  isSignerMetadataOutdated: boolean
  skipSignerMetadataUpdate: () => Promise<void>
  signInToWallet: (walletName?: string, invokedAutomatically?: boolean) => Promise<SignerWalletAccount[] | null>
  updateSignerMetadata: () => Promise<void>
  signInWithWalletConnect: () => Promise<SignerWalletAccount[] | null>
}
