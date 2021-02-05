import React, { useState } from 'react'
import {
  AvatarContainer,
  Container,
  CoverContainer,
  InfoContainer,
  MetaContainer,
  TextContainer,
  CoverWrapper,
} from './VideoPreviewBase.styles'
import styled from '@emotion/styled'
import Placeholder from '../Placeholder'
import { formatVideoViewsAndDate } from '@/utils/video'
import { formatDurationShort } from '@/utils/time'
import useResizeObserver from 'use-resize-observer'

type VideoPreviewBaseProps = {
  showChannel?: boolean
  showMeta?: boolean
  main?: boolean
  onClick?: (e: React.MouseEvent<HTMLElement>) => void
  className?: string
  scalingFactor?: number
}

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
  showChannel = true,

  showMeta = true,
  main = false,

  onClick,
  className,
  scalingFactor = 1,
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

  const channelClickable = !!onChannelClick

  const handleChannelClick = (e: React.MouseEvent<HTMLElement>) => {
    if (!onChannelClick) {
      return
    }
    e.stopPropagation()
    onChannelClick(e)
  }

  const clickable = !!onClick

  const displayChannel = showChannel && !main

  const coverPlaceholder = <CoverPlaceholder />
  const channelAvatarPlaceholder = <Placeholder rounded />
  const titlePlaceholder = <Placeholder height={main ? 45 : 18} width="60%" />
  const channelNamePlaceholder = <SpacedPlaceholder height="12px" width="60%" />
  const metaPlaceholder = <SpacedPlaceholder height={main ? 16 : 12} width={main ? '40%' : '80%'} />

  const coverNode = (
    <>
      <CoverImage src={posterURL} ref={imgRef} alt={`${title} by ${channelName} thumbnail`} />
      {!!duration && <CoverDurationOverlay>{formatDurationShort(duration)}</CoverDurationOverlay>}
      {!!progress && (
        <ProgressOverlay>
          <ProgressBar style={{ width: `${progress}%` }} />
        </ProgressOverlay>
      )}
      <CoverHoverOverlay>
        <CoverPlayIcon />
      </CoverHoverOverlay>
    </>
  )

  const titleNode = (
    <TitleHeader variant="h6" main={main} scalingFactor={scalingFactor} onClick={onClick} clickable={Boolean(onClick)}>
      {title}
    </TitleHeader>
  )

  const channelAvatarNode = (
    <StyledAvatar
      handle={channelName}
      imageUrl={channelAvatarURL}
      channelClickable={channelClickable}
      onClick={handleChannelClick}
    />
  )

  const channelNameNode = (
    <ChannelName
      variant="subtitle2"
      channelClickable={channelClickable}
      onClick={handleChannelClick}
      scalingFactor={scalingFactor}
    >
      {channelName}
    </ChannelName>
  )

  const metaNode = (
    <MetaText variant="subtitle2" main={main} scalingFactor={scalingFactor}>
      {formatVideoViewsAndDate(views || null, createdAt, { fullViews: main })}
    </MetaText>
  )

  return (
    <Container main={main} className={className}>
      <CoverWrapper main={main} onClick={onClick}>
        <CoverContainer clickable={clickable}>{coverNode || coverPlaceholder}</CoverContainer>
      </CoverWrapper>
      <InfoContainer main={main}>
        {displayChannel && (
          <AvatarContainer scalingFactor={scalingFactor}>
            {channelAvatarNode || channelAvatarPlaceholder}
          </AvatarContainer>
        )}
        <TextContainer>
          {titleNode || titlePlaceholder}
          {displayChannel && (channelNameNode || channelNamePlaceholder)}
          {showMeta && <MetaContainer main={main}>{metaNode || metaPlaceholder}</MetaContainer>}
        </TextContainer>
      </InfoContainer>
    </Container>
  )
}

const SpacedPlaceholder = styled(Placeholder)`
  margin-top: 6px;
`
const CoverPlaceholder = styled(Placeholder)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`

export default VideoPreviewBase
