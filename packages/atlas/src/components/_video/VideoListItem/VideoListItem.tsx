import { CSSTransition, SwitchTransition } from 'react-transition-group'

import { useBasicVideo } from '@/api/hooks/video'
import { SvgAlertsSuccess24 } from '@/assets/icons'
import { Text } from '@/components/Text'
import { VideoListItemLoader } from '@/components/_video/VideoListItem/VideoListItemLoader'
import { Views } from '@/components/_video/VideoTileDetails/VideoTileDetails.styles'
import { useVideoTileSharedLogic } from '@/hooks/useVideoTileSharedLogic'
import { cVar, transitions } from '@/styles'
import { SentryLogger } from '@/utils/logs'
import { formatVideoDate } from '@/utils/video'

import { DetailsWrapper, EndNodeWrapper, ThumbnailBackground, ThumbnailImage, Wrapper } from './VideoListItem.styles'

type VideoListItemProps = {
  id?: string
  onClick?: () => void
  isActive?: boolean
}

export const VideoListItem = ({ id, onClick, isActive }: VideoListItemProps) => {
  const { video, loading } = useBasicVideo(id ?? '', {
    skip: !id,
    onError: (error) => SentryLogger.error('Failed to fetch video', 'VideoTile', error, { video: { id } }),
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
          <VideoListItemLoader />
        ) : (
          <Wrapper onClick={onClick}>
            <ThumbnailBackground>
              {thumbnailPhotoUrl && (
                <ThumbnailImage
                  src={thumbnailPhotoUrl || ''}
                  alt={video ? `${video.title} by ${video.channel.title} thumbnail` : ''}
                />
              )}
            </ThumbnailBackground>

            <DetailsWrapper>
              <Text variant="t200-strong" as="p" color="colorText">
                {video?.title}
              </Text>
              {video && (
                <Text variant="t100" as="p" color="colorText">
                  <>
                    {formatVideoDate(video.createdAt)} •{' '}
                    <Views as="span" value={video.views ?? 0} format="short" color="colorText" />
                    &nbsp;views
                  </>{' '}
                </Text>
              )}
            </DetailsWrapper>
            {isActive && (
              <EndNodeWrapper>
                <SvgAlertsSuccess24 />
              </EndNodeWrapper>
            )}
          </Wrapper>
        )}
      </CSSTransition>
    </SwitchTransition>
  )
}
