import { useQuery } from 'react-query'

import { axiosInstance } from '@/api/axios'
import { atlasConfig } from '@/config'
import { SentryLogger } from '@/utils/logs'

import { ChannelRequirements } from '../../YppAuthorizationModal.types'

export const useGetYppChannelRequirements = () => {
  const { data, isLoading } = useQuery('ypp-requirements-fetch', () =>
    axiosInstance
      .get<ChannelRequirements>(`${atlasConfig.features.ypp.youtubeSyncApiUrl}/channels/induction/requirements`)
      .then((res) => res.data)
      .catch((error) => SentryLogger.error("Couldn't fetch requirements", 'YppAuthorizationModal.hooks', error))
  )

  return {
    requirements: data?.requirements,
    isLoading,
  }
}
