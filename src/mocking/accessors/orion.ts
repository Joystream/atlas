import {
  GetChannelFollowsQuery,
  GetChannelFollowsQueryVariables,
  GetVideoViewsQuery,
  GetVideoViewsQueryVariables,
} from '@/api/queries'

import { MocksStore } from '../types'

export const createVideoViewsAccessor = (store: MocksStore) => (
  variables: GetVideoViewsQueryVariables
): GetVideoViewsQuery['videoViews'] => {
  const { videoId } = variables

  const views = store.videoViews[videoId]

  if (views == null) {
    return null
  }

  return {
    id: videoId,
    views,
  }
}

export const createChannelFollowsAccessor = (store: MocksStore) => (
  variables: GetChannelFollowsQueryVariables
): GetChannelFollowsQuery['channelFollows'] => {
  const { channelId } = variables

  const follows = store.channelFollows[channelId]

  if (follows == null) {
    return null
  }

  return {
    id: channelId,
    follows,
  }
}
