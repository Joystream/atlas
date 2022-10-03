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
