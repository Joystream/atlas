import { FC } from 'react'
import { CSSTransition, SwitchTransition } from 'react-transition-group'

import { Avatar } from '@/components/Avatar'
import { Information } from '@/components/Information'
import { Text } from '@/components/Text'
import { SkeletonLoader } from '@/components/_loaders/SkeletonLoader'
import { absoluteRoutes } from '@/config/routes'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { cVar, transitions } from '@/styles'

import {
  ChannelAvatarLink,
  ChannelInfoContainer,
  ChannelTitleText,
  InformationWrapper,
  ReferralBannerContainer,
  StyledLink,
} from './ReferralBanner.styles'

type ReferralBannerProps = {
  className?: string
  channelTitle?: string | null
  channelId: string
  channelAvatarUrl?: string | null
  channelLoading?: boolean
}
export const ReferralBanner: FC<ReferralBannerProps> = ({
  className,
  channelTitle,
  channelId,
  channelAvatarUrl,
  channelLoading,
}) => {
  const xsMatch = useMediaMatch('xs')

  return (
    <ReferralBannerContainer className={className}>
      <ChannelInfoContainer>
        <ChannelAvatarLink to={absoluteRoutes.viewer.channel(channelId)}>
          <Avatar clickable loading={channelLoading} assetUrl={channelAvatarUrl} />
        </ChannelAvatarLink>
        <SwitchTransition>
          <CSSTransition
            key={channelLoading ? 'placeholder' : 'content'}
            timeout={parseInt(cVar('animationTimingFast', true))}
            classNames={transitions.names.fade}
          >
            {channelLoading ? (
              <>
                <SkeletonLoader bottomSpace={4} width={70} height={14} />
                <SkeletonLoader width={50} height={18} />
              </>
            ) : (
              <>
                <Text as="p" variant="t100" color="colorText">
                  Referred by
                </Text>
                <StyledLink to={absoluteRoutes.viewer.channel(channelId)}>
                  <ChannelTitleText as="p" variant="t200-strong">
                    {channelTitle}
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
        <Information text="Channel you've been referred by is going to be rewarded if you enroll your Atlas channel in the program." />
      </InformationWrapper>
    </ReferralBannerContainer>
  )
}
