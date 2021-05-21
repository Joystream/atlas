import React, { useState } from 'react'
import {
  AvatarContainer,
  Container,
  CoverContainer,
  InfoContainer,
  MetaContainer,
  TextContainer,
  CoverWrapper,
  ChannelHandle,
  CoverDurationOverlay,
  CoverHoverOverlay,
  CoverImage,
  CoverRemoveButton,
  CoverPlayIcon,
  MetaText,
  ProgressBar,
  ProgressOverlay,
  StyledAvatar,
  TitleHeader,
  Anchor,
  CoverPlaceholder,
  SpacedPlaceholder,
  CoverImageContainer,
} from './VideoPreviewBase.styles'
import { formatVideoViewsAndDate } from '@/utils/video'
import { formatDurationShort } from '@/utils/time'
import useResizeObserver from 'use-resize-observer'
import { transitions } from '@/shared/theme'
import { SwitchTransition, CSSTransition } from 'react-transition-group'
import { Placeholder } from '..'

export type VideoPreviewBaseMetaProps = {
  showChannel?: boolean
  showMeta?: boolean
  main?: boolean
  removeButton?: boolean
  onClick?: (e: React.MouseEvent<HTMLElement>) => void
  onChannelClick?: (e: React.MouseEvent<HTMLElement>) => void
  onCoverResize?: (width: number | undefined, height: number | undefined) => void
  onRemoveButtonClick?: () => void
}
export type VideoPreviewBaseProps = {
  title?: string
  channelHandle?: string
  channelAvatarUrl?: string | null
  createdAt?: Date
  duration?: number
  // video watch progress in percent (0-100)
  progress?: number
  views?: number | null
  thumbnailUrl?: string
  isLoading?: boolean
  videoHref?: string
  channelHref?: string
  className?: string
} & VideoPreviewBaseMetaProps

export const MIN_VIDEO_PREVIEW_WIDTH = 300
const MAX_VIDEO_PREVIEW_WIDTH = 600
const MIN_SCALING_FACTOR = 1
const MAX_SCALING_FACTOR = 1.375
// Linear Interpolation, see https://en.wikipedia.org/wiki/Linear_interpolation
const calculateScalingFactor = (videoPreviewWidth: number) =>
  MIN_SCALING_FACTOR +
  ((videoPreviewWidth - MIN_VIDEO_PREVIEW_WIDTH) * (MAX_SCALING_FACTOR - MIN_SCALING_FACTOR)) /
    (MAX_VIDEO_PREVIEW_WIDTH - MIN_VIDEO_PREVIEW_WIDTH)

const VideoPreviewBase: React.FC<VideoPreviewBaseProps> = ({
  title,
  channelHandle,
  channelAvatarUrl,
  createdAt,
  duration,
  progress = 0,
  removeButton,
  onRemoveButtonClick,
  views,
  thumbnailUrl,
  onCoverResize,
  channelHref,
  videoHref,
  isLoading = true,
  showChannel = true,
  showMeta = true,
  main = false,
  onChannelClick,
  onClick,
  className,
}) => {
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

  const displayChannel = showChannel && !main
  const clickable = (!!onClick || !!videoHref) && !isLoading
  const channelClickable = (!!onChannelClick || !!channelHref) && !isLoading
  const handleChannelClick = (e: React.MouseEvent<HTMLElement>) => {
    if (!onChannelClick) {
      return
    }
    e.stopPropagation()
    onChannelClick(e)
  }

  const createAnchorClickHandler = (href?: string) => (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    if (!href) {
      e.preventDefault()
    }
  }
  const createRemoveClickHandler = () => (e: React.MouseEvent<HTMLElement>) => {
    if (onRemoveButtonClick) {
      e.stopPropagation()
      onRemoveButtonClick()
    }
  }
  return (
    <Container main={main} className={className}>
      <CoverWrapper main={main} onClick={onClick}>
        <Anchor to={videoHref ?? ''} onClick={createAnchorClickHandler(videoHref)}>
          <CoverContainer clickable={clickable}>
            <SwitchTransition>
              <CSSTransition
                key={isLoading ? 'placeholder' : 'content'}
                timeout={parseInt(transitions.timings.regular)}
                classNames={transitions.names.fade}
              >
                {isLoading ? (
                  <CoverPlaceholder />
                ) : (
                  <CoverImageContainer>
                    <CoverImage src={thumbnailUrl} ref={imgRef} alt={`${title} by ${channelHandle} thumbnail`} />
                    {!!duration && <CoverDurationOverlay>{formatDurationShort(duration)}</CoverDurationOverlay>}
                    {!!progress && (
                      <ProgressOverlay>
                        <ProgressBar style={{ width: `${progress}%` }} />
                      </ProgressOverlay>
                    )}
                    <CoverHoverOverlay>
                      {removeButton && <CoverRemoveButton onClick={createRemoveClickHandler()} />}
                      <CoverPlayIcon />
                    </CoverHoverOverlay>
                  </CoverImageContainer>
                )}
              </CSSTransition>
            </SwitchTransition>
          </CoverContainer>
        </Anchor>
      </CoverWrapper>
      <SwitchTransition>
        <CSSTransition
          key={isLoading ? 'placeholder' : 'content'}
          timeout={parseInt(transitions.timings.regular)}
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
                      imageUrl={channelAvatarUrl}
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
                <Anchor to={videoHref ?? ''} onClick={createAnchorClickHandler(videoHref)}>
                  <TitleHeader
                    variant="h6"
                    main={main}
                    scalingFactor={scalingFactor}
                    onClick={onClick}
                    clickable={clickable}
                  >
                    {title}
                  </TitleHeader>
                </Anchor>
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
                    >
                      {channelHandle}
                    </ChannelHandle>
                  </Anchor>
                ))}
              {showMeta && (
                <MetaContainer main={main}>
                  {isLoading ? (
                    <SpacedPlaceholder height={main ? 16 : 12} width={main ? '40%' : '80%'} />
                  ) : createdAt ? (
                    <MetaText variant="subtitle2" main={main} scalingFactor={scalingFactor}>
                      {formatVideoViewsAndDate(views ?? null, createdAt, { fullViews: main })}
                    </MetaText>
                  ) : null}
                </MetaContainer>
              )}
            </TextContainer>
          </InfoContainer>
        </CSSTransition>
      </SwitchTransition>
    </Container>
  )
}

export default VideoPreviewBase
