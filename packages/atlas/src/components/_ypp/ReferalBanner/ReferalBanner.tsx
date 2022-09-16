import { FC } from 'react'
import { Link } from 'react-router-dom'
import { CSSTransition, SwitchTransition } from 'react-transition-group'

import { Avatar } from '@/components/Avatar'
import { Information } from '@/components/Information'
import { Text } from '@/components/Text'
import { SkeletonLoader } from '@/components/_loaders/SkeletonLoader'
import { absoluteRoutes } from '@/config/routes'
import { cVar, transitions } from '@/styles'

import { ChannelInfoContainer, InformationWrapper, ReferalBannerContainer, StyledLink } from './ReferalBanner.styles'

type ReferalBannerProps = {
  className?: string
  channelTitle?: string | null
  channelId: string
  channelAvatarUrl?: string | null
  channelLoading?: boolean
}
export const RefferalBanner: FC<ReferalBannerProps> = ({
  className,
  channelTitle,
  channelId,
  channelAvatarUrl,
  channelLoading,
}) => {
  return (
    <ReferalBannerContainer className={className}>
      <ChannelInfoContainer>
        <Link to={absoluteRoutes.viewer.channel(channelId)}>
          <Avatar clickable loading={channelLoading} assetUrl={channelAvatarUrl} />
        </Link>
        <div>
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
                    Reffered by
                  </Text>
                  <StyledLink to={absoluteRoutes.viewer.channel(channelId)}>
                    <Text as="p" variant="t200">
                      {channelTitle}
                    </Text>
                  </StyledLink>
                </>
              )}
            </CSSTransition>
          </SwitchTransition>
        </div>
      </ChannelInfoContainer>
      <InformationWrapper>
        <Text variant="t200" as="p" color="colorText">
          How refferals work?
        </Text>
        <Information text="Channel you've been referred by is going to be rewarded if you enroll your Atlas channel in the program." />
      </InformationWrapper>
    </ReferalBannerContainer>
  )
}
