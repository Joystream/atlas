import React from 'react'
import { CSSTransition, SwitchTransition } from 'react-transition-group'

import { Video } from '@/api/queries'
import { Text } from '@/components/Text'
import { SvgActionMore } from '@/components/_icons'
import { SkeletonLoader } from '@/components/_loaders/SkeletonLoader'
import { ContextMenu, MenuItemProps } from '@/components/_overlays/ContextMenu'
import { cVar, transitions } from '@/styles'
import { formatVideoViewsAndDate } from '@/utils/video'

import {
  KebabMenuButtonIcon,
  StyledAvatar,
  VideoDetailsContainer,
  VideoInfoContainer,
  VideoMetaContainer,
  VideoTitle,
} from './VideoTileDetails.styles'

export type VideoDetailsVariant = 'withoutChannel' | 'withChannelName' | 'withChannelNameAndAvatar'

export type VideoTileDetailsProps = {
  video: Video
  channelAvatarUrl?: string
  loading?: boolean
  size?: 'small' | 'medium'
  kebabMenuItems?: MenuItemProps[]
  variant?: VideoDetailsVariant
}

export const VideoTileDetails: React.FC<VideoTileDetailsProps> = ({
  video,
  size = 'medium',
  channelAvatarUrl,
  loading,
  kebabMenuItems,
  variant = 'withChannelNameAndAvatar',
}) => {
  return (
    <VideoDetailsContainer>
      {variant === 'withChannelNameAndAvatar' && <StyledAvatar assetUrl={channelAvatarUrl} loading={loading} />}
      <SwitchTransition>
        <CSSTransition
          key={String(loading)}
          timeout={parseInt(cVar('animationTimingFast', true))}
          classNames={transitions.names.fade}
        >
          <VideoInfoContainer>
            {loading ? (
              <SkeletonLoader height={size === 'medium' ? 24 : 20} width="60%" />
            ) : (
              <VideoTitle variant={size === 'medium' ? 'h400' : 'h200'}>{video.title}</VideoTitle>
            )}
            <VideoMetaContainer>
              {variant !== 'withoutChannel' &&
                (loading ? (
                  <SkeletonLoader height={size === 'medium' ? 16 : 12} width="100%" bottomSpace={8} />
                ) : (
                  <Text variant={size === 'medium' ? 't200' : 't100'} secondary>
                    {video.channel?.title}
                  </Text>
                ))}
              {loading ? (
                <SkeletonLoader height={size === 'medium' ? 16 : 12} width="100%" />
              ) : (
                <Text variant={size === 'medium' ? 't200' : 't100'} secondary>
                  {formatVideoViewsAndDate(video.views, video.createdAt)}
                </Text>
              )}
            </VideoMetaContainer>
          </VideoInfoContainer>
        </CSSTransition>
      </SwitchTransition>
      {kebabMenuItems?.length && (
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
