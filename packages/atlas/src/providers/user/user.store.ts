import { createStore } from '@/store'
import { readFromLocalStorage } from '@/utils/localStorage'

import { ActiveUserState, SignerWallet, SignerWalletAccount, SignerWalletStatus } from './user.types'

const LOCAL_STORAGE_KEY = 'activeUser'

export type UserStoreState = ActiveUserState & {
  wallet: SignerWallet | null
  walletAccounts: SignerWalletAccount[]
  walletStatus: SignerWalletStatus
}

const WHITELIST = ['accountId', 'memberId', 'channelId'] as (keyof ActiveUserState)[]

export type UserStoreActions = {
  resetActiveUser: () => void
  setActiveUser: (activeUserChanges: Partial<ActiveUserState>) => void

  setWallet: (wallet: SignerWallet) => void
  setWalletAccounts: (accounts: SignerWalletAccount[]) => void
  setWalletStatus: (status: SignerWalletStatus) => void
}

export const useUserStore = createStore<UserStoreState, UserStoreActions>(
  {
    state: {
      accountId: null,
      memberId: null,
      channelId: null,

      wallet: null,
      walletAccounts: [],
      walletStatus: 'unknown',
    },
    actionsFactory: (set) => ({
      resetActiveUser: () => {
        set((state) => {
          state.accountId = null
          state.memberId = null
          state.channelId = null
        })
      },
      setActiveUser: (activeUserChanges) => {
        set((state) => {
          state.accountId = activeUserChanges.accountId !== undefined ? activeUserChanges.accountId : state.accountId
          state.memberId = activeUserChanges.memberId !== undefined ? activeUserChanges.memberId : state.memberId
          state.channelId = activeUserChanges.channelId !== undefined ? activeUserChanges.channelId : state.channelId
        })
      },

      setWallet: (wallet) => {
        set((state) => {
          state.wallet = wallet
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
    }),
  },
  {
    persist: {
      key: LOCAL_STORAGE_KEY,
      version: 0,
      whitelist: WHITELIST,
      migrate: (oldState, oldVersion) => {
        // migrate store before zustand was added
        if (oldVersion === undefined) {
          const activeUser = readFromLocalStorage<ActiveUserState>(LOCAL_STORAGE_KEY)
          return activeUser
        }
      },
    },
  }
)
