import { FC } from 'react'
import { CSSTransition, SwitchTransition } from 'react-transition-group'

import { useBasicVideo } from '@/api/hooks/video'
import { SvgActionMore } from '@/assets/icons'
import { ListItemProps } from '@/components/ListItem'
import { Pill } from '@/components/Pill'
import { Text } from '@/components/Text'
import { Button } from '@/components/_buttons/Button'
import { ContextMenu } from '@/components/_overlays/ContextMenu'
import { VideoListItemLoader } from '@/components/_video/VideoListItem/VideoListItemLoader'
import { VideoThumbnail } from '@/components/_video/VideoThumbnail'
import { Views } from '@/components/_video/VideoTileDetails/VideoTileDetails.styles'
import { cVar, transitions } from '@/styles'
import { SentryLogger } from '@/utils/logs'
import { formatDurationShort } from '@/utils/time'
import { formatVideoDate } from '@/utils/video'

import { ContextMenuWrapper, DetailsWrapper, StyledListItem, ThumbnailContainer } from './VideoListItem.styles'

type VideoListItemProps = {
  id?: string
  onClick?: () => void
  isSelected?: boolean
  variant?: 'small' | 'large'
  className?: string
  isInteractive?: boolean
  menuItems?: ListItemProps[]
}

export const VideoListItem: FC<VideoListItemProps> = ({
  id,
  onClick,
  isSelected,
  className,
  variant = 'small',
  isInteractive = true,
  menuItems,
}) => {
  const { video, loading } = useBasicVideo(id ?? '', {
    skip: !id,
    onError: (error) => SentryLogger.error('Failed to fetch video', 'VideoListItem', error, { video: { id } }),
  })

  return (
    <SwitchTransition>
      <CSSTransition
        key={String(loading)}
        timeout={parseInt(cVar('animationTimingFast', true))}
        classNames={transitions.names.fade}
      >
        {loading ? (
          <VideoListItemLoader variant={variant} />
        ) : (
          <StyledListItem
            ignoreRWD={variant === 'small'}
            isInteractive={isInteractive}
            className={className}
            onClick={onClick}
            selected={isSelected}
            nodeEndPosition="top"
            nodeEnd={
              <DetailsWrapper variant={variant}>
                {menuItems && (
                  <ContextMenuWrapper className="video-list-item-kebab">
                    <ContextMenu
                      placement="bottom-end"
                      appendTo={document.body}
                      items={menuItems}
                      trigger={<Button onClick={() => null} icon={<SvgActionMore />} variant="tertiary" size="small" />}
                    />
                  </ContextMenuWrapper>
                )}
              </DetailsWrapper>
            }
            nodeStart={
              <ThumbnailContainer variant={variant}>
                <VideoThumbnail
                  type="video"
                  clickable={false}
                  thumbnailUrls={video?.thumbnailPhoto?.resolvedUrls}
                  thumbnailAlt={video ? `${video.title} by ${video.channel.title} thumbnail` : ''}
                  slots={
                    variant === 'large' && video?.duration
                      ? {
                          bottomRight: {
                            element: (
                              <Pill
                                variant="overlay"
                                label={formatDurationShort(video.duration)}
                                title="Video duration"
                              />
                            ),
                            type: 'default',
                          },
                        }
                      : undefined
                  }
                />
              </ThumbnailContainer>
            }
            label={
              <Text
                variant={variant === 'small' ? 't200-strong' : 'h400'}
                as="h4"
                color={variant === 'small' ? 'colorText' : 'colorTextStrong'}
              >
                {video?.title}
              </Text>
            }
            caption={
              video && (
                <Text
                  variant={variant === 'small' ? 't100' : 't200'}
                  as="p"
                  color={variant === 'small' ? 'colorText' : 'colorTextMuted'}
                >
                  <>
                    {formatVideoDate(video.createdAt)} •{' '}
                    <Views
                      as="span"
                      value={video.viewsNum ?? 0}
                      format="short"
                      color={variant === 'small' ? 'colorText' : 'colorTextMuted'}
                    />
                    &nbsp;views
                  </>{' '}
                </Text>
              )
            }
          />
        )}
      </CSSTransition>
    </SwitchTransition>
  )
}
