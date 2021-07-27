import { clamp, round } from 'lodash'
import React, { useEffect, useRef } from 'react'
import { useState } from 'react'
import { VideoJsPlayer } from 'video.js'

import { formatDurationShort } from '@/utils/time'

import {
  LoadProgress,
  MouseDisplay,
  MouseDisplayTooltip,
  MouseDisplayWrapper,
  PlayProgress,
  PlayProgressThumb,
  PlayProgressWrapper,
  ProgressControl,
  SeekBar,
  StyledTooltipText,
} from './CustomTimeline.style'
import { PlayerState } from './VideoPlayer'

type CustomTimelineProps = {
  player?: VideoJsPlayer | null
  isFullScreen?: boolean
  playerState: PlayerState
}

const UPDATE_INTERVAL = 30

export const CustomTimeline: React.FC<CustomTimelineProps> = ({ player, isFullScreen, playerState }) => {
  const playProgressRef = useRef<HTMLDivElement>(null)
  const seekBarRef = useRef<HTMLDivElement>(null)
  const mouseDisplayTooltipRef = useRef<HTMLDivElement>(null)

  const [playProgressWidth, setPlayProgressWidth] = useState(0)
  const [loadProgressWidth, setLoadProgressWidth] = useState(0)
  const [mouseDisplayWidth, setMouseDisplayWidth] = useState(0)
  const [mouseDisplayTooltipTime, setMouseDisplayTooltipTime] = useState('0:00')
  const [mouseDisplayTooltipWidth, setMouseDisplayTooltipWidth] = useState(0)
  const [isScrubbing, setIsScrubbing] = useState(false)

  useEffect(() => {
    if (!player) {
      return
    }
    const handler = () => {
      const duration = player.duration()
      const buffered = player.buffered()
      const currentTime = player.currentTime()

      // get all buffered time ranges
      const bufferedTimeRanges = Array.from({ length: buffered.length }).map((_, idx) => ({
        bufferedStart: buffered.start(idx),
        bufferedEnd: buffered.end(idx),
      }))

      const currentBufferedTimeRange = bufferedTimeRanges.find(
        (el) => el.bufferedEnd > currentTime && el.bufferedStart < currentTime
      )

      if (currentBufferedTimeRange) {
        const loadProgressPercentage = round((currentBufferedTimeRange.bufferedEnd / duration) * 100, 2)
        setLoadProgressWidth(loadProgressPercentage)
      } else {
        setLoadProgressWidth(0)
      }
    }
    player.on('progress', handler)
    return () => {
      player.off('progress', handler)
    }
  }, [player])

  useEffect(() => {
    const playProgress = playProgressRef.current
    if (!player || !playerState || playerState === 'ended' || playerState === 'error' || !playProgress || isScrubbing) {
      return
    }

    const interval = window.setInterval(() => {
      const duration = player.duration()
      const currentTime = player.currentTime()

      const progressPercentage = round((currentTime / duration) * 100, 2)
      setPlayProgressWidth(progressPercentage)

      // position of playProgressThumb
    }, UPDATE_INTERVAL)
    return () => {
      clearInterval(interval)
    }
  }, [isScrubbing, player, playerState])

  const handleMouseAndTouchMove = (e: React.MouseEvent | React.TouchEvent) => {
    const seekBar = seekBarRef.current
    const mouseDisplayTooltip = mouseDisplayTooltipRef.current
    if (!seekBar || !mouseDisplayTooltip || !player) {
      return
    }
    // this will prevent hiding controls when scrubbing on mobile
    player.enableTouchActivity()

    const duration = player.duration()

    // position of seekBar
    const { x: seekBarPosition, width: seekBarWidth } = seekBar.getBoundingClientRect()
    const position = 'clientX' in e ? e.clientX - seekBarPosition : e.touches[0].clientX - seekBarPosition
    const percentage = clamp(round((position / seekBarWidth) * 100, 2), 0, 100)
    setMouseDisplayWidth(percentage)
    setMouseDisplayTooltipWidth(mouseDisplayTooltip.clientWidth)

    // tooltip text
    if (duration) {
      setMouseDisplayTooltipTime(formatDurationShort(round((percentage / 100) * duration)))
    }
    if (isScrubbing) {
      setPlayProgressWidth(percentage)
      const newTime = percentage * (player?.duration() || 0)
      player?.currentTime(newTime / 100)
    }
  }

  const handleJumpToTime = (e: React.MouseEvent) => {
    const seekBar = seekBarRef.current
    if (!seekBar || isScrubbing) {
      return
    }

    const { x: seekBarPosition, width: seekBarWidth } = seekBar.getBoundingClientRect()
    const mousePosition = e.clientX - seekBarPosition

    const percentage = clamp(round(mousePosition / seekBarWidth, 4), 0, 100)
    const newTime = percentage * (player?.duration() || 0)
    player?.currentTime(newTime)
  }

  return (
    <ProgressControl
      isFullScreen={isFullScreen}
      onMouseMove={handleMouseAndTouchMove}
      onTouchMove={handleMouseAndTouchMove}
      onClick={handleJumpToTime}
      onMouseDown={() => setIsScrubbing(true)}
      onTouchStart={() => setIsScrubbing(true)}
      onMouseUp={() => setIsScrubbing(false)}
      onTouchEnd={() => setIsScrubbing(false)}
    >
      <SeekBar ref={seekBarRef}>
        <LoadProgress style={{ width: loadProgressWidth + '%' }} />
        <MouseDisplayWrapper>
          <MouseDisplay style={{ width: mouseDisplayWidth + '%' }} />
          <MouseDisplayTooltip
            ref={mouseDisplayTooltipRef}
            style={{
              left: `clamp(0px, calc(${mouseDisplayWidth}% - ${
                mouseDisplayTooltipWidth / 2
              }px), calc(100% - ${mouseDisplayTooltipWidth}px))`,
            }}
            isFullScreen={isFullScreen}
          >
            <StyledTooltipText variant="body2">{mouseDisplayTooltipTime}</StyledTooltipText>
          </MouseDisplayTooltip>
        </MouseDisplayWrapper>
        <PlayProgressWrapper>
          <PlayProgress style={{ width: playProgressWidth + '%' }} ref={playProgressRef} />
          <PlayProgressThumb style={{ left: `clamp(0px, calc(${playProgressWidth}% - 0.5em), calc(100% - 1em))` }} />
        </PlayProgressWrapper>
      </SeekBar>
    </ProgressControl>
  )
}
