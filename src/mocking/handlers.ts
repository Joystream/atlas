import { GraphQLHandler, graphql } from 'msw'

import {
  GetBasicChannelDocument,
  GetBasicChannelQuery,
  GetBasicChannelQueryVariables,
  GetBatchedChannelFollowsDocument,
  GetBatchedChannelFollowsQuery,
  GetBatchedChannelFollowsQueryVariables,
  GetBatchedVideoViewsDocument,
  GetBatchedVideoViewsQuery,
  GetBatchedVideoViewsQueryVariables,
  GetChannelDocument,
  GetChannelFollowsDocument,
  GetChannelFollowsQuery,
  GetChannelFollowsQueryVariables,
  GetChannelQuery,
  GetChannelQueryVariables,
  GetChannelsConnectionDocument,
  GetChannelsConnectionQuery,
  GetChannelsConnectionQueryVariables,
  GetChannelsDocument,
  GetChannelsQuery,
  GetMembershipDocument,
  GetMembershipQuery,
  GetMembershipQueryVariables,
  GetMembershipsDocument,
  GetMembershipsQuery,
  GetMembershipsQueryVariables,
  GetVideoCategoriesDocument,
  GetVideoCategoriesQuery,
  GetVideoCountDocument,
  GetVideoCountQuery,
  GetVideoCountQueryVariables,
  GetVideoDocument,
  GetVideoQuery,
  GetVideoQueryVariables,
  GetVideoViewsDocument,
  GetVideoViewsQuery,
  GetVideoViewsQueryVariables,
  GetVideosConnectionDocument,
  GetVideosConnectionQuery,
  GetVideosConnectionQueryVariables,
  GetVideosDocument,
  GetVideosQuery,
  GetVideosQueryVariables,
  SearchDocument,
  SearchQuery,
  SearchQueryVariables,
} from '@/api/queries'
import { GetWorkersDocument, GetWorkersQuery } from '@/api/queries/__generated__/workers.generated'
import { ORION_GRAPHQL_URL, QUERY_NODE_GRAPHQL_URL } from '@/config/urls'
import { mockCategories, mockChannels, mockMemberships, mockVideos, mockWorkers } from '@/mocking/data'

import {
  createBatchedChannelFollowsAccessor,
  createBatchedVideoViewsAccessor,
  createChannelFollowsAccessor,
  createCursorPaginationAccessor,
  createOffsetLimitPaginationAccessor,
  createSearchAccessor,
  createSingleItemAccessor,
  createTotalCountAccessor,
  createVideoViewsAccessor,
} from './accessors'
import {
  createAddVideoViewMutationHandler,
  createFollowChannelMutationHandler,
  createUnfollowChannelMutationHandler,
} from './mutations'
import { createQueryHandler } from './queries'
import { createStore } from './store'

const store = createStore({ videos: mockVideos, channels: mockChannels })

const queryNode = graphql.link(QUERY_NODE_GRAPHQL_URL)
const orion = graphql.link(ORION_GRAPHQL_URL)

const queryNodeHandlers = [
  // videos
  createQueryHandler<GetVideoQuery, GetVideoQueryVariables>(
    queryNode,
    GetVideoDocument,
    createSingleItemAccessor(mockVideos)
  ),
  createQueryHandler<GetVideosQuery, GetVideosQueryVariables>(
    queryNode,
    GetVideosDocument,
    createOffsetLimitPaginationAccessor(mockVideos)
  ),
  createQueryHandler<GetVideosConnectionQuery, GetVideosConnectionQueryVariables>(
    queryNode,
    GetVideosConnectionDocument,
    createCursorPaginationAccessor<GetVideosConnectionQuery['videosConnection']>(mockVideos)
  ),
  createQueryHandler<GetVideoCountQuery, GetVideoCountQueryVariables>(
    queryNode,
    GetVideoCountDocument,
    createTotalCountAccessor(mockVideos)
  ),

  // channels
  createQueryHandler<GetBasicChannelQuery, GetBasicChannelQueryVariables>(
    queryNode,
    GetBasicChannelDocument,
    createSingleItemAccessor(mockChannels)
  ),
  createQueryHandler<GetChannelQuery, GetChannelQueryVariables>(
    queryNode,
    GetChannelDocument,
    createSingleItemAccessor(mockChannels)
  ),
  createQueryHandler<GetChannelsQuery, GetChannelQueryVariables>(
    queryNode,
    GetChannelsDocument,
    createOffsetLimitPaginationAccessor(mockChannels)
  ),
  createQueryHandler<GetChannelsConnectionQuery, GetChannelsConnectionQueryVariables>(
    queryNode,
    GetChannelsConnectionDocument,
    createCursorPaginationAccessor<GetChannelsConnectionQuery['channelsConnection']>(mockChannels)
  ),

  // memberships
  createQueryHandler<GetMembershipQuery, GetMembershipQueryVariables>(
    queryNode,
    GetMembershipDocument,
    createSingleItemAccessor(mockMemberships)
  ),
  createQueryHandler<GetMembershipsQuery, GetMembershipsQueryVariables>(
    queryNode,
    GetMembershipsDocument,
    createOffsetLimitPaginationAccessor(mockMemberships)
  ),

  // misc
  createQueryHandler<GetVideoCategoriesQuery>(queryNode, GetVideoCategoriesDocument, () => mockCategories),
  createQueryHandler<SearchQuery, SearchQueryVariables>(
    queryNode,
    SearchDocument,
    createSearchAccessor({ videos: mockVideos, channels: mockChannels })
  ),
  createQueryHandler<GetWorkersQuery>(queryNode, GetWorkersDocument, () => mockWorkers),
]

const orionHandlers = [
  createQueryHandler<GetBatchedVideoViewsQuery, GetBatchedVideoViewsQueryVariables>(
    orion,
    GetBatchedVideoViewsDocument,
    createBatchedVideoViewsAccessor(store)
  ),
  createQueryHandler<GetVideoViewsQuery, GetVideoViewsQueryVariables>(
    orion,
    GetVideoViewsDocument,
    createVideoViewsAccessor(store)
  ),
  createQueryHandler<GetBatchedChannelFollowsQuery, GetBatchedChannelFollowsQueryVariables>(
    orion,
    GetBatchedChannelFollowsDocument,
    createBatchedChannelFollowsAccessor(store)
  ),
  createQueryHandler<GetChannelFollowsQuery, GetChannelFollowsQueryVariables>(
    orion,
    GetChannelFollowsDocument,
    createChannelFollowsAccessor(store)
  ),

  createAddVideoViewMutationHandler(orion, store),
  createFollowChannelMutationHandler(orion, store),
  createUnfollowChannelMutationHandler(orion, store),
]

const allHandlers = [...queryNodeHandlers, ...orionHandlers]
export const handlers = allHandlers.filter((h): h is GraphQLHandler => !!h)
