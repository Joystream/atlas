import axios from 'axios'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'

import { useBasicChannels } from '@/api/hooks/channel'
import { atlasConfig } from '@/config'
import { useUser } from '@/providers/user/user.hooks'
import { ConsoleLogger, SentryLogger } from '@/utils/logs'

const YPP_SYNC_URL = atlasConfig.features.ypp.youtubeSyncApiUrl

export type YppSyncedChannel = {
  title: string
  description: string
  aggregatedStats: number
  shouldBeIngested: boolean
  isSuspended: boolean
  joystreamChannelId: number
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
  const [isLoading, setIsLoading] = useState(true)
  const location = useLocation()
  const [syncedChannels, setSyncedChannels] = useState<YppSyncedChannel[]>([])

  const channels = useMemo(() => activeMembership?.channels || [], [activeMembership?.channels])

  const unsyncedChannels = useMemo(() => {
    const syncedChannelIds = syncedChannels.map((channel) => channel.joystreamChannelId.toString())
    return activeMembership?.channels.filter((channel) => !syncedChannelIds.includes(channel.id))
  }, [activeMembership?.channels, syncedChannels])

  const getSyncedChannels = useCallback(async () => {
    if (!YPP_SYNC_URL) {
      ConsoleLogger.error("Youtube sync url wasn't provided")
      setIsLoading(false)
      return
    }
    // TODO We should do only one request per given memberId
    // refactor once https://github.com/Joystream/youtube-synch/issues/55 is done
    const syncedChannels = await Promise.all(
      channels.map(async (channel) => {
        try {
          const response = await axios.get<YppSyncedChannel>(`${YPP_SYNC_URL}/channels/${channel.id}`)
          return response?.data
        } catch (error) {
          return undefined
        }
      })
    )
    return syncedChannels.filter((channel): channel is YppSyncedChannel => !!channel)
  }, [channels])

  useEffect(() => {
    if (location.pathname.includes('studio') && !channels.length) return
    setIsLoading(true)
    getSyncedChannels().then((channels) => {
      channels && setSyncedChannels(channels)
      setIsLoading(false)
    })
  }, [channels.length, getSyncedChannels, location.pathname])

  return {
    syncedChannels,
    unsyncedChannels,
    isLoading: isLoading || membershipsLoading || isAuthLoading,
    currentChannel: syncedChannels?.find(
      (syncedChannels) => syncedChannels.joystreamChannelId.toString() === channelId
    ),
  }
}
type RecentChannelsResponse = YppSyncedChannel[]

export const useGetYppLastVerifiedChannels = () => {
  const [recentChannelsIds, setRecentChannelsIds] = useState<string[]>([])
  const [isVerifiedChannelsLoading, setIsVerifiedChannelsLoading] = useState(true)
  const { channels, loading } = useBasicChannels(
    {
      where: {
        id_in: recentChannelsIds,
      },
    },
    { skip: !recentChannelsIds.length }
  )

  const getRecentChannels = useCallback(async () => {
    try {
      setIsVerifiedChannelsLoading(true)
      const response = await axios.get<RecentChannelsResponse>(`${atlasConfig.features.ypp.youtubeSyncApiUrl}/channels`)
      const channelIds = response.data.map((channel) => channel.joystreamChannelId.toString())
      setRecentChannelsIds(channelIds)
    } catch (error) {
      SentryLogger.error('Failed to fetch recent channels', 'useYppGetLastVerifiedChannels', error)
    } finally {
      setIsVerifiedChannelsLoading(false)
    }
  }, [])

  useEffect(() => {
    getRecentChannels()
  }, [getRecentChannels])

  return {
    loading: loading || isVerifiedChannelsLoading,
    channels,
  }
}
