import { MutationHookOptions, QueryHookOptions } from '@apollo/client'
import { shuffle } from 'lodash-es'
import { useEffect, useRef, useState } from 'react'

import {
  FollowChannelMutation,
  GetChannelNftCollectorsQuery,
  GetChannelNftCollectorsQueryVariables,
  GetDiscoverChannelsQuery,
  GetDiscoverChannelsQueryVariables,
  GetExtendedBasicChannelsQuery,
  GetExtendedBasicChannelsQueryVariables,
  GetExtendedFullChannelsQuery,
  GetExtendedFullChannelsQueryVariables,
  GetTop10ChannelsQuery,
  GetTop10ChannelsQueryVariables,
  UnfollowChannelMutation,
  useFollowChannelMutation,
  useGetChannelNftCollectorsQuery,
  useGetDiscoverChannelsQuery,
  useGetExtendedBasicChannelsQuery,
  useGetExtendedFullChannelsQuery,
  useGetTop10ChannelsQuery,
  useUnfollowChannelMutation,
} from '@/api/queries/__generated__/channels.generated'
import { useSegmentAnalytics } from '@/hooks/useSegmentAnalytics'

export const useBasicChannel = (
  id: string,
  opts?: QueryHookOptions<GetExtendedBasicChannelsQuery, GetExtendedBasicChannelsQueryVariables>
) => {
  const { data, ...rest } = useGetExtendedBasicChannelsQuery({
    ...opts,
    variables: {
      ...opts?.variables,
      where: { ...opts?.variables?.where, channel: { ...opts?.variables?.where?.channel, id_eq: id } },
    },
  })
  return {
    extendedChannel: data?.extendedChannels[0],
    ...rest,
  }
}

export const useFullChannel = (
  id: string,
  opts?: QueryHookOptions<GetExtendedFullChannelsQuery, GetExtendedFullChannelsQueryVariables>,
  variables?: GetExtendedFullChannelsQueryVariables
) => {
  const { data, ...rest } = useGetExtendedFullChannelsQuery({
    ...opts,
    variables: {
      ...variables,
      where: {
        ...variables?.where,
        channel: {
          ...variables?.where?.channel,
          id_eq: id,
        },
      },
    },
  })
  return {
    channel: data?.extendedChannels[0]?.channel,
    activeVideosCount: data?.extendedChannels[0]?.activeVideosCount,
    ...rest,
  }
}

export const useBasicChannels = (
  variables?: GetExtendedBasicChannelsQueryVariables,
  opts?: QueryHookOptions<GetExtendedBasicChannelsQuery, GetExtendedBasicChannelsQueryVariables>
) => {
  const { data, ...rest } = useGetExtendedBasicChannelsQuery({
    ...opts,
    variables,
  })
  return {
    extendedChannels: data?.extendedChannels,
    ...rest,
  }
}

export const useFollowChannel = (opts?: MutationHookOptions<FollowChannelMutation>) => {
  const [followChannel, rest] = useFollowChannelMutation()
  const { trackChannelFollow } = useSegmentAnalytics()
  return {
    followChannel: (id: string) => {
      trackChannelFollow(id)
      return followChannel({
        ...opts,
        variables: {
          channelId: id,
        },
        update: (cache, mutationResult) => {
          cache.modify({
            id: cache.identify({
              __typename: 'Channel',
              id,
            }),
            fields: {
              followsNum: () => mutationResult.data?.followChannel.follows,
            },
          })
        },
      })
    },
    ...rest,
  }
}

export const useUnfollowChannel = (opts?: MutationHookOptions<UnfollowChannelMutation>) => {
  const [unfollowChannel, rest] = useUnfollowChannelMutation()
  return {
    unfollowChannel: (id: string, token: string) =>
      unfollowChannel({
        ...opts,
        variables: {
          channelId: id,
          token,
        },
        update: (cache, mutationResult) => {
          cache.modify({
            id: cache.identify({
              __typename: 'Channel',
              id,
            }),
            fields: {
              followsNum: () => mutationResult.data?.unfollowChannel.follows,
            },
          })
        },
      }),
    ...rest,
  }
}

export const useTop10Channels = (
  variables?: GetTop10ChannelsQueryVariables,
  opts?: QueryHookOptions<GetTop10ChannelsQuery, GetTop10ChannelsQueryVariables>
) => {
  const { data, ...rest } = useGetTop10ChannelsQuery({
    ...opts,
    variables: {
      ...variables,
      where: {
        ...variables?.where,
        activeVideosCount_gt: 0,
      },
    },
  })
  return {
    channels: data?.extendedChannels.map((extended) => extended.channel),
    ...rest,
  }
}

export const useShuffleResults = <T>(data?: T[]) => {
  const [shuffledResults, setShuffledResults] = useState<T[]>([])

  const firstRender = useRef(true)
  useEffect(() => {
    if (!firstRender.current) {
      return
    }
    if (data?.length) {
      setShuffledResults(shuffle(data))
      firstRender.current = false
    }
  }, [data])

  return shuffledResults
}

export const useDiscoverChannels = (
  variables?: GetDiscoverChannelsQueryVariables,
  opts?: QueryHookOptions<GetDiscoverChannelsQuery, GetDiscoverChannelsQueryVariables>
) => {
  const { data, ...rest } = useGetDiscoverChannelsQuery({
    ...opts,
    variables,
  })

  const shuffledChannels = useShuffleResults<GetDiscoverChannelsQuery['mostRecentChannels'][number]>(
    data?.mostRecentChannels
  )

  return {
    extendedChannels: shuffledChannels,
    ...rest,
  }
}

export const useChannelNftCollectors = (
  variables?: GetChannelNftCollectorsQueryVariables,
  opts?: QueryHookOptions<GetChannelNftCollectorsQuery, GetChannelNftCollectorsQueryVariables>
) => {
  const { data, ...rest } = useGetChannelNftCollectorsQuery({
    ...opts,
    variables: {
      channelId: variables?.channelId || '',
      orderBy: variables?.orderBy,
    },
  })

  return {
    channelNftCollectors: data?.channelNftCollectors,
    ...rest,
  }
}
