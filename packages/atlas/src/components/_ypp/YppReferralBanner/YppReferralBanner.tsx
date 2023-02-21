import { FC, useEffect } from 'react'
import { CSSTransition, SwitchTransition } from 'react-transition-group'

import { useBasicChannel } from '@/api/hooks/channel'
import { Avatar } from '@/components/Avatar'
import { Information } from '@/components/Information'
import { Text } from '@/components/Text'
import { SkeletonLoader } from '@/components/_loaders/SkeletonLoader'
import { atlasConfig } from '@/config'
import { QUERY_PARAMS, absoluteRoutes } from '@/config/routes'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { useRouterQuery } from '@/hooks/useRouterQuery'
import { useAsset } from '@/providers/assets/assets.hooks'
import { useYppStore } from '@/providers/ypp/ypp.store'
import { cVar, transitions } from '@/styles'

import {
  ChannelAvatarLink,
  ChannelInfoContainer,
  ChannelTitleText,
  InformationWrapper,
  ReferralBannerContainer,
  ReferralBannerPaddingWrapper,
  StyledLink,
} from './YppReferralBanner.styles'

type YppReferralBannerProps = {
  className?: string
}

const appName = atlasConfig.general.appName
export const YppReferralBanner: FC<YppReferralBannerProps> = ({ className }) => {
  const xsMatch = useMediaMatch('xs')

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
  const { loading: isLoadingChannel, extendedChannel } = useBasicChannel(referrerId || '', {
    skip: !referrerId,
  })
  const channel = extendedChannel?.channel
  const { isLoadingAsset: isLoadingAvatar, url: channelAvatarUrl } = useAsset(channel?.avatarPhoto)
  const shouldShowReferrerBanner = referrerId && (isLoadingChannel || channel)

  const isLoading = isLoadingAvatar || isLoadingChannel

  if (!shouldShowReferrerBanner) {
    return null
  }

  return (
    <ReferralBannerPaddingWrapper>
      <ReferralBannerContainer className={className}>
        <ChannelInfoContainer>
          <ChannelAvatarLink to={absoluteRoutes.viewer.channel(channel?.id)}>
            <Avatar clickable loading={isLoading} assetUrl={channelAvatarUrl} />
          </ChannelAvatarLink>
          <SwitchTransition>
            <CSSTransition
              key={isLoading ? 'placeholder' : 'content'}
              timeout={parseInt(cVar('animationTimingFast', true))}
              classNames={transitions.names.fade}
            >
              {isLoading ? (
                <>
                  <SkeletonLoader bottomSpace={4} width={70} height={14} />
                  <SkeletonLoader width={50} height={18} />
                </>
              ) : (
                <>
                  <Text as="p" variant="t100" color="colorText">
                    Referred by
                  </Text>
                  <StyledLink to={absoluteRoutes.viewer.channel(channel?.id)}>
                    <ChannelTitleText as="p" variant="t200-strong">
                      {channel?.title}
                    </ChannelTitleText>
                  </StyledLink>
                </>
              )}
            </CSSTransition>
          </SwitchTransition>
        </ChannelInfoContainer>
        <InformationWrapper>
          <Text variant="t200" as="p" color="colorText">
            {xsMatch ? 'How referrals work?' : 'Referrals'}
          </Text>
          <Information
            text={`Channel you've been referred by is going to be rewarded if you enroll your ${appName} channel in the program.`}
          />
        </InformationWrapper>
      </ReferralBannerContainer>
    </ReferralBannerPaddingWrapper>
  )
}
