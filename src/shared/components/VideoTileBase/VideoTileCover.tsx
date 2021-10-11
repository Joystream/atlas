import React from 'react'
import { CSSTransition, SwitchTransition } from 'react-transition-group'
import useResizeObserver from 'use-resize-observer'

import {
  SvgGlyphClose,
  SvgGlyphDraft,
  SvgGlyphHide,
  SvgIllustrativeReupload,
  SvgLargeEdit,
  SvgLargeUploadFailed,
  SvgOutlineVideo,
} from '@/shared/icons'
import { transitions } from '@/shared/theme'
import { formatDurationShort } from '@/utils/time'

import { PullUp } from './PullUp'
import { Anchor } from './VideoTileBase.styles'
import {
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
  PublishingStateText,
  RemoveButton,
  SkeletonHoverOverlay,
  UploadProgressTransition,
} from './VideoTileCover.style'

import { VideoTileBaseMetaProps, VideoTilePublisherProps } from '.'
import { Text } from '../Text'
import { UploadProgressBar } from '../UploadProgressBar'

type TileSize = 'small' | 'big' | undefined

type VideoTileCoverProps = {
  hasAssetUploadFailed?: boolean
  videoHref?: string
  setTileSize: React.Dispatch<React.SetStateAction<TileSize>>
  tileSize: TileSize
  duration?: number | null
  thumbnailUrl?: string | null
  isLoadingThumbnail?: boolean
  isLoading?: boolean
  title?: string | null
  channelTitle?: string | null
} & VideoTileBaseMetaProps &
  VideoTilePublisherProps

export const MIN_VIDEO_TILE_WIDTH = 250
const SMALL_SIZE_WIDTH = 300

export const VideoTileCover: React.FC<VideoTileCoverProps> = ({
  hasAssetUploadFailed,
  videoHref,
  setTileSize,
  tileSize,
  onRemoveButtonClick,
  onClick,
  isLoading,
  uploadStatus,
  thumbnailUrl,
  isLoadingThumbnail,
  isDraft,
  publisherMode,
  videoPublishState,
  duration,
  isPullupDisabled,
  onPullupClick,
  removeButton,
  title,
  channelTitle,
}) => {
  const isUploading = uploadStatus && uploadStatus.lastStatus !== 'completed'
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

  const handleRemoveClick = (event: React.MouseEvent<HTMLElement>) => {
    if (onRemoveButtonClick) {
      event.preventDefault()
      onRemoveButtonClick(event)
    }
  }

  const createAnchorClickHandler = (href?: string) => (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    if (!href) {
      event.preventDefault()
      onClick?.(event)
    }
  }

  const clickable = (!!onClick || !!videoHref) && !isLoading && !isUploading
  return (
    <CoverWrapper>
      <Anchor to={videoHref ?? ''} onClick={createAnchorClickHandler(videoHref)}>
        <CoverContainer ref={imgRef} clickable={clickable}>
          <SwitchTransition>
            <CSSTransition
              key={isLoadingThumbnail ? 'cover-placeholder' : 'cover'}
              timeout={parseInt(transitions.timings.sharp)}
              classNames={transitions.names.fade}
            >
              <CoverImageContainer>
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
                    {thumbnailUrl && !hasAssetUploadFailed ? (
                      <CoverImage
                        darkenImg={videoPublishState === 'unlisted' || !!isDraft}
                        src={thumbnailUrl}
                        alt={`${title} by ${channelTitle} thumbnail`}
                      />
                    ) : hasAssetUploadFailed ? (
                      <CoverThumbnailUploadFailed>
                        <SvgLargeUploadFailed />
                        <Text variant="caption" secondary>
                          Asset upload failed
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
                    <CoverHoverOverlay darker={hasAssetUploadFailed}>
                      {publisherMode && !hasAssetUploadFailed && (
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
                          hasAssetUploadFailed ? (
                            <SvgIllustrativeReupload />
                          ) : (
                            <SvgLargeEdit />
                          )
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
      </Anchor>
    </CoverWrapper>
  )
}
