type WatchedVideoFields = {
  id: string
}

export const INTERRUPTED_VIDEO = 'INTERRUPTED'
export const COMPLETED_VIDEO = 'COMPLETED'
export const REMOVED_VIDEO = 'REMOVED'

export type InterruptedVideo = WatchedVideoFields & {
  __typename: typeof INTERRUPTED_VIDEO
  timestamp: number
}
export type CompletedVideo = WatchedVideoFields & {
  __typename: typeof COMPLETED_VIDEO
  id: string
}

export type RemovedVideo = WatchedVideoFields & {
  __typename: typeof REMOVED_VIDEO
  id: string
}
export type WatchedVideo = InterruptedVideo | CompletedVideo | RemovedVideo

export type FollowedChannel = {
  id: string
}

export type RecentSearch = {
  id: string
  type: 'video' | 'channel'
}

export type DismissedMessage = {
  id: string
}

export interface PersonalDataClient {
  // ==== watched videos ====

  // get all the interrupted or completed videos
  watchedVideos: () => Promise<WatchedVideo[]>

  // get all the interrupted videos
  interruptedVideos: () => Promise<InterruptedVideo[]>

  // get all the completed videos
  completedVideos: () => Promise<CompletedVideo[]>

  // get status of one specific watched video
  watchedVideo: (id: string) => Promise<WatchedVideo | null>

  // mark the video as interrupted or completed
  setWatchedVideo: (
    __typename: typeof INTERRUPTED_VIDEO | typeof COMPLETED_VIDEO | typeof REMOVED_VIDEO,
    id: string,
    timestamp?: number
  ) => Promise<void>

  // ==== followed channels ====

  // get all the followed channels
  followedChannels: () => Promise<FollowedChannel[]>

  // set the channel following status
  setChannelFollowing: (id: string, follow: boolean) => Promise<void>

  // get the following status of one specific channel
  isFollowingChannel: (id: string) => Promise<boolean>

  // === recent searches ===

  // get all recent searches
  recentSearches: () => Promise<RecentSearch[]>

  // add a recent search
  setRecentSearch: (id: string, type: 'video' | 'channel') => Promise<void>

  // === dismissed messages ===

  // get all dismissed messages
  dismissedMessages: () => Promise<DismissedMessage[]>

  // add a dismissed message
  setDismissedMessage: (id: string, add?: boolean) => Promise<void>
}
