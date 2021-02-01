import { mirageGraphQLFieldResolver } from '@miragejs/graphql'
import { GetVideosConnectionQuery, VideoFieldsFragment, GetCoverVideoQuery } from '@/api/queries/videos'
import {
  AllChannelFieldsFragment,
  GetChannelsConnectionQuery,
  GetChannelsConnectionQueryVariables,
} from '@/api/queries/channels'
import { SearchQueryVariables } from '@/api/queries/search'
import { SearchFtsOutput } from '@/api/queries/baseTypes'

type QueryResolver<ArgsType extends object = Record<string, unknown>, ReturnType = unknown> = (
  obj: unknown,
  args: ArgsType,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  context: { mirageSchema: any },
  info: unknown
) => ReturnType

type VideoQueryArgs = {
  first: number | null
  after: string | null
  where: {
    categoryId_eq: string | null
    channelId_eq: string | null
  } | null
}

type FeaturedVideosQueryArgs = {
  orderBy?: string
}

type UniqueArgs = {
  where: { id: string }
}

type IdsArgs = {
  where: { id_in: string[] }
}

const filterEmptyArgs = (args: Record<string, unknown>): Record<string, unknown> => {
  return Object.keys(args).reduce((acc, key) => {
    if (args[key] != null) {
      acc[key] = args[key]
    }
    return acc
  }, {} as Record<string, unknown>)
}

export const videoResolver: QueryResolver<UniqueArgs, VideoFieldsFragment> = (obj, args, context, info) => {
  const resolverArgs = {
    id: args.where.id,
  }

  return mirageGraphQLFieldResolver(obj, resolverArgs, context, info)
}

export const videosResolver: QueryResolver<IdsArgs, VideoModel[]> = (obj, args, context, info) => {
  const { mirageSchema: schema } = context
  const ids = args.where?.id_in
  const videos = schema.videos.all().models as VideoModel[]
  const filtered = videos.filter((video) => ids.includes(video.attrs.id))
  return filtered
}

export const videosConnectionResolver: QueryResolver<VideoQueryArgs, GetVideosConnectionQuery> = (
  obj,
  args,
  context,
  info
) => {
  const baseResolverArgs = {
    first: args.first,
    after: args.after,
  }
  const extraResolverArgs = {
    categoryId: args.where?.categoryId_eq,
    channelId: args.where?.channelId_eq,
  }

  const resolverArgs = {
    ...baseResolverArgs,
    ...extraResolverArgs,
  }

  const filteredResolverArgs = filterEmptyArgs(resolverArgs)

  const paginatedVideos = mirageGraphQLFieldResolver(obj, filteredResolverArgs, context, info)
  return paginatedVideos
}

export const coverVideoResolver: QueryResolver<never, GetCoverVideoQuery['coverVideo']> = (...params) => {
  const coverVideo = mirageGraphQLFieldResolver(...params) as GetCoverVideoQuery['coverVideo']
  return coverVideo
}

export const featuredVideosResolver: QueryResolver<FeaturedVideosQueryArgs, VideoFieldsFragment[]> = (
  obj,
  args,
  context,
  info
) => {
  delete args.orderBy
  const videos = mirageGraphQLFieldResolver(obj, args, context, info) as VideoFieldsFragment[]
  return videos
}

export const channelResolver: QueryResolver<UniqueArgs, AllChannelFieldsFragment> = (obj, args, context, info) => {
  const resolverArgs = {
    id: args.where.id,
  }

  return mirageGraphQLFieldResolver(obj, resolverArgs, context, info)
}

export const channelsResolver: QueryResolver<GetChannelsConnectionQueryVariables, GetChannelsConnectionQuery> = (
  obj,
  args,
  context,
  info
) => {
  const resolverArgs = {
    first: args.first,
    after: args.after,
  }

  const paginatedChannels = mirageGraphQLFieldResolver(obj, resolverArgs, context, info)
  return paginatedChannels
}

type ChannelFollowsArgs = {
  channelId: string
}

export const channelFollowsResolver: QueryResolver<ChannelFollowsArgs> = (obj, args, context, info) => {
  return mirageGraphQLFieldResolver(obj, { id: args.channelId }, context, info)
}

export const followChannelResolver: QueryResolver<ChannelFollowsArgs> = (obj, args, context, info) => {
  const channelInfo = context.mirageSchema.channelFollowsInfos.find(args.channelId)
  if (!channelInfo) {
    const channelInfo = context.mirageSchema.channelFollowsInfos.create({
      id: args.channelId,
      follows: 1,
    })

    return channelInfo
  }
  channelInfo.update({
    follows: channelInfo.follows + 1,
  })
  return channelInfo
}

export const unfollowChannelResolver: QueryResolver<ChannelFollowsArgs> = (obj, args, context, info) => {
  const channelInfo = context.mirageSchema.channelFollowsInfos.find(args.channelId)
  if (!channelInfo) {
    const channelInfo = context.mirageSchema.channelFollowsInfos.create({
      id: args.channelId,
      follows: 0,
    })

    return channelInfo
  }
  channelInfo.update({
    follows: Math.max(0, channelInfo.follows - 1),
  })
  return channelInfo
}

type VideoModel = { attrs: VideoFieldsFragment }
type ChannelModel = { attrs: AllChannelFieldsFragment }
type SearchResolverResult = Omit<SearchFtsOutput, 'item' | 'isTypeOf' | 'highlight'> & {
  item: VideoModel | ChannelModel
}

export const searchResolver: QueryResolver<SearchQueryVariables, SearchResolverResult[]> = (_, { text }, context) => {
  const { mirageSchema: schema } = context

  const videos = schema.videos.all().models as VideoModel[]
  const channels = schema.channels.all().models as ChannelModel[]

  let rankCount = 0
  const matchQueryStr = (str: string) => str.includes(text) || text.includes(str)

  const matchedVideos = videos.reduce((acc, video) => {
    const matched = matchQueryStr(video.attrs.description) || matchQueryStr(video.attrs.title)
    if (!matched) {
      return acc
    }

    const result: SearchResolverResult = {
      __typename: 'SearchFTSOutput',
      item: video,
      rank: rankCount++,
    }

    return [...acc, result]
  }, [] as SearchResolverResult[])

  const matchedChannels = channels.reduce((acc, channel) => {
    const matched = matchQueryStr(channel.attrs.handle)
    if (!matched) {
      return acc
    }

    const result: SearchResolverResult = {
      __typename: 'SearchFTSOutput',
      item: channel,
      rank: rankCount++,
    }

    return [...acc, result]
  }, [] as SearchResolverResult[])

  return [...matchedVideos, ...matchedChannels]
}

type VideoViewsArgs = {
  videoId: string
}

export const videoViewsResolver: QueryResolver<VideoViewsArgs> = (obj, args, context, info) => {
  return mirageGraphQLFieldResolver(obj, { id: args.videoId }, context, info)
}

export const addVideoViewResolver: QueryResolver<VideoViewsArgs> = (obj, args, context, info) => {
  const videoInfo = context.mirageSchema.entityViewsInfos.find(args.videoId)
  if (!videoInfo) {
    const videoInfo = context.mirageSchema.entityViewsInfos.create({
      id: args.videoId,
      views: 1,
    })

    return videoInfo
  }
  videoInfo.update({
    views: videoInfo.views + 1,
  })
  return videoInfo
}
