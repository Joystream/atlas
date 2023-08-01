import { createStore } from '@/utils/store'

import { YppModalStep, YtResponseData } from './ypp.types'

type YppStoreState = {
  referrerId: string | null
  selectedChannelId: string | null
  /**
   * 'state' param passed to Google auth URL
   */
  ytStateParam: string | null
  utmSource: string | null
  yppModalOpenName: YppModalStep
  shouldContinueYppFlowAfterLogin: boolean
  shouldContinueYppFlowAfterCreatingChannel: boolean
  ytResponseData: YtResponseData
}

type YppStoreActions = {
  setReferrerId: (referrerId: string | null) => void
  setSelectedChannelId: (selectedChannelId: string | null) => void
  /**
   * sets 'state' param passed to Google auth URL
   */
  setYtStateParam: (authState: string | null) => void
  setUtmSource: (utmSource: string | null) => void
  setYppModalOpenName: (modal: YppModalStep) => void
  setShouldContinueYppFlowAfterLogin: (shouldContinueYppFlow: boolean) => void
  setShouldContinueYppFlowAfterCreatingChannel: (shouldContinueYppFlow: boolean) => void
  setYtResponseData: (ytResponseData: YtResponseData) => void
}

export const useYppStore = createStore<YppStoreState, YppStoreActions>(
  {
    state: {
      referrerId: null,
      selectedChannelId: null,
      ytStateParam: null,
      utmSource: null,
      yppModalOpenName: null,
      shouldContinueYppFlowAfterLogin: false,
      shouldContinueYppFlowAfterCreatingChannel: false,
      ytResponseData: null,
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
      setYtStateParam: (authState) => {
        set((state) => {
          state.ytStateParam = authState
        })
      },
      setUtmSource: (utmSource) => {
        set((state) => {
          state.utmSource = utmSource
        })
      },
      setYppModalOpenName: (modal) => {
        set((state) => {
          state.yppModalOpenName = modal
        })
      },
      setShouldContinueYppFlowAfterLogin: (shouldContinueYppFlow) => {
        set((state) => {
          state.shouldContinueYppFlowAfterLogin = shouldContinueYppFlow
        })
      },
      setShouldContinueYppFlowAfterCreatingChannel: (shouldContinueYppFlow) => {
        set((state) => {
          state.shouldContinueYppFlowAfterCreatingChannel = shouldContinueYppFlow
        })
      },
      setYtResponseData: (ytResponseData) => {
        set((state) => {
          state.ytResponseData = ytResponseData
        })
      },
    }),
  },
  {
    persist: {
      key: 'ypp',
      whitelist: ['referrerId', 'ytStateParam', 'utmSource'],
      version: 0,
      migrate: (oldState) => oldState,
    },
  }
)
