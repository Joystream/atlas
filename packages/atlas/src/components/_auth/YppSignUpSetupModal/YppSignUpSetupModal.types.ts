export enum YppSetupModalStep {
  ytVideoUrl = 'ytVideoUrl',
  channelVerification = 'channelVerification',
  ownershipProved = 'ownershipProved',
  // user has no account
  email = 'email',

  yppForm = 'yppForm',
  // user has account, but no channel
  channelCreation = 'channelCreation',
  // user has channel
  channelConnection = 'channelConnection',
}

export type YppFormData = {
  youtubeVideoUrl?: string
  id?: string
  joystreamChannelId?: string
  email?: string
  referrerChannelId?: string
  shouldBeIngested?: boolean
  videoCategoryId?: string
}

export type YppResponseData = {
  'id': string
  'channelHandle': string
  'channelTitle': string
  'channelDescription': string
  'channelLanguage': string
  'avatarUrl': string
  'bannerUrl': string
}

export type YppSetupForm = {
  videoUrl?: string
  channelTitle?: string
} & Partial<YppResponseData> &
  YppFormData
