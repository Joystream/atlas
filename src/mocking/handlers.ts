import { graphql, GraphQLHandler } from 'msw'
import { ORION_GRAPHQL_URL, QUERY_NODE_GRAPHQL_URL } from '@/config/urls'
import {
  GetBasicChannelDocument,
  GetBasicChannelQuery,
  GetBasicChannelQueryVariables,
  GetCategoriesDocument,
  GetCategoriesQuery,
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
  GetVideoCountDocument,
  GetVideoCountQuery,
  GetVideoCountQueryVariables,
  GetFeaturedVideosDocument,
  GetFeaturedVideosQuery,
  GetFeaturedVideosQueryVariables,
  GetVideoDocument,
  GetVideoQuery,
  GetVideoQueryVariables,
  GetVideosConnectionDocument,
  GetVideosConnectionQuery,
  GetVideosConnectionQueryVariables,
  GetVideosDocument,
  GetVideosQuery,
  GetVideosQueryVariables,
  GetVideoViewsDocument,
  GetVideoViewsQuery,
  GetVideoViewsQueryVariables,
  GetMembershipQuery,
  GetMembershipsQuery,
  GetMembershipQueryVariables,
  GetMembershipsQueryVariables,
  GetMembershipDocument,
  GetMembershipsDocument,
  SearchDocument,
  SearchQuery,
  SearchQueryVariables,
} from '@/api/queries'
import { FEATURED_VIDEOS_INDEXES, mockCategories, mockChannels, mockVideos, mockMemberships } from '@/mocking/data'
import { createQueryHandler } from './queries'
import {
  createChannelFollowsAccessor,
  createCursorPaginationAccessor,
  createOffsetLimitPaginationAccessor,
  createFeaturedVideosAccessor,
  createSearchAccessor,
  createSingleItemAccessor,
  createTotalCountAccessor,
  createVideoViewsAccessor,
  filterAndSortGenericData,
} from './accessors'
import { createStore } from './store'
import {
  createAddVideoViewMutationHandler,
  createFollowChannelMutationHandler,
  createUnfollowChannelMutationHandler,
} from './mutations'

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
  createQueryHandler<GetFeaturedVideosQuery, GetFeaturedVideosQueryVariables>(
    queryNode,
    GetFeaturedVideosDocument,
    createFeaturedVideosAccessor(mockVideos, FEATURED_VIDEOS_INDEXES)
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
  createQueryHandler<GetCategoriesQuery>(queryNode, GetCategoriesDocument, () => mockCategories),
  createQueryHandler<SearchQuery, SearchQueryVariables>(
    queryNode,
    SearchDocument,
    createSearchAccessor({ videos: mockVideos, channels: mockChannels })
  ),
]

const orionHandlers = [
  createQueryHandler<GetVideoViewsQuery, GetVideoViewsQueryVariables>(
    orion,
    GetVideoViewsDocument,
    createVideoViewsAccessor(store)
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
