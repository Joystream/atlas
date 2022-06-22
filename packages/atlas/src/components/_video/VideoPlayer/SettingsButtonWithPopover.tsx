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
  const [openedOption, setOpenedOption] = useState<string | null>(null)

  const handleToggleSettings = (event: MouseEvent) => {
    event.stopPropagation()
    setIsSettingsOpened((opened) => !opened)
  }

  const {
    playbackRate,
    actions: { setPlaybackRate },
  } = usePersonalDataStore((state) => state)

  const settings: Setting[] = [
    {
      label: 'Speed',
      value: playbackRate === 1 ? `Normal (${playbackRate}x)` : `${playbackRate}x`,
      options: AVAILABLE_PLAYBACK_RATE.map((s) => ({
        checked: playbackRate === s,
        onSettingClick: (opt) => setPlaybackRate(Number(opt.value)),
        value: s,
        label: s === 1 ? `Normal (${s}x)` : `${s}x`,
      })),
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
          setOpenedOption(null)
        }}
        onShow={() => {
          setIsSettingsOpened(true)
        }}
      >
        <Settings
          settings={settings}
          onOpenedOption={(option) => setOpenedOption(option)}
          openedOption={openedOption}
        />
      </Popover>
    </span>
  )
}

SettingsButtonWithPopover.displayName = 'SettingsPopover'
