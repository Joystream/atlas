import { createStore } from '@/utils/store'

import { ActiveUserState, SignerWallet, SignerWalletAccount, SignerWalletStatus } from './user.types'

export type UserStoreState = ActiveUserState & {
  userId: string | null
  wallet: SignerWallet | null
  walletAccounts: SignerWalletAccount[]
  walletStatus: SignerWalletStatus
  lastUsedWalletName: string | null
  lastChainMetadataVersion: [string, number] | null // [genesisHash, number]
  signInModalOpen: boolean
}

export type UserStoreActions = {
  resetActiveUser: () => void
  setActiveUser: (activeUserChanges: Partial<ActiveUserState>) => void
  signOut: () => void

  setUserId: (userId: string | null) => void
  setWallet: (wallet: SignerWallet) => void
  setWalletAccounts: (accounts: SignerWalletAccount[]) => void
  setWalletStatus: (status: SignerWalletStatus) => void

  setSignInModalOpen: (isOpen: boolean) => void
  setLastChainMetadataVersion: (genesisHash: string, version: number) => void
  setLoggedInAccountId: (address: string) => void
}

export const useUserStore = createStore<UserStoreState, UserStoreActions>(
  {
    state: {
      accountId: null,
      memberId: null,
      channelId: null,
      loggedInAccountId: null,

      userId: null,
      wallet: null,
      walletAccounts: [],
      walletStatus: 'unknown',
      lastUsedWalletName: null,
      lastChainMetadataVersion: null,
      signInModalOpen: false,
    },
    actionsFactory: (set) => ({
      resetActiveUser: () => {
        set((state) => {
          state.accountId = null
          state.memberId = null
          state.channelId = null
        })
      },
      setLoggedInAccountId: (address) => {
        set((state) => {
          state.loggedInAccountId = address
        })
      },
      setActiveUser: (activeUserChanges) => {
        set((state) => {
          state.accountId = activeUserChanges.accountId !== undefined ? activeUserChanges.accountId : state.accountId
          state.memberId = activeUserChanges.memberId !== undefined ? activeUserChanges.memberId : state.memberId
          state.channelId = activeUserChanges.channelId !== undefined ? activeUserChanges.channelId : state.channelId
        })
      },
      signOut: () => {
        set((state) => {
          state.accountId = null
          state.memberId = null
          state.channelId = null
          state.wallet = null
          state.walletStatus = 'unknown'
          state.walletAccounts = []
          state.lastUsedWalletName = null
          state.loggedInAccountId = null
        })
      },

      setUserId: (userId) => {
        set((state) => {
          state.userId = userId
        })
      },
      setWallet: (wallet) => {
        set((state) => {
          state.wallet = wallet
          state.lastUsedWalletName = wallet.extensionName
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
      setSignInModalOpen: (isOpen) => {
        set((state) => {
          state.signInModalOpen = isOpen
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
      key: 'activeUser',
      version: 0,
      whitelist: ['accountId', 'memberId', 'channelId', 'lastUsedWalletName', 'lastChainMetadataVersion', 'userId'],
      migrate: (oldState) => {
        return oldState
      },
    },
  }
)
