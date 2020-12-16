type WatchedVideoFields = {
  id: string
}

export const INTERRUPTED_VIDEO = 'INTERRUPTED'
export const COMPLETED_VIDEO = 'COMPLETED'

type InterruptedVideo = WatchedVideoFields & {
  __typename: typeof INTERRUPTED_VIDEO
  timestamp: number
}
type CompletedVideo = WatchedVideoFields & {
  __typename: typeof COMPLETED_VIDEO
  id: string
}
type WatchedVideo = InterruptedVideo | CompletedVideo

type FollowedChannel = {
  id: string
}

interface UserPersonalData {
  // ==== watched videos ====

  // get all the interrupted or completed videos
  watchedVideos: () => Promise<WatchedVideo[]>

  // get all the interrupted videos
  interruptedVideos: () => Promise<InterruptedVideo[]>

  // get all the completed videos
  completedVideos: () => Promise<CompletedVideo[]>

  // get status of one specific watched video
  watchedVideo: (id: string) => Promise<WatchedVideo | null>

  // mark the video as interrupted
  setWatchedVideo: (__typename: typeof INTERRUPTED_VIDEO, id: string, timestamp: number) => Promise<void>

  // mark the video as completed
  setWatchedVideo: (__typename: typeof COMPLETED_VIDEO, id: string) => Promise<void>

  // ==== followed channels ====

  // get all the followed channels
  followedChannels: () => Promise<FollowedChannel[]>

  // set the channel following status
  setChannelFollowing: (id: string, follow: boolean) => Promise<void>

  // get the following status of one specific channel
  isFollowingChannel: (id: string) => Promise<boolean>
}

export type UsePersonalData = () => UserPersonalData
