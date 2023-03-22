import { clamp, round } from 'lodash-es'
import { Dispatch, FC, MouseEvent, SetStateAction, TouchEvent, useEffect, useRef, useState } from 'react'
import { VideoJsPlayer } from 'video.js'

import { arrayFrom } from '@/utils/data'
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
} from './CustomTimeline.styles'
import { PlayerState } from './utils'

type CustomTimelineProps = {
  player?: VideoJsPlayer | null
  elevated?: boolean
  playerState: PlayerState
  setPlayerState: Dispatch<SetStateAction<PlayerState>>
  playVideo: (player: VideoJsPlayer | null, withIndicator?: boolean, callback?: () => void) => Promise<void>
  pauseVideo: (player: VideoJsPlayer | null, withIndicator?: boolean, callback?: () => void) => void
}

const UPDATE_INTERVAL = 30

export const CustomTimeline: FC<CustomTimelineProps> = ({
  player,
  elevated,
  playerState,
  playVideo,
  pauseVideo,
  setPlayerState,
}) => {
  const playProgressThumbRef = useRef<HTMLButtonElement>(null)
  const playProgressRef = useRef<HTMLDivElement>(null)
  const seekBarRef = useRef<HTMLDivElement>(null)
  const mouseDisplayTooltipRef = useRef<HTMLDivElement>(null)

  const [playProgressWidth, setPlayProgressWidth] = useState(0)
  const [loadProgressWidth, setLoadProgressWidth] = useState(0)
  const [mouseDisplayWidth, setMouseDisplayWidth] = useState(0)
  const [mouseDisplayTooltipTime, setMouseDisplayTooltipTime] = useState('0:00')
  const [mouseDisplayTooltipWidth, setMouseDisplayTooltipWidth] = useState(0)
  const [playProgressThumbWidth, setPlayProgressThumbWidth] = useState(0)
  const [isScrubbing, setIsScrubbing] = useState(false)
  const [playedBefore, setPlayedBefore] = useState(false)

  useEffect(() => {
    if (!player) {
      return
    }
    const handler = (event: Event) => {
      if (event.type === 'seeking' && isScrubbing && !player.paused()) {
        setPlayedBefore(true)
        pauseVideo(player)
      }
      if (event.type === 'seeked' && !isScrubbing) {
        if (playedBefore) {
          playVideo(player)
          setPlayedBefore(false)
        }
      }
    }
    player.on(['seeking', 'seeked'], handler)
    return () => {
      player.off(['seeking', 'seeked'], handler)
    }
  }, [isScrubbing, player, playedBefore, pauseVideo, playVideo])

  useEffect(() => {
    const playProgress = playProgressRef.current
    const playProgressThumb = playProgressThumbRef.current
    if (
      !player ||
      !playerState ||
      playerState === 'ended' ||
      playerState === 'error' ||
      !playProgress ||
      isScrubbing ||
      !playProgressThumb
    ) {
      return
    }

    const interval = window.setInterval(() => {
      const duration = player.duration()
      const currentTime = player.currentTime()
      const buffered = player.buffered()

      // set playProgress

      const progressPercentage = round((currentTime / duration) * 100, 2)
      setPlayProgressWidth(progressPercentage)
      setPlayProgressThumbWidth(playProgressThumb.clientWidth)

      if (progressPercentage === 100) {
        setPlayerState('ended')
      }

      // get all buffered time ranges
      const bufferedTimeRanges = arrayFrom(buffered.length).map((_, idx) => ({
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
    }, UPDATE_INTERVAL)
    return () => {
      clearInterval(interval)
    }
  }, [isScrubbing, player, playerState, setPlayerState])

  const handleMouseAndTouchMove = (e: MouseEvent | TouchEvent) => {
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
    }
  }

  const handleJumpToTime = (e: MouseEvent | TouchEvent) => {
    const seekBar = seekBarRef.current
    if (!seekBar || (e.type === 'mouseleave' && !isScrubbing) || !player) {
      return
    }

    const { x: seekBarPosition, width: seekBarWidth } = seekBar.getBoundingClientRect()
    const mouseOrTouchPosition =
      'clientX' in e ? e.clientX - seekBarPosition : e.changedTouches[0].clientX - seekBarPosition

    const percentage = clamp(round(mouseOrTouchPosition / seekBarWidth, 4), 0, 100)
    const newTime = percentage * (player?.duration() || 0)
    player.currentTime(newTime)
    setIsScrubbing(false)
  }

  return (
    <ProgressControl
      onClick={(event) => event.stopPropagation()}
      isScrubbing={isScrubbing}
      elevated={elevated}
      onMouseMove={handleMouseAndTouchMove}
      onTouchMove={handleMouseAndTouchMove}
      onMouseLeave={handleJumpToTime}
      onMouseDown={() => setIsScrubbing(true)}
      onTouchStart={() => setIsScrubbing(true)}
      onMouseUp={handleJumpToTime}
      onTouchEnd={handleJumpToTime}
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
            elevated={elevated}
          >
            <StyledTooltipText as="span" variant="t200">
              {mouseDisplayTooltipTime}
            </StyledTooltipText>
          </MouseDisplayTooltip>
        </MouseDisplayWrapper>
        <PlayProgressWrapper>
          <PlayProgress style={{ width: playProgressWidth + '%' }} ref={playProgressRef} />
          <PlayProgressThumb
            ref={playProgressThumbRef}
            style={{
              left: `clamp(0px, calc(${playProgressWidth}% - ${
                playProgressThumbWidth / 2
              }px), calc(100% - ${playProgressThumbWidth}px))`,
            }}
          />
        </PlayProgressWrapper>
      </SeekBar>
    </ProgressControl>
  )
}
