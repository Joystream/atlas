import React, { useState } from 'react'
import useResizeObserver from 'use-resize-observer'
import {
  ChannelName,
  CoverDurationOverlay,
  CoverHoverOverlay,
  CoverImage,
  CoverPlayIcon,
  CoverRemoveButton,
  MetaText,
  ProgressBar,
  ProgressOverlay,
  StyledAvatar,
  TitleHeader,
} from './VideoPreview.styles'
import { formatDurationShort } from '@/utils/time'
import VideoPreviewBase from './VideoPreviewBase'
import { formatVideoViewsAndDate } from '@/utils/video'

export const MIN_VIDEO_PREVIEW_WIDTH = 300
const MAX_VIDEO_PREVIEW_WIDTH = 600
const MIN_SCALING_FACTOR = 1
const MAX_SCALING_FACTOR = 1.375
// Linear Interpolation, see https://en.wikipedia.org/wiki/Linear_interpolation
const calculateScalingFactor = (videoPreviewWidth: number) =>
  MIN_SCALING_FACTOR +
  ((videoPreviewWidth - MIN_VIDEO_PREVIEW_WIDTH) * (MAX_SCALING_FACTOR - MIN_SCALING_FACTOR)) /
    (MAX_VIDEO_PREVIEW_WIDTH - MIN_VIDEO_PREVIEW_WIDTH)

type VideoPreviewProps = {
  title: string
  channelName: string
  channelAvatarURL?: string | null
  createdAt: Date
  duration?: number
  // video watch progress in percent (0-100)
  progress?: number
  removeButton?: boolean
  handleRemove?: () => Promise<void>
  views?: number | null
  posterURL: string

  showChannel?: boolean
  showMeta?: boolean
  main?: boolean
  onCoverResize?: (width: number | undefined, height: number | undefined) => void
  onClick?: (e: React.MouseEvent<HTMLElement>) => void
  onChannelClick?: (e: React.MouseEvent<HTMLElement>) => void
  className?: string
}

const VideoPreview: React.FC<VideoPreviewProps> = ({
  title,
  channelName,
  channelAvatarURL,
  createdAt,
  duration,
  progress = 0,
  removeButton,
  handleRemove,
  views,
  posterURL,
  showChannel = true,
  showMeta = true,
  main = false,
  onClick,
  onChannelClick,
  className,
  onCoverResize,
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

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    if (!onClick) {
      return
    }
    e.stopPropagation()
    onClick(e)
  }

  const handleRemoveClick = (e: React.MouseEvent<HTMLElement>) => {
    if (!onClick) {
      return
    }
    if (handleRemove) {
      e.stopPropagation()
      handleRemove()
    }
  }

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
        {removeButton && <CoverRemoveButton onClick={handleRemoveClick} />}
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
    <VideoPreviewBase
      coverNode={coverNode}
      titleNode={titleNode}
      showChannel={showChannel}
      channelAvatarNode={channelAvatarNode}
      channelNameNode={channelNameNode}
      showMeta={showMeta}
      main={main}
      metaNode={metaNode}
      onClick={onClick && handleClick}
      className={className}
      scalingFactor={scalingFactor}
    />
  )
}

export default VideoPreview
