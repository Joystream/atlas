import React, { useState } from 'react'
import { CSSTransition, SwitchTransition } from 'react-transition-group'
import useResizeObserver from 'use-resize-observer'

import { useContextMenu } from '@/hooks'
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
  CoverPlaceholder,
  CoverThumbnailUploadFailed,
  CoverTopLeftContainer,
  CoverVideoPublishingStateOverlay,
  CoverWrapper,
  InfoContainer,
  KebabMenuIconContainer,
  MetaContainer,
  MetaText,
  ProgressBar,
  ProgressOverlay,
  PublishingStateText,
  RemoveButton,
  SpacedPlaceholder,
  StyledAvatar,
  TextContainer,
  TitleHeader,
  TitleHeaderAnchor,
} from './VideoPreviewBase.styles'
import { MAX_SCALING_FACTOR, MAX_VIDEO_PREVIEW_WIDTH, MIN_SCALING_FACTOR, MIN_VIDEO_PREVIEW_WIDTH } from './constants'

import { ContextMenu, ContextMenuItem } from '../ContextMenu'
import { Placeholder } from '../Placeholder'
import { Text } from '../Text'

export type VideoPreviewBaseMetaProps = {
  showChannel?: boolean
  showMeta?: boolean
  main?: boolean
  removeButton?: boolean
  onClick?: (event: React.MouseEvent<HTMLElement>) => void
  onChannelClick?: (e: React.MouseEvent<HTMLElement>) => void
  onCoverResize?: (width: number | undefined, height: number | undefined) => void
  onRemoveButtonClick?: (e: React.MouseEvent<HTMLElement>) => void
}

export type VideoPreviewPublisherProps =
  | {
      publisherMode: true
      isPullupDisabled?: boolean
      isDraft?: boolean
      videoPublishState?: 'default' | 'unlisted'
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
      onPullupClick?: undefined
      onOpenInTabClick?: undefined
      onEditVideoClick?: undefined
      onCopyVideoURLClick?: () => void
      onDeleteVideoClick?: undefined
    }

export type VideoPreviewBaseProps = {
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
  isLoading?: boolean
  videoHref?: string
  channelHref?: string
  contentKey?: string
  className?: string
} & VideoPreviewBaseMetaProps &
  VideoPreviewPublisherProps

// Linear Interpolation, see https://en.wikipedia.org/wiki/Linear_interpolation
const calculateScalingFactor = (videoPreviewWidth: number) =>
  MIN_SCALING_FACTOR +
  ((videoPreviewWidth - MIN_VIDEO_PREVIEW_WIDTH) * (MAX_SCALING_FACTOR - MIN_SCALING_FACTOR)) /
    (MAX_VIDEO_PREVIEW_WIDTH - MIN_VIDEO_PREVIEW_WIDTH)

export const VideoPreviewBase: React.FC<VideoPreviewBaseProps> = ({
  title,
  channelTitle,
  channelAvatarUrl,
  createdAt,
  duration,
  progress = 0,
  views,
  thumbnailUrl,
  hasThumbnailUploadFailed,
  onCoverResize,
  channelHref,
  videoHref,
  isLoading = true,
  showChannel = true,
  showMeta = true,
  main = false,
  removeButton = false,
  videoPublishState = 'default',
  publisherMode = false,
  isDraft,
  onChannelClick,
  onPullupClick,
  onClick,
  onRemoveButtonClick,
  contentKey,
  className,
  onOpenInTabClick,
  onEditVideoClick,
  onCopyVideoURLClick,
  onDeleteVideoClick,
  isPullupDisabled,
}) => {
  const { openContextMenu, contextMenuOpts } = useContextMenu()
  const [scalingFactor, setScalingFactor] = useState(MIN_SCALING_FACTOR)
  const { ref: imgRef } = useResizeObserver<HTMLImageElement>({
    onResize: (size) => {
      const { width: videoPreviewWidth, height: videoPreviewHeight } = size
      if (onCoverResize) {
        onCoverResize(videoPreviewWidth, videoPreviewHeight)
      }
      if (videoPreviewWidth && !main) {
        setScalingFactor(calculateScalingFactor(videoPreviewWidth))
      }
    },
  })
  const [failedLoadImage, setFailedLoadImage] = useState(false)
  const displayChannel = showChannel && !main
  const clickable = (!!onClick || !!videoHref) && !isLoading
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
    }
  }
  const handleCoverHoverOverlayClick = (event: React.MouseEvent<HTMLElement>) => {
    onClick?.(event)
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
    <Container main={main} className={className}>
      <CoverWrapper main={main}>
        <CoverContainer clickable={clickable}>
          <SwitchTransition>
            <CSSTransition
              key={isLoading ? 'placeholder' : `content-${contentKey}`}
              timeout={parseInt(transitions.timings.sharp)}
              classNames={transitions.names.fade}
            >
              {isLoading ? (
                <CoverPlaceholder />
              ) : (
                <CoverImageContainer ref={imgRef}>
                  <Anchor to={videoHref ?? ''} onClick={createAnchorClickHandler(videoHref)}>
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
                    {(videoPublishState === 'unlisted' || isDraft) && (
                      <CoverVideoPublishingStateOverlay>
                        {isDraft ? <SvgGlyphDraft /> : <SvgGlyphHide />}
                        <PublishingStateText>{isDraft ? 'Draft' : 'Unlisted'}</PublishingStateText>
                      </CoverVideoPublishingStateOverlay>
                    )}
                    {!!duration && <CoverDurationOverlay>{formatDurationShort(duration)}</CoverDurationOverlay>}
                    <CoverHoverOverlay onClick={handleCoverHoverOverlayClick}>
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
                  </Anchor>
                </CoverImageContainer>
              )}
            </CSSTransition>
          </SwitchTransition>
        </CoverContainer>
      </CoverWrapper>
      {!!progress && (
        <ProgressOverlay>
          <ProgressBar style={{ width: `${progress}%` }} />
        </ProgressOverlay>
      )}
      <SwitchTransition>
        <CSSTransition
          key={isLoading ? 'placeholder' : `content-${contentKey}`}
          timeout={parseInt(transitions.timings.sharp)}
          classNames={transitions.names.fade}
        >
          <InfoContainer main={main}>
            {displayChannel && (
              <AvatarContainer scalingFactor={scalingFactor}>
                {isLoading ? (
                  <Placeholder rounded />
                ) : (
                  <Anchor to={channelHref ?? ''} onClick={createAnchorClickHandler(channelHref)}>
                    <StyledAvatar
                      assetUrl={channelAvatarUrl}
                      channelClickable={channelClickable}
                      onClick={handleChannelClick}
                    />
                  </Anchor>
                )}
              </AvatarContainer>
            )}
            <TextContainer>
              {isLoading ? (
                <Placeholder height={main ? 45 : 18} width="60%" />
              ) : (
                <TitleHeaderAnchor to={videoHref ?? ''} onClick={createAnchorClickHandler(videoHref)}>
                  <TitleHeader
                    variant="h6"
                    main={main}
                    scalingFactor={scalingFactor}
                    onClick={onClick}
                    clickable={clickable}
                  >
                    {title || 'Untitled'}
                  </TitleHeader>
                </TitleHeaderAnchor>
              )}
              {displayChannel &&
                (isLoading ? (
                  <SpacedPlaceholder height="12px" width="60%" />
                ) : (
                  <Anchor to={channelHref ?? ''} onClick={createAnchorClickHandler(channelHref)}>
                    <ChannelHandle
                      variant="subtitle2"
                      channelClickable={channelClickable}
                      onClick={handleChannelClick}
                      scalingFactor={scalingFactor}
                      secondary
                    >
                      {channelTitle}
                    </ChannelHandle>
                  </Anchor>
                ))}
              {showMeta && (
                <MetaContainer noMarginTop={!showChannel} main={main}>
                  {isLoading ? (
                    <SpacedPlaceholder height={main ? 16 : 12} width={main ? '40%' : '80%'} />
                  ) : createdAt ? (
                    <MetaText variant="subtitle2" main={main} scalingFactor={scalingFactor} secondary>
                      {isDraft
                        ? `Last updated ${formatDateAgo(createdAt)}`
                        : formatVideoViewsAndDate(views ?? null, createdAt, { fullViews: main })}
                    </MetaText>
                  ) : null}
                </MetaContainer>
              )}
            </TextContainer>
            {!isLoading && (
              <>
                <KebabMenuIconContainer
                  onClick={(event) => openContextMenu(event, 200)}
                  isActive={contextMenuOpts.isActive}
                >
                  <SvgGlyphMore />
                </KebabMenuIconContainer>
                <ContextMenu contextMenuOpts={contextMenuOpts}>
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
              </>
            )}
          </InfoContainer>
        </CSSTransition>
      </SwitchTransition>
    </Container>
  )
}
