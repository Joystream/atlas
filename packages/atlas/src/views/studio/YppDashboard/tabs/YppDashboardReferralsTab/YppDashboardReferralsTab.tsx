import { useMemo } from 'react'

import { SvgActionLinkUrl } from '@/assets/icons'
import { EmptyFallback } from '@/components/EmptyFallback'
import { YppReferral, YppReferralTable } from '@/components/YppReferralTable/YppReferralTable'
import { Button } from '@/components/_buttons/Button'
import { useClipboard } from '@/hooks/useClipboard'
import { useUser } from '@/providers/user/user.hooks'
import { useGetYppSyncedChannels } from '@/views/global/YppLandingView/useGetYppSyncedChannels'

import { FallbackContainer } from '../YppDashboardTabs.styles'

export const YppDashboardReferralsTab = () => {
  const { currentChannel, isLoading } = useGetYppSyncedChannels()
  const { copyToClipboard } = useClipboard()
  const { channelId } = useUser()
  const mappedData: YppReferral[] = useMemo(
    () =>
      currentChannel?.referredChannels?.map((channelData) => {
        // const tier = TIERS.reduce((prev, current, idx) => {
        //   if (channelData.subscribersCount >= (current?.subscribers || 0)) {
        //     return idx
        //   } else {
        //     return prev
        //   }
        // }, 0)
        return {
          date: new Date(channelData.createdAt),
          channel: String(channelData.joystreamChannelId),
          rewardUsd: 1, // TIERS[tier].multiplier * BASE_REFERRAL_REWARD, todo
          status: channelData.yppStatus,
          tier: 1,
        }
      }) ?? [],
    [currentChannel?.referredChannels]
  )

  if (!isLoading && !mappedData?.length) {
    return (
      <FallbackContainer>
        <EmptyFallback
          title="No referred users yet"
          variant="large"
          subtitle="You will see all referred users here once someone uses your link to sign up to the program."
          button={
            <Button
              variant="secondary"
              icon={<SvgActionLinkUrl />}
              onClick={() =>
                copyToClipboard(
                  `${window.location.host}/ypp?referrerId=${channelId}`,
                  'Referral link copied to clipboard'
                )
              }
            >
              Copy referral link
            </Button>
          }
        />
      </FallbackContainer>
    )
  }

  return <YppReferralTable data={mappedData} isLoading={isLoading} />
}
