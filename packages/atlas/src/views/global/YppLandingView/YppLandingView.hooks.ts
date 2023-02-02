import axios from 'axios'
import { useCallback, useEffect, useMemo } from 'react'
import { useQuery } from 'react-query'
import { useLocation } from 'react-router-dom'

import { useBasicChannels } from '@/api/hooks/channel'
import { atlasConfig } from '@/config'
import { useUser } from '@/providers/user/user.hooks'
import { ConsoleLogger, SentryLogger } from '@/utils/logs'

const YPP_SYNC_URL = atlasConfig.features.ypp.youtubeSyncApiUrl

// todo yppStatus `Active` will be deprecated. We're keeping this for the sake of backward compatibility
type YppStatus = 'Unverified' | 'Verified' | 'Suspended' | 'OptedOut' | 'Active'

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
  const { activeMembership, membershipsLoading, isAuthLoading, channelId } = useUser()
  const location = useLocation()
  const {
    data: syncedChannels,
    isLoading,
    refetch,
  } = useQuery('ypp-synced-channels', () => getSyncedChannels(), {
    refetchOnWindowFocus: false,
  })

  const channels = useMemo(() => activeMembership?.channels || [], [activeMembership?.channels])

  const unsyncedChannels = useMemo(() => {
    const syncedChannelIds = syncedChannels?.map((channel) => channel.joystreamChannelId.toString())
    return activeMembership?.channels.filter((channel) => !syncedChannelIds?.includes(channel.id))
  }, [activeMembership?.channels, syncedChannels])

  const getSyncedChannels = useCallback(async () => {
    if (!YPP_SYNC_URL) {
      ConsoleLogger.error("Youtube sync url wasn't provided")
      return
    }
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

      return fetchedChannels
    } catch (error) {
      SentryLogger.error('Error while updating YPP setting: ', 'useGetYppSyncedChannels', error)
    }
  }, [channels])

  useEffect(() => {
    if (location.pathname.includes('studio') && !channels.length) return
    getSyncedChannels()
  }, [channels.length, getSyncedChannels, location.pathname])

  return {
    syncedChannels,
    unsyncedChannels,
    refetchSyncedChannels: refetch,
    isLoading: isLoading || membershipsLoading || isAuthLoading,
    currentChannel: syncedChannels?.find(
      (syncedChannels) => syncedChannels.joystreamChannelId.toString() === channelId
    ),
  }
}
type RecentChannelsResponse = YppSyncedChannel[]

export const useGetYppLastVerifiedChannels = () => {
  const getRecentChannels = useCallback(async (): Promise<string[] | void> => {
    try {
      const response = await axios.get<RecentChannelsResponse>(`${atlasConfig.features.ypp.youtubeSyncApiUrl}/channels`)
      return response.data
        .filter((channel) => channel.yppStatus === 'Verified')
        .map((channel) => channel.joystreamChannelId.toString())
    } catch (error) {
      SentryLogger.error('Failed to fetch recent channels', 'useYppGetLastVerifiedChannels', error)
    }
  }, [])

  const { data, isLoading: isVerifiedChannelsLoading } = useQuery('ypp-channels-fetch', () => getRecentChannels())

  const { channels, loading } = useBasicChannels(
    {
      where: {
        id_in: data ?? [],
      },
    },
    { skip: !data?.length }
  )

  return {
    loading: loading || isVerifiedChannelsLoading,
    channels,
  }
}
