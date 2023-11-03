import { createStore } from '@/utils/store'

import { YppModalStep, YtResponseData } from './ypp.types'

type YppStoreState = {
  referrerId: string | null
  selectedChannelId: string | null
  utmSource: string | null
  utmCampaign: string | null
  yppModalOpenName: YppModalStep
  shouldContinueYppFlowAfterLogin: boolean
  shouldContinueYppFlowAfterCreatingChannel: boolean
  ytResponseData: YtResponseData
}

type YppStoreActions = {
  setReferrerId: (referrerId: string | null) => void
  setSelectedChannelId: (selectedChannelId: string | null) => void
  setUtmSource: (utmSource: string | null) => void
  setUtmCampaign: (utmCampaign: string | null) => void
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
      utmSource: null,
      utmCampaign: null,
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
      setUtmSource: (utmSource) => {
        set((state) => {
          state.utmSource = utmSource
        })
      },
      setUtmCampaign: (utmCampaign) => {
        set((state) => {
          state.utmCampaign = utmCampaign
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
      whitelist: ['referrerId', 'utmSource'],
      version: 0,
      migrate: (oldState) => oldState,
    },
  }
)
