export enum VideoStates {
  New = 1,
  // `create_video` extrinsic errored
  VideoCreationFailed = 2,
  // Video is being creating on Joystream network (by calling extrinsics, but not yet uploaded)
  CreatingVideo = 3,
  // Video has been created on Joystream network (by calling extrinsics, but not yet uploaded)
  VideoCreated = 4,
  // Video upload to Joystream failed
  UploadFailed = 5,
  // Video is being uploaded to Joystream
  UploadStarted = 6,
  // Video upload to Joystream succeeded
  UploadSucceeded = 7,
  // Video was deleted from joystream, so it should not be synced again
  NotToBeSyncedAgain = 8,
}
export type VideoState = keyof typeof VideoStates

export type JoystreamVideo = {
  // Joystream runtime Video ID for successfully synced video
  id: string

  // Data Object IDs (first element is the video, the second is the thumbnail)
  assetIds: string[]
}

export type YppVideoDto = {
  url: string
  title: string
  description: string
  category: string
  id: string
  playlistId: string
  resourceId: string
  channelId: string
  // thumbnails: ThumbnailsDto
  state: VideoState
  destinationUrl: string
  duration: number
  language: string
  privacyStatus: 'private' | 'public'
  joystreamVideo?: JoystreamVideo
}
