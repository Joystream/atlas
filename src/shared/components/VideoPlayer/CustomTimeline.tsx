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

  const [playProgressWidth, setPlayProgressWidth] = useState(0)
  const [loadProgressWidth, setLoadProgressWidth] = useState(0)
  const [mouseDisplayWidth, setMouseDisplayWidth] = useState(0)
  const [mouseDisplayTooltipTime, setMouseDisplayTooltipTime] = useState('0:00')
  const [mouseDisplayTooltipWidth, setMouseDisplayTooltipWidth] = useState(0)

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
    if (!player || !playerState || playerState === 'ended' || playerState === 'error' || !playProgress) {
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
  }, [player, playerState])

  const handleScrubbing = (e: React.MouseEvent) => {
    const seekBar = e.currentTarget.querySelector(SeekBar.toString())
    const mouseDisplayTooltip = e.currentTarget.querySelector(MouseDisplayTooltip.toString())
    if (!seekBar || !mouseDisplayTooltip || !player) {
      return
    }
    const duration = player.duration()

    // position of seekBar
    const { x: seekbarPosition, width: seekBarWidth } = seekBar.getBoundingClientRect()
    const mousePosition = e.clientX - seekbarPosition
    const percentage = clamp(round((mousePosition / seekBarWidth) * 100, 2), 0, 100)
    setMouseDisplayWidth(percentage)
    setMouseDisplayTooltipWidth(mouseDisplayTooltip.clientWidth)

    // tooltip text
    if (duration) {
      setMouseDisplayTooltipTime(formatDurationShort(round((percentage / 100) * duration)))
    }
  }

  const handleJumpToTime = (e: React.MouseEvent) => {
    const seekBar = e.currentTarget.querySelector(SeekBar.toString())
    if (!seekBar) {
      return
    }

    const { x: seekbarPosition, width: seekBarWidth } = seekBar.getBoundingClientRect()
    const mousePosition = e.clientX - seekbarPosition

    const percentage = clamp(round(mousePosition / seekBarWidth, 4), 0, 100)
    const newTime = percentage * (player?.duration() || 0)
    player?.currentTime(newTime)
  }

  return (
    <ProgressControl isFullScreen={isFullScreen} onMouseMove={handleScrubbing} onClick={handleJumpToTime}>
      <SeekBar>
        <LoadProgress style={{ width: loadProgressWidth + '%' }} />
        <MouseDisplayWrapper>
          <MouseDisplay style={{ width: mouseDisplayWidth + '%' }}></MouseDisplay>
          <MouseDisplayTooltip
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
