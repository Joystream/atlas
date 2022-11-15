import { FullMembershipFieldsFragment } from '@/api/queries/__generated__/fragments.generated'

export type MemberChannel = FullMembershipFieldsFragment['channels'][0]

export const YPP_AUTHORIZATION_STEPS = [
  'select-channel',
  'requirements',
  'fetching-data',
  'details',
  'terms-and-conditions',
  'summary',
] as const
export const YPP_AUTHORIZATION_STEPS_WITHOUT_CHANNEL_SELECT = YPP_AUTHORIZATION_STEPS.slice(1)

export type YppAuthorizationStepsType =
  | typeof YPP_AUTHORIZATION_STEPS[number]
  | typeof YPP_AUTHORIZATION_STEPS_WITHOUT_CHANNEL_SELECT[number]

export enum RequirmentError {
  CHANNEL_CRITERIA_UNMET_SUBSCRIBERS = 'CHANNEL_CRITERIA_UNMET_SUBSCRIBERS',
  CHANNEL_CRITERIA_UNMET_VIDEOS = 'CHANNEL_CRITERIA_UNMET_VIDEOS',
  CHANNEL_CRITERIA_UNMET_CREATION_DATE = 'CHANNEL_CRITERIA_UNMET_CREATION_DATE',
}

export type ChannelVerificationSuccessResponse = {
  email: string
  userId: string
}

type ChannelVerificationFailedError = {
  errorCode: RequirmentError
  message: string
  result: number | string | Date
  expected: number | string | Date
}

export type ChannelNotFoundError = {
  errorCode: 'CHANNEL_NOT_FOUND'
  message: string
}

export type ChannelVerificationErrorResponse =
  | {
      message: ChannelVerificationFailedError[]
    }
  | ChannelNotFoundError

export type YoutubeResponseData = {
  email: string
  userId: string
  authorizationCode: string
}
