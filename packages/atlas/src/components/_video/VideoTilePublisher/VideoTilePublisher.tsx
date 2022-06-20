import styled from '@emotion/styled'
import { FC, MouseEvent, memo, useCallback } from 'react'
import { useNavigate } from 'react-router'
import { CSSTransition } from 'react-transition-group'

import { getNftStatus, useFullVideo } from '@/api/hooks'
import { OwnerPill } from '@/components/OwnerPill'
import { Pill } from '@/components/Pill'
import { UploadProgressBar } from '@/components/UploadProgressBar'
import { Button } from '@/components/_buttons/Button'
import {
  SvgActionCopy,
  SvgActionEdit,
  SvgActionHide,
  SvgActionMint,
  SvgActionPlay,
  SvgActionReupload,
  SvgActionSell,
  SvgActionShoppingCart,
  SvgActionTrash,
  SvgActionWarning,
  SvgIllustrativePlay,
  SvgIllustrativeReupload,
} from '@/components/_icons'
import { absoluteRoutes } from '@/config/routes'
import { useClipboard } from '@/hooks/useClipboard'
import { useGetNftSlot } from '@/hooks/useGetNftSlot'
import { useNftState } from '@/hooks/useNftState'
import { useVideoTileSharedLogic } from '@/hooks/useVideoTileSharedLogic'
import { useMemberAvatar } from '@/providers/assets'
import { useNftActions } from '@/providers/nftActions'
import { useUploadsStore } from '@/providers/uploadsManager'
import { openInNewTab } from '@/utils/browser'
import { SentryLogger } from '@/utils/logs'
import { formatDurationShort } from '@/utils/time'

import { SlotsObject } from '../VideoThumbnail'
import { VideoTile } from '../VideoTile'

type VideoTilePublisherProps = {
  id?: string
  onEditClick?: (e?: MouseEvent<HTMLElement>) => void
  onMintNftClick?: (e?: MouseEvent<HTMLElement>) => void
  onDeleteVideoClick?: () => void
  onReuploadVideoClick?: () => void
}

export const DELAYED_FADE_CLASSNAME = 'delayed-fade'

export const VideoTilePublisher: FC<VideoTilePublisherProps> = memo(
  ({ id, onEditClick, onDeleteVideoClick, onReuploadVideoClick, onMintNftClick }) => {
    const { copyToClipboard } = useClipboard()
    const { video, loading } = useFullVideo(id ?? '', {
      skip: !id,
      onError: (error) => SentryLogger.error('Failed to fetch video', 'VideoTilePublisher', error, { video: { id } }),
    })
    const { isLoadingThumbnail, thumbnailPhotoUrl, videoHref } = useVideoTileSharedLogic(video)
    const navigate = useNavigate()

    const hasNft = !!video?.nft

    const { openNftPutOnSale, cancelNftSale, openNftSettlement } = useNftActions()
    const owner = video?.nft?.ownerMember?.id !== video?.channel.ownerMember?.id ? video?.nft?.ownerMember : undefined

    const ownerAvatar = useMemberAvatar(video?.nft?.ownerMember)

    const nftStatus = getNftStatus(video?.nft)

    const {
      auctionPlannedEndDate,
      englishTimerState,
      needsSettling,
      startsAtDate,
      timerLoading,
      canCancelSale,
      canPutOnSale,
      saleType,
    } = useNftState(video?.nft)
    const nftTilePublisher = useGetNftSlot({
      auctionPlannedEndDate,
      status: nftStatus?.status,
      englishTimerState,
      needsSettling,
      startsAtDate,
      withNftLabel: true,
      timerLoading,
    })

    const uploadVideoStatus = useUploadsStore((state) => state.uploadsStatus[video?.media?.id || ''])
    const uploadThumbnailStatus = useUploadsStore((state) => state.uploadsStatus[video?.thumbnailPhoto?.id || ''])

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
      (video?.thumbnailPhoto &&
        !video.thumbnailPhoto.isAccepted &&
        uploadThumbnailStatus?.lastStatus !== 'completed') ||
      false
    const hasVideoUploadFailed =
      (video?.media && !video.media.isAccepted && uploadVideoStatus?.lastStatus !== 'completed') || false

    const hasAssetUploadFailed = (hasThumbnailUploadFailed || hasVideoUploadFailed) && !isUploading

    const isUnlisted = video?.isPublic === false

    const getSlots = useCallback<() => undefined | SlotsObject>(() => {
      if ((isUploading && !hasAssetUploadFailed) || loading) {
        return
      }
      const slots: SlotsObject = {
        bottomRight: {
          element: video?.duration ? <Pill variant="overlay" label={formatDurationShort(video?.duration)} /> : null,
        },
        bottomLeft: video?.nft ? nftTilePublisher : undefined,
        topLeft: owner
          ? {
              element: (
                <OwnerPill
                  onClick={(e) => {
                    e?.preventDefault()
                    navigate(absoluteRoutes.viewer.member(owner.handle))
                  }}
                  avatar={{ assetUrl: ownerAvatar.url, loading: ownerAvatar.isLoadingAsset }}
                  handle={owner.handle}
                  title={owner.handle}
                />
              ),
              clickable: true,
              halfWidth: true,
            }
          : undefined,
        topRight: {
          element: <Button icon={<SvgActionEdit />} size="small" onClick={onEditClick} />,
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
        slots.topRight = undefined
        slots.bottomLeft = nftTilePublisher
      }
      if (isUnlisted) {
        slots.bottomLeft = nftTilePublisher && {
          element: <Pill variant="overlay" label="Unlisted" icon={<SvgActionHide />} />,
        }
      }
      return slots
    }, [
      hasAssetUploadFailed,
      isUnlisted,
      isUploading,
      loading,
      navigate,
      nftTilePublisher,
      onEditClick,
      owner,
      ownerAvatar.isLoadingAsset,
      ownerAvatar.url,
      video?.duration,
      video?.nft,
    ])

    const getPublisherKebabMenuItems = useCallback(() => {
      if (isUploading && !hasAssetUploadFailed) {
        return
      }
      const assetFailedKebabItems = [
        {
          icon: <SvgActionReupload />,
          onClick: onReuploadVideoClick,
          title: 'Reupload file',
        },
        ...(!hasNft
          ? [
              {
                icon: <SvgActionTrash />,
                onClick: onDeleteVideoClick,
                title: 'Delete video',
                destructive: true,
              },
            ]
          : []),
      ]

      const onOpenInTabClick = () => {
        if (videoHref) {
          openInNewTab(videoHref, true)
        }
      }

      const publisherBasicKebabItems = [
        {
          icon: <SvgActionPlay />,
          onClick: onOpenInTabClick,
          title: 'Play in Joystream',
        },
        {
          icon: <SvgActionCopy />,
          onClick: () => {
            copyToClipboard(videoHref ? location.origin + videoHref : '', 'Video URL copied to clipboard')
          },
          title: 'Copy video URL',
        },
        {
          icon: <SvgActionEdit />,
          onClick: onEditClick,
          title: 'Edit video',
        },
        ...(hasNft
          ? [
              ...(needsSettling
                ? [
                    {
                      icon: <SvgActionShoppingCart />,
                      onClick: () => id && openNftSettlement(id),
                      title: 'Settle auction',
                    },
                  ]
                : []),
              ...(canPutOnSale
                ? [{ icon: <SvgActionSell />, onClick: () => openNftPutOnSale(id || ''), title: 'Start sale' }]
                : []),
              ...(canCancelSale && saleType
                ? [
                    {
                      icon: <SvgActionTrash />,
                      onClick: () => cancelNftSale(id || '', saleType),
                      title: 'Remove from sale',
                      destructive: true,
                    },
                  ]
                : []),
            ]
          : [{ icon: <SvgActionMint />, onClick: onMintNftClick, title: 'Mint NFT' }]),
        ...(!hasNft && !canCancelSale
          ? [
              {
                icon: <SvgActionTrash />,
                onClick: onDeleteVideoClick,
                title: 'Delete video',
                destructive: true,
              },
            ]
          : []),
      ]

      return hasAssetUploadFailed ? assetFailedKebabItems : publisherBasicKebabItems
    }, [
      isUploading,
      hasAssetUploadFailed,
      onReuploadVideoClick,
      hasNft,
      onDeleteVideoClick,
      onEditClick,
      needsSettling,
      canPutOnSale,
      canCancelSale,
      saleType,
      onMintNftClick,
      videoHref,
      copyToClipboard,
      id,
      openNftSettlement,
      openNftPutOnSale,
      cancelNftSale,
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

    const getAllFilesLasStatus = useCallback(() => {
      if (uploadVideoStatus?.lastStatus === 'inProgress' || uploadThumbnailStatus?.lastStatus === 'inProgress') {
        return 'inProgress'
      }
      if (uploadVideoStatus?.lastStatus === 'processing' || uploadThumbnailStatus?.lastStatus === 'processing') {
        return 'processing'
      }
      if (uploadVideoStatus?.lastStatus === 'completed' || uploadThumbnailStatus?.lastStatus === 'completed') {
        return 'completed'
      }
    }, [uploadThumbnailStatus?.lastStatus, uploadVideoStatus?.lastStatus])

    const getContentSlot = () => {
      return (
        <CSSTransition
          in={isUploading && !hasAssetUploadFailed}
          timeout={1000}
          classNames={DELAYED_FADE_CLASSNAME}
          unmountOnExit
          mountOnEnter
        >
          <UploadProgressTransition>
            <UploadProgressBar
              progress={uploadVideoStatus?.progress || uploadThumbnailStatus?.progress}
              lastStatus={getAllFilesLasStatus()}
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
        videoHref={hasVideoUploadFailed || isUploading ? absoluteRoutes.studio.uploads() : videoHref}
        linkState={hasAssetUploadFailed ? { highlightFailed: true } : undefined}
        videoSubTitle={getVideoSubtitle()}
        detailsVariant="withoutChannel"
        loadingDetails={loading || !video}
        loadingThumbnail={isLoadingThumbnail && !hasThumbnailUploadFailed}
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
