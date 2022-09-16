import { FC } from 'react'
import { ParallaxProvider } from 'react-scroll-parallax'

import { useBasicChannel } from '@/api/hooks/channel'
import { RefferalBanner } from '@/components/_ypp/ReferalBanner'
import { QUERY_PARAMS } from '@/config/routes'
import { useHeadTags } from '@/hooks/useHeadTags'
import { useRouterQuery } from '@/hooks/useRouterQuery'
import { useAsset } from '@/providers/assets/assets.hooks'

import { YppCardsSections } from './YppCardsSections'
import { YppFooter } from './YppFooter'
import { YppHero } from './YppHero'
import { BannerContainer } from './YppLandingView.styles'
import { YppRewardSection } from './YppRewardSection'
import { YppThreeStepsSection } from './YppThreeStepsSection'

export const YppLandingView: FC = () => {
  const channelId = useRouterQuery(QUERY_PARAMS.REF)
  const { loading, channel } = useBasicChannel(channelId || '', { skip: !channelId })
  const { isLoadingAsset, url } = useAsset(channel?.avatarPhoto)
  const headTags = useHeadTags('Youtube Partner Program')
  return (
    <>
      {headTags}
      <ParallaxProvider>
        {channelId && (
          <BannerContainer>
            <RefferalBanner
              channelId={channelId}
              channelTitle={channel?.title}
              channelAvatarUrl={url}
              channelLoading={isLoadingAsset || loading}
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
