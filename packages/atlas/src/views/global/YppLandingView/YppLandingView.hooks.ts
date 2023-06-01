import axios from 'axios'
import { useCallback, useEffect, useMemo } from 'react'
import { useQuery } from 'react-query'

import { useBasicChannels } from '@/api/hooks/channel'
import { atlasConfig } from '@/config'
import { useUser } from '@/providers/user/user.hooks'
import { SentryLogger } from '@/utils/logs'

const YPP_SYNC_URL = atlasConfig.features.ypp.youtubeSyncApiUrl

type YppStatus = 'Unverified' | 'Verified' | 'Suspended' | 'OptedOut'

export type YppSyncedChannel = {
  title: string
  description: string
  aggregatedStats: number
  shouldBeIngested: boolean
  yppStatus: YppStatus
  joystreamChannelId: number
  videoCategoryId: string
  thumbnails: {
    default: string
    medium: string
    high: string
    maxRes: string
    standard: string
  }
  subscribersCount: number
  createdAt: string
}

export const useGetYppSyncedChannels = () => {
  const { activeMembership, membershipsLoading, channelId } = useUser()
  const channels = useMemo(() => activeMembership?.channels || [], [activeMembership?.channels])
  const {
    data: yppSyncedData,
    isLoading,
    refetch,
  } = useQuery(['membershipChannels', channels], () => getYppChannelsData(), {
    enabled: !!YPP_SYNC_URL,
  })

  const getYppChannelsData = useCallback(async () => {
    // TODO We should do only one request per given memberId
    // refactor once https://github.com/Joystream/youtube-synch/issues/55 is done
    try {
      const syncedChannels = await Promise.all(
        channels.map(async (channel) => {
          try {
            const response = await axios.get<YppSyncedChannel>(`${YPP_SYNC_URL}/channels/${channel.id}`)
            return response?.data
          } catch (error) {
            return
          }
        })
      )
      const fetchedChannels = syncedChannels.filter(
        (channel): channel is YppSyncedChannel => !!channel && channel.yppStatus !== 'OptedOut'
      )

      const syncedChannelIds = fetchedChannels?.map((channel) => channel.joystreamChannelId.toString())
      return {
        unsyncedChannels: activeMembership?.channels.filter((channel) => !syncedChannelIds?.includes(channel.id)),
        syncedChannels: fetchedChannels,
        currentChannel: fetchedChannels?.find(
          (syncedChannels) => syncedChannels.joystreamChannelId.toString() === channelId
        ),
      }
    } catch (error) {
      SentryLogger.error('Error while updating YPP setting: ', 'useGetYppSyncedChannels', error)
    }
  }, [activeMembership?.channels, channelId, channels])

  useEffect(() => {
    if (channelId && YPP_SYNC_URL) {
      refetch()
    }
  }, [channelId, refetch])

  return {
    unsyncedChannels: yppSyncedData?.unsyncedChannels,
    syncedChannels: yppSyncedData?.syncedChannels,
    currentChannel: yppSyncedData?.currentChannel,
    refetchYppSyncedChannels: refetch,
    isLoading: isLoading || membershipsLoading,
  }
}
type RecentChannelsResponse = YppSyncedChannel[]

export const useGetYppLastVerifiedChannels = () => {
  const getRecentChannels = useCallback(async (): Promise<string[] | void> => {
    try {
      const response = await axios.get<RecentChannelsResponse>(`${YPP_SYNC_URL}/channels`)
      return response.data
        .filter((channel) => channel.yppStatus === 'Verified')
        .map((channel) => channel.joystreamChannelId.toString())
    } catch (error) {
      SentryLogger.error('Failed to fetch recent channels', 'useYppGetLastVerifiedChannels', error)
    }
  }, [])

  const { data: recentChannelIds, isLoading: isVerifiedChannelsLoading } = useQuery('ypp-channels-fetch', () =>
    getRecentChannels()
  )

  const { extendedChannels: channels, loading } = useBasicChannels(
    {
      where: {
        channel: {
          id_in: recentChannelIds ?? [],
        },
      },
    },
    { skip: !recentChannelIds?.length }
  )

  return {
    loading: loading || isVerifiedChannelsLoading,
    channels,
  }
}
