import { FC, useEffect } from 'react'
import { ParallaxProvider } from 'react-scroll-parallax'

import { useBasicChannel } from '@/api/hooks/channel'
import { ReferralBanner } from '@/components/_ypp/ReferralBanner'
import { QUERY_PARAMS } from '@/config/routes'
import { useHeadTags } from '@/hooks/useHeadTags'
import { useRouterQuery } from '@/hooks/useRouterQuery'
import { useAsset } from '@/providers/assets/assets.hooks'
import { useYppStore } from '@/providers/ypp/ypp.store'

import { YppCardsSections } from './YppCardsSections'
import { YppFooter } from './YppFooter'
import { YppHero } from './YppHero'
import { BannerContainer } from './YppLandingView.styles'
import { YppRewardSection } from './YppRewardSection'
import { YppThreeStepsSection } from './YppThreeStepsSection'

export const YppLandingView: FC = () => {
  const headTags = useHeadTags('Youtube Partner Program')

  const queryReferrerId = useRouterQuery(QUERY_PARAMS.REFERRER_ID)
  const setReferrerId = useYppStore((state) => state.actions.setReferrerId)
  // persist referrer id in store
  useEffect(() => {
    if (queryReferrerId) {
      setReferrerId(queryReferrerId)
    }
  }, [queryReferrerId, setReferrerId])

  const storeReferrerId = useYppStore((state) => state.referrerId)
  const referrerId = queryReferrerId || storeReferrerId
  const { loading: loadingReferrerChannel, channel: referrerChannel } = useBasicChannel(referrerId || '', {
    skip: !referrerId,
  })
  const { isLoadingAsset: isLoadingReferrerAvatar, url: referrerChannelUrl } = useAsset(referrerChannel?.avatarPhoto)
  const shouldShowReferrerBanner = referrerId && (loadingReferrerChannel || referrerChannel)

  return (
    <>
      {headTags}
      <ParallaxProvider>
        {shouldShowReferrerBanner && (
          <BannerContainer>
            <ReferralBanner
              channelId={referrerId}
              channelTitle={referrerChannel?.title}
              channelAvatarUrl={referrerChannelUrl}
              channelLoading={isLoadingReferrerAvatar || loadingReferrerChannel}
            />
          </BannerContainer>
        )}
        <YppHero />
        <YppRewardSection />
        <YppThreeStepsSection />
        <YppCardsSections />
        <YppFooter />
      </ParallaxProvider>
    </>
  )
}
