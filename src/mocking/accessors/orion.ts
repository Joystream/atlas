import {
  GetBatchedVideoViewsQuery,
  GetBatchedVideoViewsQueryVariables,
  GetChannelFollowsQuery,
  GetChannelFollowsQueryVariables,
} from '@/api/queries'

import { MocksStore } from '../types'

export const createBatchedVideoViewsAccessor = (store: MocksStore) => (
  variables: GetBatchedVideoViewsQueryVariables
): GetBatchedVideoViewsQuery['batchedVideoViews'] => {
  const { videoIdList } = variables

  const batchedVideoViews = store.batchedVideoViews.filter((view) => videoIdList.includes(view.id))
  if (!batchedVideoViews.length) {
    return []
  }

  return batchedVideoViews
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
