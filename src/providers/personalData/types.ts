export type WatchedVideoStatus = 'INTERRUPTED' | 'COMPLETED' | 'REMOVED'

export type WatchedVideo = {
  id: string
  __typename: WatchedVideoStatus
  timestamp?: number
}

export type FollowedChannel = {
  id: string
}

export type RecentSearchType = 'video' | 'channel'
export type RecentSearch = {
  id: number
  title?: string
}

export type DismissedMessage = {
  id: string
}
