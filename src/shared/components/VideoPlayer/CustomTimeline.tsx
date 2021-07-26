import { clamp, round } from 'lodash'
import React, { useEffect, useRef } from 'react'
import { useState } from 'react'
import { VideoJsPlayer } from 'video.js'

import { formatDurationShort } from '@/utils/time'

import {
  LoadProgress,
  MouseDisplay,
  MouseDisplayTooltip,
  PlayProgress,
  PlayProgressThumb,
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

const UPDATE_INTERVAL = 70

export const CustomTimeline: React.FC<CustomTimelineProps> = ({ player, isFullScreen, playerState }) => {
  const playProgressRef = useRef<HTMLDivElement>(null)
  const playProgressThumbRef = useRef<HTMLDivElement>(null)
  const seekBarRef = useRef<HTMLDivElement>(null)
  const mouseDisplayTooltipRef = useRef<HTMLDivElement>(null)

  const [playProgressWidth, setPlayProgressWidth] = useState(0)
  const [loadProgressWidth, setLoadProgressWidth] = useState(0)
  const [mouseDisplayWidth, setMouseDisplayWidth] = useState(0)
  const [mouseDisplayTooltipPosition, setMouseDisplayTooltipPosition] = useState(0)
  const [mouseDisplayTooltipTime, setMouseDisplayTooltipTime] = useState('0:00')
  const [playProgressThumbPosition, setPlayProgressThumbPosition] = useState(0)

  useEffect(() => {
    if (!player) {
      return
    }
    const handler = () => {
      const duration = player.duration()
      const bufferedEnd = player.bufferedEnd()
      const loadProgressPercentage = round((bufferedEnd / duration) * 100, 2)
      setLoadProgressWidth(loadProgressPercentage)
    }
    player.on('progress', handler)
    return () => {
      player.off('progress', handler)
    }
  }, [player])

  useEffect(() => {
    const playProgress = playProgressRef.current
    const playProgressThumb = playProgressThumbRef.current
    const seekBar = seekBarRef.current
    if (
      !player ||
      !playerState ||
      playerState === 'ended' ||
      playerState === 'error' ||
      !playProgress ||
      !playProgressThumb ||
      !seekBar
    ) {
      return
    }

    const interval = window.setInterval(() => {
      const duration = player.duration()
      const currentTime = player.currentTime()

      const progressPercentage = round((currentTime / duration) * 100, 2)
      setPlayProgressWidth(progressPercentage)

      // position of playProgressThumb

      const halfOfPlayProgressThumbWidth = playProgressThumb.clientWidth / 2
      if (halfOfPlayProgressThumbWidth > playProgress.clientWidth) {
        const pullThumbBy = -(halfOfPlayProgressThumbWidth * 2 - playProgress.clientWidth)
        setPlayProgressThumbPosition(pullThumbBy)
      } else if (halfOfPlayProgressThumbWidth + playProgress.clientWidth > seekBar.clientWidth) {
        const pullThumbBy = -(seekBar.clientWidth - playProgress.clientWidth)
        setPlayProgressThumbPosition(pullThumbBy)
      } else {
        setPlayProgressThumbPosition(-halfOfPlayProgressThumbWidth)
      }
    }, UPDATE_INTERVAL)
    return () => {
      clearInterval(interval)
    }
  }, [player, playerState])

  const handleScrubbing = (e: React.MouseEvent) => {
    const seekBar = seekBarRef.current
    const mouseDisplayTooltip = mouseDisplayTooltipRef.current
    if (!seekBar || !mouseDisplayTooltip || !player) {
      return
    }
    const duration = player.duration()

    // position of seekBar
    const { x: seekbarPosition, width: seekBarWidth } = seekBar.getBoundingClientRect()
    const mousePosition = e.clientX - seekbarPosition
    const percentage = clamp(round((mousePosition / seekBarWidth) * 100, 2), 0, 100)
    setMouseDisplayWidth(percentage)

    // position of mouseDisplayTooltip
    const halfOfTooltipWidth = mouseDisplayTooltip.clientWidth / 2

    if (halfOfTooltipWidth >= seekBarWidth - mousePosition) {
      const pullTooltipBy = -Math.max(seekBarWidth - mousePosition, 0)
      setMouseDisplayTooltipPosition(pullTooltipBy)
    } else if (halfOfTooltipWidth >= mousePosition) {
      const pullTooltipBy = -Math.min(halfOfTooltipWidth * 2 - mousePosition, halfOfTooltipWidth * 2)
      setMouseDisplayTooltipPosition(pullTooltipBy)
    } else {
      setMouseDisplayTooltipPosition(-halfOfTooltipWidth)
    }

    // tooltip text
    if (duration) {
      setMouseDisplayTooltipTime(formatDurationShort(round((percentage / 100) * duration)))
    }
  }

  const handleJumpToTime = (e: React.MouseEvent) => {
    if (!seekBarRef.current) {
      return
    }
    const { x: seekbarPosition, width: seekBarWidth } = seekBarRef.current.getBoundingClientRect()
    const mousePosition = e.clientX - seekbarPosition

    const percentage = clamp(round(mousePosition / seekBarWidth, 2), 0, 100)
    const newTime = percentage * (player?.duration() || 0)
    player?.currentTime(newTime)
  }

  return (
    <ProgressControl isFullScreen={isFullScreen} onMouseMove={handleScrubbing} onClick={handleJumpToTime}>
      <SeekBar ref={seekBarRef}>
        <LoadProgress style={{ width: loadProgressWidth + '%' }} />
        <MouseDisplay style={{ width: mouseDisplayWidth + '%' }}>
          <MouseDisplayTooltip
            style={{ right: mouseDisplayTooltipPosition }}
            ref={mouseDisplayTooltipRef}
            isFullScreen={isFullScreen}
          >
            <StyledTooltipText variant="body2">{mouseDisplayTooltipTime}</StyledTooltipText>
          </MouseDisplayTooltip>
        </MouseDisplay>
        <PlayProgress style={{ width: playProgressWidth + '%' }} ref={playProgressRef}>
          <PlayProgressThumb ref={playProgressThumbRef} style={{ right: playProgressThumbPosition }} />
        </PlayProgress>
      </SeekBar>
    </ProgressControl>
  )
}
