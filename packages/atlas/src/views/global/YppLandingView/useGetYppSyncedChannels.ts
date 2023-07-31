import { useCallback, useEffect, useMemo } from 'react'
import { useQuery } from 'react-query'

import { axiosInstance } from '@/api/axios'
import { atlasConfig } from '@/config'
import { useUser } from '@/providers/user/user.hooks'
import { SentryLogger } from '@/utils/logs'

import { YppSyncedChannel } from './YppLandingView.types'

const YPP_SYNC_URL = atlasConfig.features.ypp.youtubeSyncApiUrl

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
            const response = await axiosInstance.get<YppSyncedChannel>(`${YPP_SYNC_URL}/channels/${channel.id}`)
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
