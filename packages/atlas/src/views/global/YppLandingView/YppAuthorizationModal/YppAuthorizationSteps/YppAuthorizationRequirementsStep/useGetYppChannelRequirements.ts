import { useMemo } from 'react'
import { useQuery } from 'react-query'

import { axiosInstance } from '@/api/axios'
import { atlasConfig } from '@/config'
import { SentryLogger } from '@/utils/logs'

import { ChannelRequirements, Requirements } from '../../YppAuthorizationModal.types'

export const useGetYppChannelRequirements = () => {
  const { data } = useQuery('ypp-requirements-fetch', () =>
    axiosInstance
      .get<ChannelRequirements>(`${atlasConfig.features.ypp.youtubeSyncApiUrl}/channels/induction/requirements`)
      .then((res) => res.data)
      .catch((error) => SentryLogger.error("Couldn't fetch requirements", 'YppAuthorizationModal.hooks', error))
  )

  const requirements: Requirements = useMemo(
    () => ({
      MINIMUM_SUBSCRIBERS_COUNT: data?.MINIMUM_SUBSCRIBERS_COUNT,
      MINIMUM_TOTAL_VIDEOS_COUNT: data?.MINIMUM_TOTAL_VIDEOS_COUNT,
      MINIMUM_VIDEO_AGE_HOURS: data?.MINIMUM_VIDEO_AGE_HOURS,
      MINIMUM_CHANNEL_AGE_HOURS: data?.MINIMUM_CHANNEL_AGE_HOURS,
      MINIMUM_VIDEOS_PER_MONTH: data?.MINIMUM_VIDEOS_PER_MONTH,
      MONTHS_TO_CONSIDER: data?.MONTHS_TO_CONSIDER,
    }),
    [data]
  )

  return requirements
}
