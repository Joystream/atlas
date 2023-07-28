export type CreateTokenForm = SetupStepForm & IssuanceStepForm

export type SetupStepForm = {
  name: string
  isOpen: boolean
  revenueShare: number
  creatorReward: number
}

export type IssuanceStepForm = {
  creatorIssueAmount?: number
  assuranceType: 'safe' | 'risky' | 'secure' | 'default' | 'custom'
  cliff: '0' | '1' | '3' | '6' | null
  vesting: '0' | '1' | '3' | '6' | null
  firstPayout?: number
}
