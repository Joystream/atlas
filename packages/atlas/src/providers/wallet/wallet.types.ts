import { Wallet, WalletAccount } from '@talismn/connect-wallets'

import { WalletConnectWallet } from '@/providers/wallet/tmpwallet'

export type SignerWallet = Wallet | WCWallet
export type WCWallet = Partial<Wallet> & WalletConnectWallet
export type SignerWalletStatus = 'unknown' | 'connected' | 'disconnected' | 'pending'
export type SignerWalletAccount = WalletAccount

export const isWalletConnectWallet = (wallet: SignerWallet): wallet is WCWallet =>
  wallet.extensionName === 'WalletConnect'

export type WalletContextValue = {
  isSignerMetadataOutdated: boolean
  skipSignerMetadataUpdate: () => Promise<void>
  signInToWallet: (walletName?: string, invokedAutomatically?: boolean) => Promise<SignerWalletAccount[] | null>
  updateSignerMetadata: () => Promise<void>
  signInWithWalletConnect: () => Promise<SignerWalletAccount[] | null>
}
