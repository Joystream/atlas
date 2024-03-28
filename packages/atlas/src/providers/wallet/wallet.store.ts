import { createStore } from '@/utils/store'

import { SignerWallet, SignerWalletAccount, SignerWalletStatus } from './wallet.types'

export type WalletStoreState = {
  wallet: SignerWallet | null
  walletAccounts: SignerWalletAccount[]
  walletStatus: SignerWalletStatus
  lastUsedWalletName: string | null
  lastChainMetadataVersion: [string, number] | null // [genesisHash, number]
}

export type WalletStoreActions = {
  setWallet: (wallet: SignerWallet) => void
  setWalletAccounts: (accounts: SignerWalletAccount[]) => void
  setWalletStatus: (status: SignerWalletStatus) => void
  setLastChainMetadataVersion: (genesisHash: string, version: number) => void
}

export const useWalletStore = createStore<WalletStoreState, WalletStoreActions>(
  {
    state: {
      wallet: null,
      walletAccounts: [],
      walletStatus: 'unknown',
      lastUsedWalletName: null,
      lastChainMetadataVersion: null,
    },
    actionsFactory: (set) => ({
      setWallet: (wallet) => {
        set((state) => {
          state.wallet = wallet
          state.lastUsedWalletName = wallet.extensionName || null
        })
      },
      setWalletAccounts: (accounts) => {
        set((state) => {
          state.walletAccounts = accounts
        })
      },
      setWalletStatus: (status) => {
        set((state) => {
          state.walletStatus = status
        })
      },
      setLastChainMetadataVersion: (genesisHash, version) => {
        set((state) => {
          state.lastChainMetadataVersion = [genesisHash, version]
        })
      },
    }),
  },
  {
    persist: {
      key: 'reacntWallet',
      version: 0,
      whitelist: ['lastUsedWalletName', 'lastChainMetadataVersion'],
      migrate: (oldState) => {
        return oldState
      },
    },
  }
)
