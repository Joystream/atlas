import { FullMembershipFieldsFragment } from '@/api/queries/__generated__/fragments.generated'

export type MemberChannel = FullMembershipFieldsFragment['channels'][0]

export type YppAuthorizationStepsType =
  | 'select-channel'
  | 'requirements'
  | 'fetching-data'
  | 'details'
  | 'ypp-sync'
  | 'terms-and-conditions'
  | 'summary'
  | 'channel-already-registered'
  | null

export enum YppAuthorizationErrorCode {
  CHANNEL_ALREADY_REGISTERED = 'CHANNEL_ALREADY_REGISTERED',
  CHANNEL_NOT_FOUND = 'CHANNEL_NOT_FOUND',
  CHANNEL_CRITERIA_UNMET_SUBSCRIBERS = 'CHANNEL_CRITERIA_UNMET_SUBSCRIBERS',
  CHANNEL_CRITERIA_UNMET_VIDEOS = 'CHANNEL_CRITERIA_UNMET_VIDEOS',
  CHANNEL_CRITERIA_UNMET_CREATION_DATE = 'CHANNEL_CRITERIA_UNMET_CREATION_DATE',
  YOUTUBE_QUOTA_LIMIT_EXCEEDED = 'YOUTUBE_QUOTA_LIMIT_EXCEEDED',
  YOUTUBE_API_NOT_CONNECTED = 'YOUTUBE_API_NOT_CONNECTED',
  QUERY_NODE_NOT_CONNECTED = 'QUERY_NODE_NOT_CONNECTED',
}

export type YppRequirementsErrorCode = Omit<
  YppAuthorizationErrorCode,
  | YppAuthorizationErrorCode.CHANNEL_ALREADY_REGISTERED
  | YppAuthorizationErrorCode.CHANNEL_NOT_FOUND
  | YppAuthorizationErrorCode.YOUTUBE_QUOTA_LIMIT_EXCEEDED
  | YppAuthorizationErrorCode.YOUTUBE_API_NOT_CONNECTED
  | YppAuthorizationErrorCode.QUERY_NODE_NOT_CONNECTED
>

export type ChannelVerificationSuccessResponse = {
  email: string
  userId: string
}

export type ChannelRequirements = {
  MINIMUM_SUBSCRIBERS_COUNT: number
  MINIMUM_VIDEO_COUNT: number
  MINIMUM_VIDEO_AGE_HOURS: number
  MINIMUM_CHANNEL_AGE_HOURS: number
}

type ChannelRequirementsFailedError = {
  errorCode: YppRequirementsErrorCode
  message: string
  result: number | string | Date
  expected: number | string | Date
}

export type TestErrorType = {
  code: YppAuthorizationErrorCode
  message: string
}

export type ChannelAlreadyRegisteredError = TestErrorType & {
  code: YppAuthorizationErrorCode.CHANNEL_ALREADY_REGISTERED
  result: number
}

export type ChannelNotFoundError = {
  code: YppAuthorizationErrorCode.CHANNEL_NOT_FOUND
  message: string
}

// export type ChannelAlreadyRegisteredError = {
//   code: YppAuthorizationErrorCode.CHANNEL_ALREADY_REGISTERED
//   message: string
//   // already registered channel id
//   result: number
// }

export type YoutubeQuotaReachedError = {
  code: YppAuthorizationErrorCode.YOUTUBE_QUOTA_LIMIT_EXCEEDED
  message: string
}

export type YoutubeAPINotConnectedError = {
  code: YppAuthorizationErrorCode.YOUTUBE_API_NOT_CONNECTED
  message: string
}

export type QueryNodeNotConnectedError = {
  code: YppAuthorizationErrorCode.QUERY_NODE_NOT_CONNECTED
  message: string
}

export type ChannelVerificationErrorResponse =
  | {
      message: ChannelRequirementsFailedError[]
    }
  | TestErrorType
  | ChannelAlreadyRegisteredError

export type YoutubeResponseData = {
  email: string
  userId: string
  authorizationCode: string
}
