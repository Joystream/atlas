type WatchedVideoFields = {
  id: string
}

export const INTERRUPTED_VIDEO = 'INTERRUPTED'
export const COMPLETED_VIDEO = 'COMPLETED'

export type InterruptedVideo = WatchedVideoFields & {
  __typename: typeof INTERRUPTED_VIDEO
  timestamp: number
}
export type CompletedVideo = WatchedVideoFields & {
  __typename: typeof COMPLETED_VIDEO
  id: string
}
export type WatchedVideo = InterruptedVideo | CompletedVideo

export type FollowedChannel = {
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
    __typename: typeof INTERRUPTED_VIDEO | typeof COMPLETED_VIDEO,
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
}
