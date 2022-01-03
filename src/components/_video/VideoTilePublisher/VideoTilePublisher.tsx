import styled from '@emotion/styled'
import React, { useCallback } from 'react'
import { CSSTransition } from 'react-transition-group'

import { AssetAvailability } from '@/api/queries'
import { StyledSvgIllustrativeFileFailed } from '@/components/Avatar/Avatar.styles'
import { Pill } from '@/components/Pill'
import { Text } from '@/components/Text'
import { UploadProgressBar } from '@/components/UploadProgressBar'
import { IconButton } from '@/components/_buttons/IconButton'
import {
  SvgActionCopy,
  SvgActionEdit,
  SvgActionHide,
  SvgActionPlay,
  SvgActionReupload,
  SvgActionTrash,
  SvgIllustrativePlay,
  SvgIllustrativeReupload,
} from '@/components/_icons'
import { absoluteRoutes } from '@/config/routes'
import { useVideoTileSharedLogic } from '@/hooks/useVideoTileSharedLogic'
import { useUploadsStore } from '@/providers/uploadsManager'
import { cVar, square } from '@/styles'
import { formatDurationShort } from '@/utils/time'

import { SlotsObject } from '../VideoThumbnail'
import { VideoTile } from '../VideoTile'

type VideoTilePublisherProps = {
  id?: string
  onEditClick?: (e?: React.MouseEvent<HTMLElement>) => void
  onDeleteVideoClick?: () => void
  onReuploadVideoClick?: () => void
  onOpenInTabClick?: () => void
  onCopyVideoURLClick?: () => void
}

export const DELAYED_FADE_CLASSNAME = 'delayed-fade'

export const VideoTilePublisher: React.FC<VideoTilePublisherProps> = React.memo(
  ({ id, onEditClick, onDeleteVideoClick, onReuploadVideoClick, onOpenInTabClick, onCopyVideoURLClick }) => {
    const { isLoadingThumbnail, thumbnailPhotoUrl, loading, video, videoHref } = useVideoTileSharedLogic({
      id,
    })

    const uploadStatus = useUploadsStore(
      (state) => state.uploadsStatus[video?.mediaDataObject?.joystreamContentId || '']
    )

    const isUploading = uploadStatus && uploadStatus.lastStatus !== 'completed'

    const isUnlisted = video?.isPublic === false

    const hasThumbnailUploadFailed = video?.thumbnailPhotoAvailability === AssetAvailability.Pending
    const hasVideoUploadFailed = video?.mediaAvailability === AssetAvailability.Pending
    const hasAssetUploadFailed = hasThumbnailUploadFailed || hasVideoUploadFailed

    const getSlots = useCallback<() => undefined | SlotsObject>(() => {
      if (isUploading || loading) {
        return
      }
      const slots: SlotsObject = {
        bottomRight: {
          element: video?.duration && <Pill variant="overlay" label={formatDurationShort(video?.duration)} />,
        },
        topRight: {
          element: (
            <IconButton size="small" onClick={onEditClick}>
              <SvgActionEdit />
            </IconButton>
          ),
          clickable: true,
          type: 'hover',
        },
        center: {
          element: <SvgIllustrativePlay />,
          type: 'hover',
        },
      }
      if (hasAssetUploadFailed) {
        return {
          bottomRight: {
            element: <Pill variant="danger" label="Failed upload" />,
          },
          center: {
            element: <SvgIllustrativeReupload />,
            type: 'hover' as const,
          },
        }
      }
      if (isUnlisted) {
        return {
          ...slots,
          bottomLeft: {
            element: <Pill variant="overlay" label="Unlisted" icon={<SvgActionHide />} />,
          },
        }
      }
      return slots
    }, [hasAssetUploadFailed, isUnlisted, isUploading, loading, onEditClick, video?.duration])

    const getPublisherKebabMenuItems = useCallback(() => {
      const assetFailedKebabItems = [
        {
          icon: <SvgActionTrash />,
          onClick: onDeleteVideoClick,
          title: 'Delete video',
        },
        {
          icon: <SvgActionReupload />,
          onClick: onReuploadVideoClick,
          title: 'Reupload file',
        },
      ]

      const publisherBasicKebabItems = [
        {
          icon: <SvgActionPlay />,
          onClick: onOpenInTabClick,
          title: 'Play in Joystream',
        },
        {
          icon: <SvgActionCopy />,
          onClick: onCopyVideoURLClick,
          title: 'Copy video URL',
        },
        {
          icon: <SvgActionEdit />,
          onClick: onEditClick,
          title: 'Edit video',
        },
        {
          icon: <SvgActionTrash />,
          onClick: onDeleteVideoClick,
          title: 'Delete video',
        },
      ]

      return hasAssetUploadFailed ? assetFailedKebabItems : publisherBasicKebabItems
    }, [
      hasAssetUploadFailed,
      onCopyVideoURLClick,
      onDeleteVideoClick,
      onEditClick,
      onOpenInTabClick,
      onReuploadVideoClick,
    ])

    const getVideoSubtitle = useCallback(() => {
      if (uploadStatus?.lastStatus === 'inProgress') {
        return 'Uploading...'
      }
      if (uploadStatus?.lastStatus === 'processing') {
        return 'Processing...'
      }
      if (hasAssetUploadFailed) {
        return 'Upload failed...'
      }
      return
    }, [hasAssetUploadFailed, uploadStatus?.lastStatus])

    const getContentSlot = () => {
      if (!isUploading && hasThumbnailUploadFailed) {
        return (
          <CoverThumbnailUploadFailed>
            <StyledSvgIllustrativeFileFailed />
            <Text variant="t100" secondary>
              Asset upload failed
            </Text>
          </CoverThumbnailUploadFailed>
        )
      }
      return (
        <CSSTransition in={isUploading} timeout={1000} classNames={DELAYED_FADE_CLASSNAME} unmountOnExit mountOnEnter>
          <UploadProgressTransition>
            <UploadProgressBar
              progress={uploadStatus?.progress}
              lastStatus={uploadStatus?.lastStatus}
              withLoadingIndicator
            />
          </UploadProgressTransition>
        </CSSTransition>
      )
    }

    return (
      <VideoTile
        clickable={!isUploading}
        slots={getSlots()}
        contentSlot={getContentSlot()}
        videoHref={hasVideoUploadFailed ? absoluteRoutes.studio.uploads() : videoHref}
        linkState={hasAssetUploadFailed ? { highlightFailed: true } : undefined}
        videoSubTitle={getVideoSubtitle()}
        detailsVariant="withoutChannel"
        loadingDetails={loading}
        loadingThumbnail={isLoadingThumbnail}
        thumbnailUrl={thumbnailPhotoUrl}
        createdAt={video?.createdAt}
        videoTitle={video?.title}
        views={video?.views}
        kebabMenuItems={getPublisherKebabMenuItems()}
      />
    )
  }
)

export const CoverThumbnailUploadFailed = styled.div`
  ${square('100%')}

  background:${cVar('colorCoreNeutral900')};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

export const UploadProgressTransition = styled.div`
  &.${DELAYED_FADE_CLASSNAME}-enter {
    opacity: 0;
  }

  &.${DELAYED_FADE_CLASSNAME}-enter-active {
    opacity: 1;
    transition: opacity 200ms ease-out;
  }

  &.${DELAYED_FADE_CLASSNAME}-exit {
    opacity: 1;
  }

  &.${DELAYED_FADE_CLASSNAME}-exit-active {
    opacity: 0;
    transition: opacity 400ms ease-out 600ms;
  }
`

VideoTilePublisher.displayName = 'VideoTilePublisher'
