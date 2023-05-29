import { createStore } from '@/utils/store'

export type AuthStoreState = {
  anonymousUserId: string | null
  signInModalOpen: boolean
  encodedSeed: string | null
}

export type AuthStoreActions = {
  setAnonymousUserId: (anonymousUserId: string | null) => void
  setEncodedSeed: (encodedSeed: string) => void
  setSignInModalOpen: (isOpen: boolean) => void
}

export const useAuthStore = createStore<AuthStoreState, AuthStoreActions>(
  {
    state: {
      anonymousUserId: null,
      signInModalOpen: false,
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
      whitelist: ['anonymousUserId', 'encodedSeed'],
      migrate: (oldState) => {
        return oldState
      },
    },
  }
)
