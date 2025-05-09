import { useMemo, useState } from 'react'
import { useQuery } from 'react-query'

import { axiosInstance } from '@/api/axios'
import { YppReferral } from '@/components/YppReferralTable/YppReferralTable'
import { atlasConfig } from '@/config'
import { useUser } from '@/providers/user/user.hooks'
import { YppSyncedChannel } from '@/views/global/YppLandingView/YppLandingView.types'

const YPP_SYNC_URL = atlasConfig.features.ypp.youtubeSyncApiUrl

const separateListIntoChunks = <T>(list: Array<T>, chunkSize: number): Array<T[]> => {
  const chunks = []

  for (let index = 0; index < list.length; index += chunkSize) {
    chunks.push(list.slice(index, index + chunkSize))
  }

  return chunks
}

export const useYppReferralPagination = ({ initialPageSize = 10 }: { initialPageSize?: number }) => {
  const [currentPage, setCurrentPage] = useState(0)
  const [perPage, setPerPage] = useState(initialPageSize)
  const { channelId } = useUser()

  const { isLoading, data } = useQuery(
    ['referralsTable', channelId],
    () => axiosInstance.get<YppSyncedChannel[]>(`${YPP_SYNC_URL}/channels/${channelId}/referrals`),
    { enabled: !!channelId }
  )

  const yppReferrals: YppReferral[] = useMemo(
    () =>
      // TODO: For large arrays, the creation of new Date instances for sorting might be a performance consideration.
      data?.data
        .sort((channelA, channelB) => new Date(channelB.createdAt).getTime() - new Date(channelA.createdAt).getTime())
        .map((channelData) => {
          return {
            date: new Date(channelData.createdAt),
            channelId: String(channelData.joystreamChannelId),
            status: channelData.yppStatus,
          }
        }) ?? [],
    [data?.data]
  )

  const pages = separateListIntoChunks(yppReferrals, perPage)

  return {
    currentPage,
    setCurrentPage,
    yppReferrals: pages[currentPage] ?? [],
    totalCount: yppReferrals.length,
    isLoading,
    setPerPage,
    perPage,
  }
}
