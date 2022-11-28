import { FullMembershipFieldsFragment } from '@/api/queries/__generated__/fragments.generated'

export type MemberChannel = FullMembershipFieldsFragment['channels'][0]

export type YppAuthorizationStepsType =
  | 'select-channel'
  | 'requirements'
  | 'fetching-data'
  | 'details'
  | 'terms-and-conditions'
  | 'summary'
  | 'channel-already-registered'
  | 'connect-with-youtube'
  | null

export enum YppAuthorizationErrorCode {
  CHANNEL_ALREADY_REGISTERED = 'CHANNEL_ALREADY_REGISTERED',
  CHANNEL_NOT_FOUND = 'CHANNEL_NOT_FOUND',
  CHANNEL_CRITERIA_UNMET_SUBSCRIBERS = 'CHANNEL_CRITERIA_UNMET_SUBSCRIBERS',
  CHANNEL_CRITERIA_UNMET_VIDEOS = 'CHANNEL_CRITERIA_UNMET_VIDEOS',
  CHANNEL_CRITERIA_UNMET_CREATION_DATE = 'CHANNEL_CRITERIA_UNMET_CREATION_DATE',
}

export type YppRequirementsErrorCode = Omit<
  YppAuthorizationErrorCode,
  YppAuthorizationErrorCode.CHANNEL_ALREADY_REGISTERED | YppAuthorizationErrorCode.CHANNEL_NOT_FOUND
>

export type ChannelVerificationSuccessResponse = {
  email: string
  userId: string
}

type ChannelRequirmentsFailedError = {
  errorCode: YppRequirementsErrorCode
  message: string
  result: number | string | Date
  expected: number | string | Date
}

export type ChannelNotFoundError = {
  errorCode: YppAuthorizationErrorCode.CHANNEL_NOT_FOUND
  message: string
}

export type ChannelAleadryRegisteredError = {
  errorCode: YppAuthorizationErrorCode.CHANNEL_ALREADY_REGISTERED
  message: string
  // already registered channel id
  result: number
}

export type ChannelVerificationErrorResponse =
  | {
      message: ChannelRequirmentsFailedError[]
    }
  | ChannelNotFoundError
  | ChannelAleadryRegisteredError

export type YoutubeResponseData = {
  email: string
  userId: string
  authorizationCode: string
}
