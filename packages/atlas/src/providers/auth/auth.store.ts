import { createStore } from '@/utils/store'

type AuthModals = 'logIn' | 'externalLogIn' | 'signUp'

export type AuthStoreState = {
  anonymousUserId: string | null
  authModalOpenName?: AuthModals
  encodedSeed: string | null
}

export type AuthStoreActions = {
  setAnonymousUserId: (anonymousUserId: string | null) => void
  setEncodedSeed: (encodedSeed: string | null) => void
  setAuthModalOpenName: (modal?: AuthModals) => void
}

export const useAuthStore = createStore<AuthStoreState, AuthStoreActions>(
  {
    state: {
      anonymousUserId: null,
      authModalOpenName: undefined,
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
      setAuthModalOpenName: (modal) => {
        set((state) => {
          state.authModalOpenName = modal
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
