import { createStore } from '@/utils/store'

import { UserSigner } from './auth.types'

export type AuthStoreState = {
  anonymousUserId: string | null
  signInModalOpen: boolean
  previouslyLoggedUserAccount: string | null
  previouslyUsedSigner: UserSigner | null
  encodedSeed: string | null
}

export type AuthStoreActions = {
  setAnonymousUserId: (anonymousUserId: string | null) => void
  setPreviouslyLoggedUserAccount: (previouslyLoggedUserAccount: string | null) => void
  setEncodedSeed: (encodedSeed: string) => void
  setPreviouslyUsedSigner: (previouslyLoggedUserAccount: UserSigner | null) => void
  setSignInModalOpen: (isOpen: boolean) => void
}

export const useAuthStore = createStore<AuthStoreState, AuthStoreActions>(
  {
    state: {
      anonymousUserId: null,
      signInModalOpen: false,
      previouslyLoggedUserAccount: null,
      previouslyUsedSigner: null,
      encodedSeed: null,
    },
    actionsFactory: (set) => ({
      setAnonymousUserId: (anonymousUserId) => {
        set((state) => {
          state.anonymousUserId = anonymousUserId
        })
      },
      setEncodedSeed: (encodedSeed) => {
        set((state) => {
          state.encodedSeed = encodedSeed
        })
      },
      setPreviouslyUsedSigner: (previouslyUsedSigner) => {
        set((state) => {
          state.previouslyUsedSigner = previouslyUsedSigner
        })
      },
      setPreviouslyLoggedUserAccount: (previouslyLoggedUserAccount) => {
        set((state) => {
          state.previouslyLoggedUserAccount = previouslyLoggedUserAccount
        })
      },
      setSignInModalOpen: (isOpen) => {
        set((state) => {
          state.signInModalOpen = isOpen
        })
      },
    }),
  },
  {
    persist: {
      key: 'auth',
      version: 0,
      whitelist: ['anonymousUserId'],
      migrate: (oldState) => {
        return oldState
      },
    },
  }
)
