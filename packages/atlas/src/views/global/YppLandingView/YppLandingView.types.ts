type YppStatus = 'Unverified' | 'Verified' | 'Suspended' | 'OptedOut'

export type YppSyncedChannel = {
  title: string
  description: string
  aggregatedStats: number
  shouldBeIngested: boolean
  yppStatus: YppStatus
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
}
