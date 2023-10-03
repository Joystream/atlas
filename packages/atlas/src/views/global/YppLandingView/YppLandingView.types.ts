export type YppChannelTierTypes = 'Verified::Bronze' | 'Verified::Silver' | 'Verified::Gold' | 'Verified::Diamond'

export type YppChannelSuspendedTypes =
  | 'Suspended::SubparQuality'
  | 'Suspended::DuplicateContent'
  | 'Suspended::UnsupportedTopic'
  | 'Suspended::ProgramTermsExploit'

export type YppChannelStatus = YppChannelTierTypes | YppChannelSuspendedTypes | 'Unverified' | 'OptedOut'
export type YppSyncedChannel = {
  title: string
  description: string
  aggregatedStats: number
  shouldBeIngested: boolean
  yppStatus: YppChannelStatus
  joystreamChannelId: number
  videoCategoryId: string
  thumbnails: {
    default: string
    medium: string
    high: string
    maxRes: string
    standard: string
  }
  subscribersCount: number
  createdAt: string
  referredChannels: {
    joystreamChannelId: number
    createdAt: string
    subscribersCount: number
    yppStatus: 'Unverified' | 'Suspended' | 'Verified'
  }[]
  referrerChannelId: string
  syncStatus: {
    backlogCount: number
    fullSyncEta: number
    placeInSyncQueue: number
  }
}
