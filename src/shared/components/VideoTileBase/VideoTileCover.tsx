import React from 'react'
import { CSSTransition, SwitchTransition } from 'react-transition-group'
import useResizeObserver from 'use-resize-observer'

import {
  SvgGlyphClose,
  SvgGlyphDraft,
  SvgGlyphHide,
  SvgIllustrativeEdit,
  SvgIllustrativePlay,
  SvgIllustrativeReupload,
  SvgLargeUploadFailed,
} from '@/shared/icons'
import { transitions } from '@/shared/theme'
import { RoutingState } from '@/types/routing'
import { UploadStatus } from '@/types/uploads'
import { getLinkPropsFromTo } from '@/utils/button'
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
  CoverTopRigthContainer,
  CoverVideoPublishingStateOverlay,
  CoverWrapper,
  DELAYED_FADE_CLASSNAME,
  PublishingStateText,
  RemoveButton,
  SkeletonHoverOverlay,
  UploadProgressTransition,
} from './VideoTileCover.style'

import { Text } from '../Text'
import { UploadProgressBar } from '../UploadProgressBar'

type TileSize = 'small' | 'big' | undefined

type VideoTileCoverProps = {
  hasAssetUploadFailed?: boolean
  videoHref?: string | { pathname: string; state: RoutingState }
  openInNewBrowserTab?: boolean
  setTileSize: React.Dispatch<React.SetStateAction<TileSize>>
  tileSize: TileSize
  isLoading?: boolean
  uploadStatus?: UploadStatus
  isDraft?: boolean
  isUnlisted?: boolean
  publisherMode?: boolean
  removeButton?: boolean
  duration?: number | null
  thumbnailUrl?: string | null
  thumbnailAlt?: string
  isLoadingThumbnail?: boolean
  onRemoveButtonClick?: (e: React.MouseEvent<HTMLElement>) => void
  onPullupClick?: (e: React.MouseEvent<HTMLElement>) => void
  onClick?: (event: React.MouseEvent<HTMLElement>) => void
}

export const MIN_VIDEO_TILE_WIDTH = 250
const SMALL_SIZE_WIDTH = 300

export const VideoTileCover: React.FC<VideoTileCoverProps> = ({
  hasAssetUploadFailed,
  videoHref,
  openInNewBrowserTab,
  setTileSize,
  tileSize,
  onRemoveButtonClick,
  onClick,
  isLoading,
  uploadStatus,
  thumbnailUrl,
  isLoadingThumbnail,
  isDraft,
  isUnlisted,
  publisherMode,
  duration,
  onPullupClick,
  removeButton,
  thumbnailAlt,
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

  const href = typeof videoHref === 'string' ? videoHref : videoHref?.pathname

  return (
    <CoverWrapper>
      <Anchor
        to={videoHref ?? ''}
        onClick={createAnchorClickHandler(href)}
        state={typeof videoHref !== 'string' ? videoHref?.state : undefined}
        {...getLinkPropsFromTo(videoHref, openInNewBrowserTab)}
      >
        <CoverContainer ref={imgRef} clickable={clickable}>
          <SwitchTransition>
            <CSSTransition
              key={isLoading ? 'cover-placeholder' : 'cover'}
              timeout={parseInt(transitions.timings.sharp)}
              classNames={transitions.names.fade}
            >
              <CoverImageContainer>
                {isLoadingThumbnail && !isDraft ? (
                  <>
                    {(videoHref || publisherMode) && !isLoading && (
                      <SkeletonHoverOverlay>
                        <CoverIconWrapper>
                          {isDraft ? <SvgIllustrativeEdit /> : <SvgIllustrativePlay />}
                        </CoverIconWrapper>
                      </SkeletonHoverOverlay>
                    )}
                    <CoverSkeletonLoader />
                  </>
                ) : (
                  <>
                    {thumbnailUrl && !hasAssetUploadFailed ? (
                      <CoverImage darkenImg={isUnlisted || !!isDraft} src={thumbnailUrl} alt={thumbnailAlt} />
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
                    {(isUnlisted || isDraft) && !isUploading && (
                      <CoverVideoPublishingStateOverlay>
                        {isDraft ? <SvgGlyphDraft /> : <SvgGlyphHide />}
                        <PublishingStateText>{isDraft ? 'Draft' : 'Unlisted'}</PublishingStateText>
                      </CoverVideoPublishingStateOverlay>
                    )}
                    {!!duration && <CoverDurationOverlay>{formatDurationShort(duration)}</CoverDurationOverlay>}
                    <CoverHoverOverlay darker={hasAssetUploadFailed}>
                      {publisherMode && !hasAssetUploadFailed && onPullupClick && (
                        <CoverTopRigthContainer>
                          <PullUp tooltipText="Edit" onClick={onPullupClick} />
                        </CoverTopRigthContainer>
                      )}
                      <CoverIconWrapper>
                        {publisherMode && hasAssetUploadFailed ? (
                          <SvgIllustrativeReupload />
                        ) : isDraft ? (
                          <SvgIllustrativeEdit />
                        ) : (
                          <SvgIllustrativePlay />
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
