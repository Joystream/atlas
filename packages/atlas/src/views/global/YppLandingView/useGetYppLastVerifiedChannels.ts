import { useQuery } from 'react-query'

import { axiosInstance } from '@/api/axios'
import { useBasicChannels } from '@/api/hooks/channel'
import { atlasConfig } from '@/config'
import { SentryLogger } from '@/utils/logs'

import { YppSyncedChannel } from './YppLandingView.types'

const YPP_SYNC_URL = atlasConfig.features.ypp.youtubeSyncApiUrl

type RecentChannelsResponse = YppSyncedChannel[]
const getRecentChannels = async (): Promise<string[] | void> => {
  try {
    const response = await axiosInstance.get<RecentChannelsResponse>(`${YPP_SYNC_URL}/channels`)
    return response.data
      .filter((channel) => channel.yppStatus === 'Verified')
      .map((channel) => channel.joystreamChannelId.toString())
  } catch (error) {
    SentryLogger.error('Failed to fetch recent channels', 'useYppGetLastVerifiedChannels', error)
  }
}

export const useGetYppLastVerifiedChannels = () => {
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
