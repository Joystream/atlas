import { clamp, round } from 'lodash'
import React, { useEffect, useRef } from 'react'
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

export const CustomTimeline: React.FC<CustomTimelineProps> = ({ player, isFullScreen, playerState }) => {
  const progressControlRef = useRef<HTMLDivElement>(null)
  const playProgressRef = useRef<HTMLDivElement>(null)
  const playProgressThumbRef = useRef<HTMLDivElement>(null)
  const seekBarRef = useRef<HTMLDivElement>(null)
  const loadProgressRef = useRef<HTMLDivElement>(null)
  const mouseDisplayRef = useRef<HTMLDivElement>(null)
  const mouseDisplayTooltipRef = useRef<HTMLDivElement>(null)
  const mouseDisplayTooltipTextRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!player || !playerState || playerState === 'ended' || playerState === 'error') {
      return
    }

    let animationFrame: number
    const callback = () => {
      const playProgress = playProgressRef.current
      const playProgressThumb = playProgressThumbRef.current
      const loadProgress = loadProgressRef.current
      const seekBar = seekBarRef.current
      if (!playProgress || !loadProgress || !playProgressThumb || !seekBar) {
        return
      }

      const duration = player.duration()
      const currentTime = player.currentTime()
      const bufferedEnd = player.bufferedEnd()

      const progressPercentage = round((currentTime / duration) * 100, 2)
      const loadProgressPercentage = round((bufferedEnd / duration) * 100, 2)

      playProgress.style.width = progressPercentage + '%'
      loadProgress.style.width = loadProgressPercentage + '%'

      // position of playProgressThumb
      const halfOfPlayProgressThumbWidth = playProgressThumb.clientWidth / 2

      if (halfOfPlayProgressThumbWidth > playProgress.clientWidth) {
        const pullThumbBy = '-' + (halfOfPlayProgressThumbWidth * 2 - playProgress.clientWidth) + 'px'
        playProgressThumb.style.right = pullThumbBy
      } else if (halfOfPlayProgressThumbWidth + playProgress.clientWidth > seekBar.clientWidth) {
        const pullThumbBy = '-' + (seekBar.clientWidth - playProgress.clientWidth) + 'px'
        playProgressThumb.style.right = pullThumbBy
      } else {
        playProgressThumb.style.right = '-' + halfOfPlayProgressThumbWidth + 'px'
      }

      window.setTimeout(() => {
        animationFrame = player.requestAnimationFrame(callback)
        // ~ 10fps
      }, 1000 / 10)
    }
    animationFrame = player.requestAnimationFrame(callback)
    return () => {
      player.cancelAnimationFrame(animationFrame)
    }
  }, [player, playerState])

  const handleScrubbing = (e: React.MouseEvent) => {
    const seekBar = seekBarRef.current
    const mouseDisplay = mouseDisplayRef.current
    const mouseDisplayTooltip = mouseDisplayTooltipRef.current
    const mouseDisplayTooltipText = mouseDisplayTooltipTextRef.current
    if (!seekBar || !mouseDisplay || !mouseDisplayTooltipText || !mouseDisplayTooltip) {
      return
    }

    // position of mouseDisplay
    const { x: seekbarPosition, width: seekBarWidth } = seekBar.getBoundingClientRect()
    const mousePosition = e.clientX - seekbarPosition
    const percentage = clamp(round((mousePosition / seekBarWidth) * 100, 2), 0, 100)
    mouseDisplay.style.width = percentage + '%'

    // position of mouseDisplayTooltip
    const halfOfTooltipWidth = mouseDisplayTooltip.clientWidth / 2

    if (halfOfTooltipWidth >= seekBarWidth - mousePosition) {
      const pullTooltipBy = '-' + Math.max(seekBarWidth - mousePosition, 0) + 'px'
      mouseDisplayTooltip.style.right = pullTooltipBy
    } else if (halfOfTooltipWidth >= mousePosition) {
      const pullTooltipBy = '-' + Math.min(halfOfTooltipWidth * 2 - mousePosition, halfOfTooltipWidth * 2) + 'px'
      mouseDisplayTooltip.style.right = pullTooltipBy
    } else {
      mouseDisplayTooltip.style.right = '-' + halfOfTooltipWidth + 'px'
    }

    // tooltip text
    mouseDisplayTooltipText.textContent = formatDurationShort(round((percentage / 100) * (player?.duration() || 0)))
  }

  const handleJumpToTime = (e: React.MouseEvent) => {
    if (!seekBarRef.current || !mouseDisplayRef.current || !mouseDisplayTooltipTextRef.current) {
      return
    }
    const { x: seekbarPosition, width: seekBarWidth } = seekBarRef.current.getBoundingClientRect()
    const mousePosition = e.clientX - seekbarPosition

    const percentage = clamp(round(mousePosition / seekBarWidth, 2), 0, 100)
    const newTime = percentage * (player?.duration() || 0)
    player?.currentTime(newTime)
  }

  return (
    <ProgressControl
      isFullScreen={isFullScreen}
      ref={progressControlRef}
      onMouseMove={handleScrubbing}
      onClick={handleJumpToTime}
    >
      <SeekBar ref={seekBarRef}>
        <LoadProgress ref={loadProgressRef} />
        <MouseDisplay ref={mouseDisplayRef}>
          <MouseDisplayTooltip ref={mouseDisplayTooltipRef} isFullScreen={isFullScreen}>
            <StyledTooltipText variant="body2" ref={mouseDisplayTooltipTextRef} />
          </MouseDisplayTooltip>
        </MouseDisplay>
        <PlayProgress ref={playProgressRef}>
          <PlayProgressThumb ref={playProgressThumbRef} />
        </PlayProgress>
      </SeekBar>
    </ProgressControl>
  )
}
