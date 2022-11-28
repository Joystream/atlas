import { createStore } from '@/utils/store'

type YppStoreState = {
  referrerId: string | null
  selectedChannelId: string | null
  authState: string | null // 'state' param passed to Google auth URL
  shouldContinueYppFlow: boolean
  showConnectToYoutubeDialog: boolean
}

type YppStoreActions = {
  setReferrerId: (referrerId: string | null) => void
  setSelectedChannelId: (selectedChannelId: string | null) => void
  setAuthState: (authState: string | null) => void
  setShouldContinueYppFlow: (shouldContinueYppFlow: boolean) => void
  setShowConnectToYoutubeDialog: (showConnectToYoutubeDialog: boolean) => void
}

export const useYppStore = createStore<YppStoreState, YppStoreActions>(
  {
    state: {
      referrerId: null,
      selectedChannelId: null,
      authState: null,
      shouldContinueYppFlow: false,
      showConnectToYoutubeDialog: false,
    },
    actionsFactory: (set) => ({
      setReferrerId: (referrerId) => {
        set((state) => {
          state.referrerId = referrerId
        })
      },
      setSelectedChannelId: (selectedChannelId) => {
        set((state) => {
          state.selectedChannelId = selectedChannelId
        })
      },
      setAuthState: (authState) => {
        set((state) => {
          state.authState = authState
        })
      },
      setShouldContinueYppFlow: (shouldContinueYppFlow) => {
        set((state) => {
          state.shouldContinueYppFlow = shouldContinueYppFlow
        })
      },
      setShowConnectToYoutubeDialog: (showConnectToYoutubeDialog) => {
        set((state) => {
          state.showConnectToYoutubeDialog = showConnectToYoutubeDialog
        })
      },
    }),
  },
  {
    persist: {
      key: 'ypp',
      whitelist: ['referrerId', 'authState'],
      version: 0,
      migrate: (oldState) => oldState,
    },
  }
)
