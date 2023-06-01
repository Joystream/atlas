import { createStore } from '@/utils/store'

type AuthModals = 'logIn' | 'externalLogIn' | 'signUp'

export type AuthStoreState = {
  anonymousUserId: string | null
  authModalOpen?: AuthModals
  encodedSeed: string | null
}

export type AuthStoreActions = {
  setAnonymousUserId: (anonymousUserId: string | null) => void
  setEncodedSeed: (encodedSeed: string) => void
  setAuthModalOpen: (modal?: AuthModals) => void
}

export const useAuthStore = createStore<AuthStoreState, AuthStoreActions>(
  {
    state: {
      anonymousUserId: null,
      authModalOpen: undefined,
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
      setAuthModalOpen: (modal) => {
        set((state) => {
          state.authModalOpen = modal
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
