import { useMemo } from 'react'
import { useQuery } from 'react-query'

import { axiosInstance } from '@/api/axios'
import { SvgActionLinkUrl } from '@/assets/icons'
import { EmptyFallback } from '@/components/EmptyFallback'
import { YppReferral, YppReferralTable } from '@/components/YppReferralTable/YppReferralTable'
import { ReferralLinkButton } from '@/components/_ypp/ReferralLinkButton'
import { atlasConfig } from '@/config'
import { useUser } from '@/providers/user/user.hooks'
import { YppSyncedChannel } from '@/views/global/YppLandingView/YppLandingView.types'

import { FallbackContainer } from '../YppDashboardTabs.styles'

const YPP_SYNC_URL = atlasConfig.features.ypp.youtubeSyncApiUrl

export const YppDashboardReferralsTab = () => {
  const { channelId } = useUser()
  const { isLoading, data } = useQuery(
    ['referralsTable', channelId],
    () => axiosInstance.get<YppSyncedChannel[]>(`${YPP_SYNC_URL}/channels/${channelId}/referrals`),
    { enabled: !!channelId }
  )

  const mappedData: YppReferral[] = useMemo(
    () =>
      data?.data.map((channelData) => {
        return {
          date: new Date(channelData.createdAt),
          channel: String(channelData.joystreamChannelId),
          status: channelData.yppStatus,
        }
      }) ?? [],
    [data?.data]
  )

  if (!isLoading && !mappedData?.length) {
    return (
      <FallbackContainer>
        <EmptyFallback
          title="No referred users yet"
          variant="large"
          subtitle="You will see all referred users here once someone uses your link to sign up to the program."
          button={<ReferralLinkButton variant="secondary" icon={<SvgActionLinkUrl />} />}
        />
      </FallbackContainer>
    )
  }

  return <YppReferralTable data={mappedData} isLoading={isLoading} />
}
