import { Boundary } from '@popperjs/core'
import { FC, MouseEvent, useRef, useState } from 'react'

import { Popover, PopoverImperativeHandle } from '@/components/_overlays/Popover'
import { AVAILABLE_PLAYBACK_RATE } from '@/config/player'
import { usePersonalDataStore } from '@/providers/personalData'

import { PlayerControlButton } from './PlayerControlButton'
import { StyledSvgControlsSettingsOutline, StyledSvgControlsSettingsSolid } from './VideoPlayer.styles'

import { Setting, Settings } from '../Settings'

type SettingsPopoverProps = {
  boundariesElement: Boundary | null | undefined
}

export const SettingsButtonWithPopover: FC<SettingsPopoverProps> = ({ boundariesElement }) => {
  const popoverRef = useRef<PopoverImperativeHandle>(null)
  const [isSettingsOpened, setIsSettingsOpened] = useState(false)
  const [openedSettting, setOpenedSetting] = useState<string | null>(null)

  const handleToggleSettings = (event: MouseEvent) => {
    event.stopPropagation()
    setIsSettingsOpened((opened) => !opened)
  }

  const {
    playbackRate,
    autoplay,
    actions: { setPlaybackRate, setAutoplay },
  } = usePersonalDataStore((state) => state)

  const settings: Setting[] = [
    {
      type: 'multi-value',
      label: 'Speed',
      value: playbackRate === 1 ? `Normal (${playbackRate}x)` : `${playbackRate}x`,
      options: AVAILABLE_PLAYBACK_RATE.map((availablePlaybackRate) => ({
        value: availablePlaybackRate,
        selected: availablePlaybackRate === playbackRate,
        onOptionClick: (val) => {
          if (typeof val === 'number') {
            setPlaybackRate(val)
            setOpenedSetting(null)
          }
        },
        label: availablePlaybackRate === 1 ? `Normal (${availablePlaybackRate}x)` : `${availablePlaybackRate}x`,
      })),
    },
    {
      type: 'boolean',
      label: 'Autoplay',
      value: autoplay,
      onSwitchClick: (value) => {
        setAutoplay(value)
      },
    },
  ]
  return (
    <span>
      <Popover
        placement="top"
        ref={popoverRef}
        boundariesElement={boundariesElement}
        boundariesPadding={{ right: 16 }}
        flipEnabled={false}
        trigger={
          <PlayerControlButton onClick={handleToggleSettings} tooltipText="Settings">
            {isSettingsOpened ? <StyledSvgControlsSettingsSolid /> : <StyledSvgControlsSettingsOutline />}
          </PlayerControlButton>
        }
        onHide={() => {
          setIsSettingsOpened(false)
          setOpenedSetting(null)
        }}
        onShow={() => {
          setIsSettingsOpened(true)
        }}
      >
        <Settings settings={settings} onSettingClick={setOpenedSetting} openedSetting={openedSettting} />
      </Popover>
    </span>
  )
}

SettingsButtonWithPopover.displayName = 'SettingsPopover'
