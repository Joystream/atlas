import { mirageGraphQLFieldResolver } from '@miragejs/graphql'
import { FEATURED_VIDEOS_INDEXES } from '@/mocking/data'
import { Search_search, SearchVariables } from '@/api/queries/__generated__/Search'
import { VideoFields } from '@/api/queries/__generated__/VideoFields'
import {
  GetNewestChannels_channelsConnection,
  GetNewestChannelsVariables,
} from '@/api/queries/__generated__/GetNewestChannels'
import { GetNewestVideos_videosConnection } from '@/api/queries/__generated__/GetNewestVideos'
import { ChannelFields } from '@/api/queries/__generated__/ChannelFields'

type QueryResolver<ArgsType extends object = Record<string, unknown>, ReturnType = unknown> = (
  obj: unknown,
  args: ArgsType,
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

type UniqueArgs = {
  where: { id: string }
}

const filterEmptyArgs = (args: Record<string, unknown>): Record<string, unknown> => {
  return Object.keys(args).reduce((acc, key) => {
    if (args[key] != null) {
      acc[key] = args[key]
    }
    return acc
  }, {} as Record<string, unknown>)
}

export const videoResolver: QueryResolver<UniqueArgs, VideoFields> = (obj, args, context, info) => {
  const resolverArgs = {
    id: args.where.id,
  }

  return mirageGraphQLFieldResolver(obj, resolverArgs, context, info)
}

export const videosResolver: QueryResolver<VideoQueryArgs, GetNewestVideos_videosConnection> = (
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

export const featuredVideosResolver: QueryResolver<object, VideoFields[]> = (...params) => {
  const videos = mirageGraphQLFieldResolver(...params) as VideoFields[]
  return videos.filter((_, idx) => FEATURED_VIDEOS_INDEXES.includes(idx))
}

export const channelResolver: QueryResolver<UniqueArgs, ChannelFields> = (obj, args, context, info) => {
  const resolverArgs = {
    id: args.where.id,
  }

  return mirageGraphQLFieldResolver(obj, resolverArgs, context, info)
}

export const channelsResolver: QueryResolver<GetNewestChannelsVariables, GetNewestChannels_channelsConnection> = (
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

type VideoModel = { attrs: VideoFields }
type ChannelModel = { attrs: ChannelFields }
type SearchResolverResult = Omit<Search_search, 'item'> & { item: VideoModel | ChannelModel }

export const searchResolver: QueryResolver<SearchVariables, SearchResolverResult[]> = (_, { text }, context) => {
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
  videoID: string
}

export const videoViewsResolver: QueryResolver<VideoViewsArgs> = (obj, args, context, info) => {
  return mirageGraphQLFieldResolver(obj, { id: args.videoID }, context, info)
}

export const addVideoViewResolver: QueryResolver<VideoViewsArgs> = (obj, args, context, info) => {
  const videoInfo = context.mirageSchema.videoViewsInfos.find(args.videoID)
  if (!videoInfo) {
    const videoInfo = context.mirageSchema.videoViewsInfos.create({
      id: args.videoID,
      views: 1,
    })

    return videoInfo
  }
  videoInfo.update({
    views: videoInfo.views + 1,
  })
  return videoInfo
}
