import { createStore } from '@/utils/store'

import { YppModal, YtResponseData } from './ypp.types'

type YppStoreState = {
  referrerId: string | null
  selectedChannelId: string | null
  /**
   * 'state' param passed to Google auth URL
   */
  ytStateParam: string | null
  yppModalOpenName: YppModal
  shouldContinueYppFlow: boolean
  ytResponseData: YtResponseData
}

type YppStoreActions = {
  setReferrerId: (referrerId: string | null) => void
  setSelectedChannelId: (selectedChannelId: string | null) => void
  /**
   * sets 'state' param passed to Google auth URL
   */
  setYtStateParam: (authState: string | null) => void
  setYppModalOpenName: (modal: YppModal) => void
  setShouldContinueYppFlow: (shouldContinueYppFlow: boolean) => void
  setYtResponseData: (ytResponseData: YtResponseData) => void
}

export const useYppStore = createStore<YppStoreState, YppStoreActions>(
  {
    state: {
      referrerId: null,
      selectedChannelId: null,
      ytStateParam: null,
      yppModalOpenName: null,
      shouldContinueYppFlow: false,
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
      setYppModalOpenName: (modal) => {
        set((state) => {
          state.yppModalOpenName = modal
        })
      },
      setShouldContinueYppFlow: (shouldContinueYppFlow) => {
        set((state) => {
          state.shouldContinueYppFlow = shouldContinueYppFlow
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
      whitelist: ['referrerId', 'ytStateParam'],
      version: 0,
      migrate: (oldState) => oldState,
    },
  }
)
