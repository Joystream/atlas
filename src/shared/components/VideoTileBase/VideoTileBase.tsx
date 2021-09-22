import React, { useState } from 'react'
import { CSSTransition, SwitchTransition } from 'react-transition-group'
import useResizeObserver from 'use-resize-observer'

import { useContextMenu } from '@/hooks/useContextMenu'
import {
  SvgGlyphClose,
  SvgGlyphCopy,
  SvgGlyphDraft,
  SvgGlyphEdit,
  SvgGlyphHide,
  SvgGlyphMore,
  SvgGlyphPlay,
  SvgGlyphTrash,
  SvgLargeEdit,
  SvgLargeUploadFailed,
  SvgOutlineVideo,
} from '@/shared/icons'
import { transitions } from '@/shared/theme'
import { UploadStatus } from '@/types/uploads'
import { formatDateAgo, formatDurationShort } from '@/utils/time'
import { formatVideoViewsAndDate } from '@/utils/video'

import { PullUp } from './PullUp'
import {
  Anchor,
  AvatarContainer,
  ChannelHandle,
  Container,
  CoverContainer,
  CoverDurationOverlay,
  CoverHoverOverlay,
  CoverIconWrapper,
  CoverImage,
  CoverImageContainer,
  CoverNoImage,
  CoverSkeletonLoader,
  CoverThumbnailUploadFailed,
  CoverTopLeftContainer,
  CoverVideoPublishingStateOverlay,
  CoverWrapper,
  DELAYED_FADE_CLASSNAME,
  InfoContainer,
  KebabMenuButtonIcon,
  MetaContainer,
  ProgressBar,
  ProgressOverlay,
  PublishingStateText,
  RemoveButton,
  SkeletonHoverOverlay,
  SpacedSkeletonLoader,
  StyledAvatar,
  TextContainer,
  TitleHeader,
  TitleHeaderAnchor,
  UploadProgressTransition,
} from './VideoTileBase.styles'

import { ContextMenu, ContextMenuItem } from '../ContextMenu'
import { SkeletonLoader } from '../SkeletonLoader'
import { Text } from '../Text'
import { UploadProgressBar } from '../UploadProgressBar'

export type VideoTileBaseMetaProps = {
  showChannel?: boolean
  showMeta?: boolean
  removeButton?: boolean
  onClick?: (event: React.MouseEvent<HTMLElement>) => void
  onChannelClick?: (e: React.MouseEvent<HTMLElement>) => void
  onRemoveButtonClick?: (e: React.MouseEvent<HTMLElement>) => void
}

export type VideoTilePublisherProps =
  | {
      publisherMode: true
      isPullupDisabled?: boolean
      isDraft?: boolean
      videoPublishState?: 'default' | 'unlisted'
      uploadStatus?: UploadStatus
      onPullupClick?: (e: React.MouseEvent<HTMLElement>) => void
      onOpenInTabClick?: () => void
      onEditVideoClick?: () => void
      onCopyVideoURLClick?: () => void
      onDeleteVideoClick?: () => void
    }
  | {
      publisherMode?: false
      isPullupDisabled?: undefined
      isDraft?: undefined
      videoPublishState?: undefined
      uploadStatus?: undefined
      onPullupClick?: undefined
      onOpenInTabClick?: undefined
      onEditVideoClick?: undefined
      onCopyVideoURLClick?: () => void
      onDeleteVideoClick?: undefined
    }

export type VideoTileBaseProps = {
  title?: string | null
  channelTitle?: string | null
  channelAvatarUrl?: string | null
  createdAt?: Date
  duration?: number | null
  // video watch progress in percent (0-100)
  progress?: number
  views?: number | null
  thumbnailUrl?: string | null
  hasThumbnailUploadFailed?: boolean
  isLoadingThumbnail?: boolean
  isLoadingAvatar?: boolean
  isLoading?: boolean
  videoHref?: string
  channelHref?: string
  className?: string
} & VideoTileBaseMetaProps &
  VideoTilePublisherProps

type TileSize = 'small' | 'big' | undefined

export const MIN_VIDEO_TILE_WIDTH = 250
const SMALL_SIZE_WIDTH = 300

export const VideoTileBase: React.FC<VideoTileBaseProps> = ({
  title,
  channelTitle,
  channelAvatarUrl,
  createdAt,
  duration,
  progress = 0,
  views,
  thumbnailUrl,
  hasThumbnailUploadFailed,
  channelHref,
  videoHref,
  isLoadingThumbnail,
  isLoadingAvatar,
  isLoading = true,
  showChannel = true,
  showMeta = true,
  removeButton = false,
  videoPublishState = 'default',
  uploadStatus,
  publisherMode = false,
  isDraft,
  onChannelClick,
  onPullupClick,
  onClick,
  onRemoveButtonClick,
  className,
  onOpenInTabClick,
  onEditVideoClick,
  onCopyVideoURLClick,
  onDeleteVideoClick,
  isPullupDisabled,
}) => {
  const { openContextMenu, isVisible, targetRef } = useContextMenu()
  const [tileSize, setTileSize] = useState<TileSize>(undefined)

  const { ref: imgRef } = useResizeObserver<HTMLImageElement>({
    onResize: (size) => {
      const { width: videoTileWidth } = size
      if (videoTileWidth) {
        if (tileSize !== 'small' && videoTileWidth < SMALL_SIZE_WIDTH) {
          setTileSize('small')
        }
        if (tileSize !== 'big' && videoTileWidth >= SMALL_SIZE_WIDTH) {
          setTileSize('big')
        }
      }
    },
  })
  const isUploading = uploadStatus && uploadStatus.lastStatus !== 'completed'
  const [failedLoadImage, setFailedLoadImage] = useState(false)
  const clickable = (!!onClick || !!videoHref) && !isLoading && !isUploading
  const channelClickable = (!!onChannelClick || !!channelHref) && !isLoading

  const handleChannelClick = (event: React.MouseEvent<HTMLElement>) => {
    if (!onChannelClick) {
      return
    }
    onChannelClick(event)
  }

  const createAnchorClickHandler = (href?: string) => (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    if (!href) {
      event.preventDefault()
      onClick?.(event)
    }
  }
  const handleRemoveClick = (event: React.MouseEvent<HTMLElement>) => {
    if (onRemoveButtonClick) {
      event.preventDefault()
      onRemoveButtonClick(event)
    }
  }
  const handleFailedThumbnailLoad = () => {
    if (!failedLoadImage) {
      setFailedLoadImage(true)
    }
  }

  return (
    <Container className={className} isLoading={isLoading || isUploading}>
      <CoverWrapper>
        <CoverContainer ref={imgRef} clickable={clickable}>
          <SwitchTransition>
            <CSSTransition
              key={isLoadingThumbnail ? 'cover-placeholder' : 'cover'}
              timeout={parseInt(transitions.timings.sharp)}
              classNames={transitions.names.fade}
            >
              <CoverImageContainer>
                <Anchor to={videoHref ?? ''} onClick={createAnchorClickHandler(videoHref)}>
                  {isLoadingThumbnail && !isDraft ? (
                    <>
                      {(videoHref || publisherMode) && (
                        <SkeletonHoverOverlay>
                          <CoverIconWrapper>
                            {publisherMode ? (
                              <SvgLargeEdit />
                            ) : (
                              <SvgOutlineVideo width={34} height={34} viewBox="0 0 34 34" />
                            )}
                          </CoverIconWrapper>
                        </SkeletonHoverOverlay>
                      )}
                      <CoverSkeletonLoader />
                    </>
                  ) : (
                    <>
                      {thumbnailUrl && !failedLoadImage ? (
                        <CoverImage
                          darkenImg={videoPublishState === 'unlisted' || !!isDraft}
                          src={thumbnailUrl}
                          onError={handleFailedThumbnailLoad}
                          alt={`${title} by ${channelTitle} thumbnail`}
                        />
                      ) : hasThumbnailUploadFailed ? (
                        <CoverThumbnailUploadFailed>
                          <SvgLargeUploadFailed />
                          <Text variant="subtitle2" secondary>
                            Thumbnail upload failed
                          </Text>
                        </CoverThumbnailUploadFailed>
                      ) : (
                        <CoverNoImage />
                      )}
                      {(videoPublishState === 'unlisted' || isDraft) && !isUploading && (
                        <CoverVideoPublishingStateOverlay>
                          {isDraft ? <SvgGlyphDraft /> : <SvgGlyphHide />}
                          <PublishingStateText>{isDraft ? 'Draft' : 'Unlisted'}</PublishingStateText>
                        </CoverVideoPublishingStateOverlay>
                      )}
                      {!!duration && <CoverDurationOverlay>{formatDurationShort(duration)}</CoverDurationOverlay>}
                      <CoverHoverOverlay>
                        {publisherMode && (
                          <CoverTopLeftContainer>
                            <PullUp
                              // set to true when video is already on the snackbar
                              disabled={!!isPullupDisabled}
                              onClick={(event) => {
                                event.preventDefault()
                                onPullupClick && onPullupClick(event)
                              }}
                            />
                          </CoverTopLeftContainer>
                        )}
                        <CoverIconWrapper>
                          {publisherMode ? (
                            <SvgLargeEdit />
                          ) : (
                            <SvgOutlineVideo width={34} height={34} viewBox="0 0 34 34" />
                          )}
                        </CoverIconWrapper>
                        {removeButton && (
                          <RemoveButton onClick={handleRemoveClick}>
                            <SvgGlyphClose />
                          </RemoveButton>
                        )}
                      </CoverHoverOverlay>
                    </>
                  )}
                </Anchor>
              </CoverImageContainer>
            </CSSTransition>
          </SwitchTransition>
          <CSSTransition in={isUploading} timeout={1000} classNames={DELAYED_FADE_CLASSNAME} unmountOnExit mountOnEnter>
            <UploadProgressTransition>
              <UploadProgressBar
                progress={uploadStatus?.progress}
                lastStatus={uploadStatus?.lastStatus}
                withLoadingIndicator
              />
            </UploadProgressTransition>
          </CSSTransition>
        </CoverContainer>
      </CoverWrapper>
      {!!progress && (
        <ProgressOverlay>
          <ProgressBar style={{ width: `${progress}%` }} />
        </ProgressOverlay>
      )}
      <InfoContainer>
        {showChannel && (
          <AvatarContainer>
            <Anchor to={channelHref ?? ''} onClick={createAnchorClickHandler(channelHref)}>
              <StyledAvatar
                loading={isLoading || isLoadingAvatar}
                assetUrl={channelAvatarUrl}
                channelClickable={channelClickable}
                onClick={handleChannelClick}
              />
            </Anchor>
          </AvatarContainer>
        )}
        <SwitchTransition>
          <CSSTransition
            key={isLoading ? 'text-placeholder' : 'text'}
            timeout={200}
            classNames={transitions.names.fade}
          >
            <TextContainer>
              {isLoading ? (
                <SkeletonLoader height={18} width="60%" />
              ) : (
                <TitleHeaderAnchor to={videoHref ?? ''} onClick={createAnchorClickHandler(videoHref)}>
                  <TitleHeader variant="h6" size={tileSize} onClick={onClick} clickable={clickable}>
                    {title || 'Untitled'}
                  </TitleHeader>
                </TitleHeaderAnchor>
              )}
              {showChannel &&
                (isLoading ? (
                  <SpacedSkeletonLoader height="12px" width="60%" />
                ) : (
                  <Anchor to={channelHref ?? ''} onClick={createAnchorClickHandler(channelHref)}>
                    <ChannelHandle
                      variant="body2"
                      channelClickable={channelClickable}
                      onClick={handleChannelClick}
                      secondary
                    >
                      {channelTitle}
                    </ChannelHandle>
                  </Anchor>
                ))}
              <MetaContainer noMarginTop={!showChannel}>
                {showMeta &&
                  (isUploading ? (
                    isLoading ? (
                      <SpacedSkeletonLoader height={12} width="80%" />
                    ) : (
                      <Text variant="body2" secondary>
                        {uploadStatus.lastStatus === 'inProgress' && 'Uploading...'}
                        {uploadStatus.lastStatus === 'processing' && 'Processing...'}
                      </Text>
                    )
                  ) : isLoading ? (
                    <SpacedSkeletonLoader height={12} width="80%" />
                  ) : createdAt ? (
                    <Text variant="body2" secondary>
                      {isDraft
                        ? `Last updated ${formatDateAgo(createdAt)}`
                        : formatVideoViewsAndDate(views ?? null, createdAt)}
                    </Text>
                  ) : null)}
              </MetaContainer>
            </TextContainer>
          </CSSTransition>
        </SwitchTransition>
        <KebabMenuButtonIcon
          ref={targetRef}
          onClick={openContextMenu}
          variant="tertiary"
          size="small"
          isActive={isUploading ? false : isVisible}
        >
          <SvgGlyphMore />
        </KebabMenuButtonIcon>
        <ContextMenu isVisible={isVisible} targetRef={targetRef} placement={'bottom-end'}>
          {publisherMode ? (
            <>
              {onOpenInTabClick && (
                <ContextMenuItem icon={<SvgGlyphPlay />} onClick={onOpenInTabClick}>
                  Play in Joystream
                </ContextMenuItem>
              )}
              {onCopyVideoURLClick && (
                <ContextMenuItem icon={<SvgGlyphCopy />} onClick={onCopyVideoURLClick}>
                  Copy video URL
                </ContextMenuItem>
              )}
              {onEditVideoClick && (
                <ContextMenuItem icon={<SvgGlyphEdit />} onClick={onEditVideoClick}>
                  {isDraft ? 'Edit draft' : 'Edit video'}
                </ContextMenuItem>
              )}
              {onDeleteVideoClick && (
                <ContextMenuItem icon={<SvgGlyphTrash />} onClick={onDeleteVideoClick}>
                  {isDraft ? 'Delete draft' : 'Delete video'}
                </ContextMenuItem>
              )}
            </>
          ) : (
            onCopyVideoURLClick && (
              <ContextMenuItem onClick={onCopyVideoURLClick} icon={<SvgGlyphCopy />}>
                Copy video URL
              </ContextMenuItem>
            )
          )}
        </ContextMenu>
      </InfoContainer>
    </Container>
  )
}
