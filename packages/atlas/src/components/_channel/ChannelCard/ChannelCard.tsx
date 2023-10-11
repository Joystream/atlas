import { FC, MouseEvent, useState } from 'react'
import { CSSTransition, SwitchTransition } from 'react-transition-group'

import { BasicChannelFieldsFragment } from '@/api/queries/__generated__/fragments.generated'
import { NumberFormat } from '@/components/NumberFormat'
import { SkeletonLoader } from '@/components/_loaders/SkeletonLoader'
import { absoluteRoutes } from '@/config/routes'
import { useHandleFollowChannel } from '@/hooks/useHandleFollowChannel'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { cVar, transitions } from '@/styles'

import {
  ChannelCardAnchor,
  ChannelCardArticle,
  ChannelFollows,
  FollowButton,
  InfoWrapper,
  StyledAvatar,
  StyledChannelTitle,
} from './ChannelCard.styles'

export type ChannelCardProps = {
  withFollowButton?: boolean
  className?: string
  onClick?: () => void
  loading?: boolean
  channel?: BasicChannelFieldsFragment
}

export const ChannelCard: FC<ChannelCardProps> = ({
  className,
  onClick,
  withFollowButton = true,
  channel,
  loading,
}) => {
  const mdMatch = useMediaMatch('md')
  const [activeDisabled, setActiveDisabled] = useState(false)

  const { toggleFollowing, isFollowing } = useHandleFollowChannel(channel?.id, channel?.title)

  const handleFollowButtonClick = (e: MouseEvent) => {
    e.preventDefault()
    toggleFollowing()
  }
  return (
    <ChannelCardArticle className={className} activeDisabled={activeDisabled}>
      <ChannelCardAnchor onClick={onClick} to={channel?.id ? absoluteRoutes.viewer.channel(channel.id) : ''}>
        <StyledAvatar loading={loading} assetUrls={channel?.avatarPhoto?.resolvedUrls} />
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
                  <StyledChannelTitle as="h3" variant={mdMatch ? 'h300' : 't200-strong'}>
                    {channel.title}
                  </StyledChannelTitle>
                  <ChannelFollows as="p" variant={mdMatch ? 't200' : 't100'} color="colorText">
                    <NumberFormat as="span" format="short" value={channel.followsNum || 0} color="colorText" />{' '}
                    followers
                  </ChannelFollows>
                  {withFollowButton && (
                    <FollowButton
                      variant="secondary"
                      size="small"
                      onClick={handleFollowButtonClick}
                      onMouseLeave={() => setActiveDisabled(false)}
                      onMouseEnter={() => setActiveDisabled(true)}
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
