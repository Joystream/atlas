import { ChannelVerificationSuccessResponse } from '@/views/global/YppLandingView/YppAuthorizationModal/YppAuthorizationModal.types'

export type YppModal =
  | 'ypp-select-channel'
  | 'ypp-requirements'
  | 'ypp-fetching-data'
  | 'ypp-sync-options'
  | 'ypp-channel-already-registered'
  | 'ypp-speaking-to-backend'
  | null

export type YtResponseData = (ChannelVerificationSuccessResponse & { authorizationCode: string }) | null
