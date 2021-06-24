import { DocumentNode } from 'graphql'

import {
  AddVideoViewDocument,
  AddVideoViewMutation,
  AddVideoViewMutationVariables,
  FollowChannelDocument,
  FollowChannelMutation,
  FollowChannelMutationVariables,
  UnfollowChannelDocument,
  UnfollowChannelMutation,
  UnfollowChannelMutationVariables,
} from '@/api/queries'
import { Logger } from '@/utils/logger'

import { BaseDataQuery, DataMutator, Link, MocksStore } from './types'
import { normalizeVariables, parseOperationDocument } from './utils'

const createGenericMutationHandler = <TQuery extends BaseDataQuery, TVariables = unknown>(
  link: Link,
  mutationDocument: DocumentNode,
  dataMutator: DataMutator<TQuery, TVariables>
) => {
  const { operationName } = parseOperationDocument(mutationDocument)
  if (!operationName) {
    Logger.error('Unable to resolve operation name for mocking', mutationDocument)
    return
  }

  return link.mutation<TQuery, TVariables>(operationName, (req, res, context) => {
    const normalizedVars = normalizeVariables(req.variables)
    const data = dataMutator(normalizedVars)

    return res(context.delay(), context.data(data))
  })
}

export const createAddVideoViewMutationHandler = (link: Link, store: MocksStore) =>
  createGenericMutationHandler<AddVideoViewMutation, AddVideoViewMutationVariables>(
    link,
    AddVideoViewDocument,
    (variables) => {
      const { videoId } = variables
      const idx = store.batchedVideoViews.findIndex((view) => view.id === videoId)
      const currentValue = store.batchedVideoViews[idx].views || store.videoViews[videoId] || 0
      const newValue = currentValue + 1
      store.batchedVideoViews[idx].views = newValue
      store.videoViews[videoId] = newValue

      return {
        addVideoView: {
          id: videoId,
          views: newValue,
        },
      }
    }
  )

export const createFollowChannelMutationHandler = (link: Link, store: MocksStore) =>
  createGenericMutationHandler<FollowChannelMutation, FollowChannelMutationVariables>(
    link,
    FollowChannelDocument,
    (variables) => {
      const { channelId } = variables

      const currentValue = store.channelFollows[channelId] || 0
      const newValue = currentValue + 1
      store.channelFollows[channelId] = newValue

      return {
        followChannel: {
          id: channelId,
          follows: newValue,
        },
      }
    }
  )

export const createUnfollowChannelMutationHandler = (link: Link, store: MocksStore) =>
  createGenericMutationHandler<UnfollowChannelMutation, UnfollowChannelMutationVariables>(
    link,
    UnfollowChannelDocument,
    (variables) => {
      const { channelId } = variables

      const currentValue = store.channelFollows[channelId] || 0
      const newValue = Math.max(currentValue - 1, 0)
      store.channelFollows[channelId] = newValue

      return {
        unfollowChannel: {
          id: channelId,
          follows: newValue,
        },
      }
    }
  )
