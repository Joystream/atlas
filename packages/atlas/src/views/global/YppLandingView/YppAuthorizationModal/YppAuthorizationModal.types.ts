import { FullMembershipFieldsFragment } from '@/api/queries/__generated__/fragments.generated'

export type MemberChannel = FullMembershipFieldsFragment['channels'][0]

export enum YppAuthorizationErrorCode {
  CHANNEL_ALREADY_REGISTERED = 'CHANNEL_ALREADY_REGISTERED',
  CHANNEL_NOT_FOUND = 'CHANNEL_NOT_FOUND',
  CHANNEL_CRITERIA_UNMET_SUBSCRIBERS = 'CHANNEL_CRITERIA_UNMET_SUBSCRIBERS',
  CHANNEL_CRITERIA_UNMET_VIDEOS = 'CHANNEL_CRITERIA_UNMET_VIDEOS',
  CHANNEL_CRITERIA_UNMET_CREATION_DATE = 'CHANNEL_CRITERIA_UNMET_CREATION_DATE',
  CHANNEL_STATUS_SUSPENDED = 'CHANNEL_STATUS_SUSPENDED',
  CHANNEL_CRITERIA_UNMET_NEW_VIDEOS_REQUIREMENT = 'CHANNEL_CRITERIA_UNMET_NEW_VIDEOS_REQUIREMENT',
  YOUTUBE_QUOTA_LIMIT_EXCEEDED = 'YOUTUBE_QUOTA_LIMIT_EXCEEDED',
  YOUTUBE_API_NOT_CONNECTED = 'YOUTUBE_API_NOT_CONNECTED',
  QUERY_NODE_NOT_CONNECTED = 'QUERY_NODE_NOT_CONNECTED',
}

export type YppRequirementsErrorCode = PickEnum<
  YppAuthorizationErrorCode,
  | YppAuthorizationErrorCode.CHANNEL_CRITERIA_UNMET_SUBSCRIBERS
  | YppAuthorizationErrorCode.CHANNEL_CRITERIA_UNMET_VIDEOS
  | YppAuthorizationErrorCode.CHANNEL_CRITERIA_UNMET_CREATION_DATE
  | YppAuthorizationErrorCode.CHANNEL_CRITERIA_UNMET_NEW_VIDEOS_REQUIREMENT
  | YppAuthorizationErrorCode.CHANNEL_STATUS_SUSPENDED
>

export type ChannelVerificationSuccessResponse = {
  email: string
  userId: string
  channelHandle: string
  channelTitle: string
  channelDescription?: string
  channelLanguage?: string
  avatarUrl?: string
  bannerUrl?: string
}

export type ChannelRequirements = {
  requirements: {
    errorCode: YppRequirementsErrorCode
    text: string
  }[]
}

type ChannelRequirementsFailedError = {
  code: YppRequirementsErrorCode
  message: string
  result: number | string | Date
  expected: number | string | Date
}

export type YppError = {
  code: YppAuthorizationErrorCode
  message: string
}

export type ChannelAlreadyRegisteredError = YppError & {
  code: YppAuthorizationErrorCode.CHANNEL_ALREADY_REGISTERED
  // already registered channel id
  result: number
}

export type ChannelVerificationErrorResponse =
  | {
      message: ChannelRequirementsFailedError[]
    }
  | YppError
  | ChannelAlreadyRegisteredError
