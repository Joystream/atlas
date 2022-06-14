import { FC, ReactNode, useEffect, useState } from 'react'
import { CSSTransition } from 'react-transition-group'
import { VideoJsPlayer } from 'video.js'

import { Text } from '@/components/Text'
import {
  SvgControlsPause,
  SvgControlsPlay,
  SvgControlsSeekBackward5,
  SvgControlsSeekBackward10,
  SvgControlsSeekForward5,
  SvgControlsSeekForward10,
  SvgControlsSoundLowVolume,
  SvgControlsSoundOff,
  SvgControlsSoundOn,
} from '@/components/_icons'

import {
  ControlsIndicatorIconWrapper,
  ControlsIndicatorTooltip,
  ControlsIndicatorTransitions,
  ControlsIndicatorWrapper,
  INDICATOR_TIMEOUT,
  INDICATOR_TRANSITION,
  LoaderWrapper,
  StyledLoader,
} from './ControlsIndicator.styles'
import { CustomVideojsEvents } from './utils'

type VideoEvent = CustomVideojsEvents | null

type EventState = {
  type: VideoEvent
  description: string | null
  icon: ReactNode | null
  isVisible: boolean
}

type ControlsIndicatorProps = {
  player: VideoJsPlayer | null
  isLoading?: boolean
}

export const ControlsIndicator: FC<ControlsIndicatorProps> = ({ player, isLoading }) => {
  const [indicator, setIndicator] = useState<EventState | null>(null)
  useEffect(() => {
    if (!player) {
      return
    }
    let timeout: number
    const indicatorEvents = Object.values(CustomVideojsEvents)

    const handler = (e: Event) => {
      // This setTimeout is needed to get current value from `player.volume()`
      // if we omit this we'll get stale results
      timeout = window.setTimeout(() => {
        const indicator = createIndicator(e.type as VideoEvent, player.volume(), player.muted())
        if (indicator) {
          setIndicator({ ...indicator, isVisible: true })
        }
      }, 0)
    }
    player.on(indicatorEvents, handler)

    return () => {
      clearTimeout(timeout)
      player.off(indicatorEvents, handler)
    }
  }, [player])

  return (
    <ControlsIndicatorTransitions>
      <CSSTransition
        in={!indicator?.isVisible && isLoading}
        timeout={!indicator?.isVisible && isLoading ? INDICATOR_TIMEOUT : 0}
        classNames={INDICATOR_TRANSITION}
        mountOnEnter
        unmountOnExit
      >
        <LoaderWrapper>
          <StyledLoader variant="player" />
        </LoaderWrapper>
      </CSSTransition>
      <CSSTransition
        in={indicator?.isVisible}
        timeout={indicator?.isVisible ? 0 : INDICATOR_TIMEOUT}
        classNames={INDICATOR_TRANSITION}
        mountOnEnter
        unmountOnExit
        onEntered={() => setIndicator((indicator) => (indicator ? { ...indicator, isVisible: false } : null))}
        onExited={() => setIndicator(null)}
      >
        <ControlsIndicatorWrapper>
          <ControlsIndicatorIconWrapper>{indicator?.icon}</ControlsIndicatorIconWrapper>
          <ControlsIndicatorTooltip>
            <Text variant="t100">{indicator?.description}</Text>
          </ControlsIndicatorTooltip>
        </ControlsIndicatorWrapper>
      </CSSTransition>
    </ControlsIndicatorTransitions>
  )
}

const createIndicator = (type: VideoEvent | null, playerVolume: number, playerMuted: boolean) => {
  const formattedVolume = Math.floor(playerVolume * 100) + '%'
  const isMuted = playerMuted || !Number(playerVolume.toFixed(2))

  switch (type) {
    case CustomVideojsEvents.PauseControl:
      return {
        icon: <SvgControlsPause />,
        description: 'Pause',
        type,
      }
    case CustomVideojsEvents.PlayControl:
      return {
        icon: <SvgControlsPlay />,
        description: 'Play',
        type,
      }
    case CustomVideojsEvents.BackwardFiveSec:
      return {
        icon: <SvgControlsSeekBackward5 />,
        description: 'Backward 5s',
        type,
      }
    case CustomVideojsEvents.ForwardFiveSec:
      return {
        icon: <SvgControlsSeekForward5 />,
        description: 'Forward 5s',
        type,
      }
    case CustomVideojsEvents.BackwardTenSec:
      return {
        icon: <SvgControlsSeekBackward10 />,
        description: 'Backward 10s',
        type,
      }
    case CustomVideojsEvents.ForwardTenSec:
      return {
        icon: <SvgControlsSeekForward10 />,
        description: 'Forward 10s',
        type,
      }
    case CustomVideojsEvents.Unmuted:
      return {
        icon: <SvgControlsSoundOn />,
        description: formattedVolume,
        type,
      }
    case CustomVideojsEvents.Muted:
      return {
        icon: <SvgControlsSoundOff />,
        description: 'Mute',
        type,
      }
    case CustomVideojsEvents.VolumeIncrease:
      return {
        icon: <SvgControlsSoundOn />,
        description: formattedVolume,
        type,
      }
    case CustomVideojsEvents.VolumeDecrease:
      return {
        icon: isMuted ? <SvgControlsSoundOff /> : <SvgControlsSoundLowVolume />,
        description: isMuted ? 'Mute' : formattedVolume,
        type,
      }
    default:
      return null
  }
}
