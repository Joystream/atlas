import axios from 'axios'
import { useMemo } from 'react'
import { useQuery } from 'react-query'

import { atlasConfig } from '@/config'
import { SentryLogger } from '@/utils/logs'

import { ChannelRequirements, Requirements } from '../../YppAuthorizationModal.types'

export const useGetYppChannelRequirements = () => {
  const { data } = useQuery('ypp-requirements-fetch', () =>
    axios
      .get<ChannelRequirements>(`${atlasConfig.features.ypp.youtubeSyncApiUrl}/channels/induction/requirements`)
      .then((res) => res.data)
      .catch((error) => SentryLogger.error("Couldn't fetch requirements", 'YppAuthorizationModal.hooks', error))
  )

  const requirements: Requirements = useMemo(
    () => ({
      MINIMUM_SUBSCRIBERS_COUNT: data?.MINIMUM_SUBSCRIBERS_COUNT,
      MINIMUM_VIDEO_COUNT: data?.MINIMUM_VIDEO_COUNT,
      MINIMUM_VIDEO_AGE_HOURS: data?.MINIMUM_VIDEO_AGE_HOURS,
      MINIMUM_CHANNEL_AGE_HOURS: data?.MINIMUM_CHANNEL_AGE_HOURS,
    }),
    [data]
  )

  return requirements
}
