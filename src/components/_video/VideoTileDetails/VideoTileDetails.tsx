import React from 'react'
import { To } from 'react-router'
import { CSSTransition, SwitchTransition } from 'react-transition-group'

import { Text } from '@/components/Text'
import { SvgActionMore } from '@/components/_icons'
import { SkeletonLoader } from '@/components/_loaders/SkeletonLoader'
import { ContextMenu, MenuItemProps } from '@/components/_overlays/ContextMenu'
import { cVar, transitions } from '@/styles'
import { formatVideoViewsAndDate } from '@/utils/video'

import {
  ChannelTitle,
  KebabMenuButtonIcon,
  StyledAvatar,
  StyledLink,
  VideoDetailsContainer,
  VideoInfoContainer,
  VideoMetaContainer,
  VideoTitle,
} from './VideoTileDetails.styles'

export type VideoDetailsVariant = 'withoutChannel' | 'withChannelName' | 'withChannelNameAndAvatar'

export type VideoTileDetailsProps = {
  videoTitle?: string | null
  onVideoTitleClick?: () => void
  videoSubTitle?: string | null
  videoHref?: string
  views?: number | null
  createdAt?: Date | null
  channelTitle?: string | null
  channelAvatarUrl?: string | null
  channelHref?: string
  onChannelAvatarClick?: () => void
  loadingAvatar?: boolean
  loading?: boolean
  size?: 'small' | 'medium'
  kebabMenuItems?: MenuItemProps[]
  variant?: VideoDetailsVariant
}

export const VideoTileDetails: React.FC<VideoTileDetailsProps> = ({
  videoTitle,
  onVideoTitleClick,
  videoSubTitle,
  videoHref,
  views,
  createdAt,
  channelTitle,
  channelHref,
  onChannelAvatarClick,
  size = 'medium',
  channelAvatarUrl,
  loadingAvatar,
  loading,
  kebabMenuItems = [],
  variant = 'withChannelNameAndAvatar',
}) => {
  return (
    <VideoDetailsContainer>
      {variant === 'withChannelNameAndAvatar' && (
        <StyledAvatar assetUrl={channelAvatarUrl} loading={loadingAvatar} onClick={onChannelAvatarClick} />
      )}
      <SwitchTransition>
        <CSSTransition
          timeout={parseInt(cVar('animationTimingFast', true))}
          key={String(loading)}
          classNames={transitions.names.fade}
        >
          <VideoInfoContainer>
            {loading ? (
              <SkeletonLoader height={size === 'medium' ? 24 : 20} width="60%" />
            ) : (
              <LinkWrapper to={videoHref}>
                <VideoTitle onClick={onVideoTitleClick} variant={size === 'medium' ? 'h400' : 'h200'}>
                  {videoTitle}
                </VideoTitle>
              </LinkWrapper>
            )}
            <VideoMetaContainer>
              {variant !== 'withoutChannel' &&
                (loading ? (
                  <SkeletonLoader height={size === 'medium' ? 16 : 12} width="100%" bottomSpace={8} />
                ) : (
                  <LinkWrapper to={channelHref}>
                    <ChannelTitle variant={size === 'medium' ? 't200' : 't100'} secondary>
                      {channelTitle}
                    </ChannelTitle>
                  </LinkWrapper>
                ))}
              {loading ? (
                <SkeletonLoader height={size === 'medium' ? 16 : 12} width="100%" />
              ) : (
                <Text variant={size === 'medium' ? 't200' : 't100'} secondary>
                  {videoSubTitle ? videoSubTitle : createdAt && formatVideoViewsAndDate(views || 0, createdAt)}
                </Text>
              )}
            </VideoMetaContainer>
          </VideoInfoContainer>
        </CSSTransition>
      </SwitchTransition>
      {kebabMenuItems.length > 0 && !loading && (
        <ContextMenu
          placement="bottom-end"
          items={kebabMenuItems}
          trigger={
            <KebabMenuButtonIcon onClick={() => null} variant="tertiary" size="small">
              <SvgActionMore />
            </KebabMenuButtonIcon>
          }
        />
      )}
    </VideoDetailsContainer>
  )
}

type LinkWrapperProps = {
  to?: To
}
const LinkWrapper: React.FC<LinkWrapperProps> = ({ children, to }) => {
  if (to) {
    return <StyledLink to={to}>{children}</StyledLink>
  }
  return <>{children}</>
}
