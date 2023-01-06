import { FC } from 'react'
import { CSSTransition, SwitchTransition } from 'react-transition-group'

import { useBasicVideo } from '@/api/hooks/video'
import { SvgActionCheck } from '@/assets/icons'
import { Pill } from '@/components/Pill'
import { Text } from '@/components/Text'
import { VideoListItemLoader } from '@/components/_video/VideoListItem/VideoListItemLoader'
import { VideoThumbnail } from '@/components/_video/VideoThumbnail'
import { Views } from '@/components/_video/VideoTileDetails/VideoTileDetails.styles'
import { useVideoTileSharedLogic } from '@/hooks/useVideoTileSharedLogic'
import { cVar, transitions } from '@/styles'
import { SentryLogger } from '@/utils/logs'
import { formatDurationShort } from '@/utils/time'
import { formatVideoDate } from '@/utils/video'

import { DetailsWrapper, EndNodeWrapper, Wrapper } from './VideoListItem.styles'

type VideoListItemProps = {
  id?: string
  onClick?: () => void
  isActive?: boolean
  variant?: 'small' | 'large'
  className?: string
  clickable?: boolean
}

export const VideoListItem: FC<VideoListItemProps> = ({
  id,
  onClick,
  isActive,
  className,
  variant = 'small',
  clickable,
}) => {
  const { video, loading } = useBasicVideo(id ?? '', {
    skip: !id,
    onError: (error) => SentryLogger.error('Failed to fetch video', 'VideoListItem', error, { video: { id } }),
  })
  const { isLoadingAvatar, thumbnailPhotoUrl } = useVideoTileSharedLogic(video)

  return (
    <SwitchTransition>
      <CSSTransition
        key={String(loading || isLoadingAvatar)}
        timeout={parseInt(cVar('animationTimingFast', true))}
        classNames={transitions.names.fade}
      >
        {loading || isLoadingAvatar ? (
          <VideoListItemLoader variant={variant} />
        ) : (
          <Wrapper clickable={clickable} variant={variant} onClick={onClick} className={className}>
            <VideoThumbnail
              type="video"
              clickable={false}
              thumbnailUrl={thumbnailPhotoUrl || ''}
              thumbnailAlt={video ? `${video.title} by ${video.channel.title} thumbnail` : ''}
              slots={
                variant === 'large' && video?.duration
                  ? {
                      bottomRight: {
                        element: (
                          <Pill variant="overlay" label={formatDurationShort(video.duration)} title="Video duration" />
                        ),
                        type: 'default',
                      },
                    }
                  : undefined
              }
            />

            <DetailsWrapper variant={variant}>
              <Text
                variant={variant === 'small' ? 't200-strong' : 'h400'}
                as="h4"
                color={variant === 'small' ? 'colorText' : 'colorTextStrong'}
              >
                {video?.title}
              </Text>
              {video && (
                <Text
                  variant={variant === 'small' ? 't100' : 't200'}
                  as="p"
                  color={variant === 'small' ? 'colorText' : 'colorTextMuted'}
                >
                  <>
                    {formatVideoDate(video.createdAt)} •{' '}
                    <Views
                      as="span"
                      value={video.views ?? 0}
                      format="short"
                      color={variant === 'small' ? 'colorText' : 'colorTextMuted'}
                    />
                    &nbsp;views
                  </>{' '}
                </Text>
              )}
            </DetailsWrapper>
            {isActive && (
              <EndNodeWrapper>
                <SvgActionCheck />
              </EndNodeWrapper>
            )}
          </Wrapper>
        )}
      </CSSTransition>
    </SwitchTransition>
  )
}
