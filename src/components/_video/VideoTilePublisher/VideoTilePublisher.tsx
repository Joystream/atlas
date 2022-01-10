import styled from '@emotion/styled'
import React, { useCallback } from 'react'
import { CSSTransition } from 'react-transition-group'

import { AssetAvailability } from '@/api/queries'
import { Pill } from '@/components/Pill'
import { UploadProgressBar } from '@/components/UploadProgressBar'
import { IconButton } from '@/components/_buttons/IconButton'
import {
  SvgActionCopy,
  SvgActionEdit,
  SvgActionHide,
  SvgActionPlay,
  SvgActionReupload,
  SvgActionTrash,
  SvgActionWarning,
  SvgIllustrativePlay,
  SvgIllustrativeReupload,
} from '@/components/_icons'
import { absoluteRoutes } from '@/config/routes'
import { useVideoTileSharedLogic } from '@/hooks/useVideoTileSharedLogic'
import { useUploadsStore } from '@/providers/uploadsManager'
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

    const uploadVideoStatus = useUploadsStore(
      (state) => state.uploadsStatus[video?.mediaDataObject?.joystreamContentId || '']
    )
    const uploadThumbnailStatus = useUploadsStore(
      (state) => state.uploadsStatus[video?.thumbnailPhotoDataObject?.joystreamContentId || '']
    )

    const isVideoUploading =
      uploadVideoStatus?.lastStatus === 'inProgress' ||
      uploadVideoStatus?.lastStatus === 'processing' ||
      uploadVideoStatus?.lastStatus === 'reconnecting'

    const isThumbnailUploading =
      uploadThumbnailStatus?.lastStatus === 'inProgress' ||
      uploadThumbnailStatus?.lastStatus === 'processing' ||
      uploadThumbnailStatus?.lastStatus === 'reconnecting'

    const isUploading = isVideoUploading || isThumbnailUploading

    const hasThumbnailUploadFailed =
      video?.thumbnailPhotoAvailability === AssetAvailability.Pending &&
      (!uploadThumbnailStatus || uploadThumbnailStatus?.lastStatus === 'error')

    const hasVideoUploadFailed =
      video?.mediaAvailability === AssetAvailability.Pending &&
      (!uploadVideoStatus || uploadVideoStatus.lastStatus === 'error')

    const hasAssetUploadFailed = hasThumbnailUploadFailed || hasVideoUploadFailed

    const isUnlisted = video?.isPublic === false

    const getSlots = useCallback<() => undefined | SlotsObject>(() => {
      if ((isUploading && !hasAssetUploadFailed) || loading) {
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
        slots.bottomRight = {
          element: <Pill variant="danger" label="Failed upload" icon={<SvgActionWarning />} />,
        }
        slots.center = {
          element: <SvgIllustrativeReupload />,
          type: 'hover',
        }
        slots.topRight = null
      }
      if (isUnlisted) {
        slots.bottomLeft = {
          element: <Pill variant="overlay" label="Unlisted" icon={<SvgActionHide />} />,
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
      if (hasAssetUploadFailed) {
        return 'Upload failed...'
      }
      if (uploadVideoStatus?.lastStatus === 'inProgress' || uploadThumbnailStatus?.lastStatus === 'inProgress') {
        return 'Uploading...'
      }
      if (uploadVideoStatus?.lastStatus === 'processing' || uploadThumbnailStatus?.lastStatus === 'processing') {
        return 'Processing...'
      }
      return
    }, [hasAssetUploadFailed, uploadThumbnailStatus?.lastStatus, uploadVideoStatus?.lastStatus])

    const getContentSlot = () => {
      if (hasAssetUploadFailed) {
        return
      }
      return (
        <CSSTransition in={isUploading} timeout={1000} classNames={DELAYED_FADE_CLASSNAME} unmountOnExit mountOnEnter>
          <UploadProgressTransition>
            <UploadProgressBar
              progress={uploadVideoStatus?.progress || uploadThumbnailStatus?.progress}
              lastStatus={uploadVideoStatus?.lastStatus || uploadThumbnailStatus?.lastStatus}
              withLoadingIndicator
            />
          </UploadProgressTransition>
        </CSSTransition>
      )
    }

    return (
      <VideoTile
        clickable={!isUploading || hasAssetUploadFailed}
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
