import React, { useState } from 'react'
import { CSSTransition, SwitchTransition } from 'react-transition-group'

import { BasicChannelFieldsFragment } from '@/api/queries'
import { SkeletonLoader } from '@/components/_loaders/SkeletonLoader'
import { absoluteRoutes } from '@/config/routes'
import { useHandleFollowChannel } from '@/hooks/useHandleFollowChannel'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { useAsset } from '@/providers/assets'
import { cVar, transitions } from '@/styles'
import { formatNumberShort } from '@/utils/number'

import {
  ChannelCardAnchor,
  ChannelCardArticle,
  ChannelFollows,
  ChannelTitle,
  FollowButton,
  InfoWrapper,
  StyledAvatar,
} from './ChannelCard.styles'

export type ChannelCardProps = {
  withFollowButton?: boolean
  className?: string
  onClick?: () => void
  loading?: boolean
  channel?: BasicChannelFieldsFragment
}

export const ChannelCard: React.FC<ChannelCardProps> = ({
  className,
  onClick,
  withFollowButton = true,
  channel,
  loading,
}) => {
  const mdMatch = useMediaMatch('md')
  const [activeDisabled, setActiveDisabled] = useState(false)

  const { url, isLoadingAsset } = useAsset(channel?.avatarPhoto)

  const { toggleFollowing, isFollowing } = useHandleFollowChannel(channel?.id, channel?.title)

  const handleFollowButtonClick = (e: React.MouseEvent) => {
    e.preventDefault()
    toggleFollowing()
  }
  return (
    <ChannelCardArticle className={className} activeDisabled={activeDisabled}>
      <ChannelCardAnchor onClick={onClick} to={channel?.id ? absoluteRoutes.viewer.channel(channel.id) : ''}>
        <StyledAvatar size="channel-card" loading={isLoadingAsset || loading} assetUrl={url} />
        <SwitchTransition>
          <CSSTransition
            key={loading ? 'placeholder' : 'content'}
            timeout={parseInt(cVar('animationTransitionFast', true))}
            classNames={transitions.names.fade}
          >
            <InfoWrapper>
              {loading || !channel ? (
                <>
                  <SkeletonLoader width={100} height={mdMatch ? 24 : 20} bottomSpace={mdMatch ? 4 : 8} />
                  <SkeletonLoader width={70} height={mdMatch ? 20 : 16} bottomSpace={withFollowButton ? 16 : 0} />
                  {withFollowButton && <SkeletonLoader width={60} height={32} />}
                </>
              ) : (
                <>
                  <ChannelTitle variant={mdMatch ? 'h300' : 't200-strong'}>{channel.title}</ChannelTitle>
                  <ChannelFollows variant={mdMatch ? 't200' : 't100'} secondary>
                    {formatNumberShort(channel.follows || 0)} followers
                  </ChannelFollows>
                  {withFollowButton && (
                    <FollowButton
                      variant="secondary"
                      size="small"
                      onClick={handleFollowButtonClick}
                      onMouseOut={() => setActiveDisabled(false)}
                      onMouseMove={() => setActiveDisabled(true)}
                    >
                      {isFollowing ? 'Unfollow' : 'Follow'}
                    </FollowButton>
                  )}
                </>
              )}
            </InfoWrapper>
          </CSSTransition>
        </SwitchTransition>
      </ChannelCardAnchor>
    </ChannelCardArticle>
  )
}
