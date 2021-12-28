import React from 'react'

import { Video } from '@/api/queries'
import { Avatar } from '@/components/Avatar'
import { Text } from '@/components/Text'
import { SvgActionCopy, SvgActionMore } from '@/components/_icons'
import { ContextMenu } from '@/components/_overlays/ContextMenu'
import { formatVideoViewsAndDate } from '@/utils/video'

import {
  KebabMenuButtonIcon,
  StyledAvatar,
  VideoDetailsContainer,
  VideoInfoContainer,
  VideoMetaContainer,
} from './VideoTileDetails.styles'

export type VideoTileDetailsProps = {
  video: Video
  channelAvatarUrl?: string
  loading?: boolean
  size?: 'small' | 'medium'
}

export const VideoTileDetails: React.FC<VideoTileDetailsProps> = ({
  video,
  size = 'medium',
  channelAvatarUrl,
  loading,
}) => {
  return (
    <VideoDetailsContainer>
      <StyledAvatar assetUrl={channelAvatarUrl} loading={loading} />
      <div>
        <Text variant={size === 'medium' ? 'h400' : 'h200'}>{video.title}</Text>
        <VideoMetaContainer>
          <Text variant={size === 'medium' ? 't200' : 't100'} secondary>
            {video.channel?.title}
          </Text>
          <Text variant={size === 'medium' ? 't200' : 't100'} secondary>
            {formatVideoViewsAndDate(video.views, video.createdAt)}
          </Text>
        </VideoMetaContainer>
      </div>
      <ContextMenu
        placement="bottom-end"
        items={[
          {
            icon: <SvgActionCopy />,
            onClick: () => console.log('hello'),
            title: 'Copy video URL',
          },
        ]}
        trigger={
          <KebabMenuButtonIcon onClick={() => null} variant="tertiary" size="small">
            <SvgActionMore />
          </KebabMenuButtonIcon>
        }
      />
    </VideoDetailsContainer>
  )
}
