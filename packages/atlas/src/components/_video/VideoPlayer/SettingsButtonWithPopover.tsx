import { Boundary } from '@popperjs/core'
import { FC, MouseEvent, useRef, useState } from 'react'

import { Popover, PopoverImperativeHandle } from '@/components/_overlays/Popover'
import { AVAILABLE_PLAYBACK_RATE } from '@/config/player'
import { usePersonalDataStore } from '@/providers/personalData'
import { sizes } from '@/styles'
import { isMobile } from '@/utils/browser'

import { PlayerControlButton } from './PlayerControlButton'
import { StyledSvgControlsSettingsOutline, StyledSvgControlsSettingsSolid } from './VideoPlayer.styles'

import { MobileSettings, Setting, Settings } from '../Settings'

type SettingsPopoverProps = {
  boundariesElement: Boundary | null | undefined
  isFullScreen?: boolean
  playerHeightWithoutCustomControls?: number
  onSettingsPopoverToggle: (isSettingsVisible: boolean) => void
  isSettingsPopoverOpened: boolean
}

const TOP_OFFSET = sizes(8, true)
const RIGHT_OFFSET = sizes(4, true)

export const SettingsButtonWithPopover: FC<SettingsPopoverProps> = ({
  boundariesElement,
  isFullScreen,
  playerHeightWithoutCustomControls = 0,
  onSettingsPopoverToggle,
  isSettingsPopoverOpened,
}) => {
  const settingsRef = useRef<HTMLDivElement>(null)
  const popoverRef = useRef<PopoverImperativeHandle>(null)
  const settingButtonRef = useRef<HTMLButtonElement>(null)

  const [openedSettting, setOpenedSetting] = useState<string | null>(null)
  const mobile = isMobile()

  const maxHeight = playerHeightWithoutCustomControls - TOP_OFFSET

  const handleToggleSettings = (event: MouseEvent) => {
    event.stopPropagation()
    onSettingsPopoverToggle(!isSettingsPopoverOpened)
  }
  const handleClose = () => {
    onSettingsPopoverToggle(false)
    setOpenedSetting(null)
  }

  const {
    playbackRate,
    autoPlayNext: playNext,
    actions: { setPlaybackRate, setAutoPlayNext },
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
          if (mobile) {
            handleClose()
          }
        },
        label: availablePlaybackRate === 1 ? `Normal (${availablePlaybackRate}x)` : `${availablePlaybackRate}x`,
      })),
    },
    {
      type: 'boolean',
      label: 'Autoplay',
      value: playNext,
      onSwitchClick: (value) => {
        setAutoPlayNext(value)
        if (mobile) {
          handleClose()
        }
      },
    },
  ]
  return (
    <span>
      <Popover
        placement="top"
        disabled={mobile}
        animation={false}
        ref={popoverRef}
        boundariesElement={boundariesElement}
        boundariesPadding={{ right: RIGHT_OFFSET }}
        flipEnabled={false}
        trigger={null}
        triggerTarget={settingButtonRef.current}
        onHide={handleClose}
        onShow={() => {
          onSettingsPopoverToggle(true)
        }}
      >
        <Settings
          ref={settingsRef}
          maxHeight={maxHeight}
          settings={settings}
          onSettingClick={setOpenedSetting}
          openedSetting={openedSettting}
          isFullScreen={isFullScreen}
        />
      </Popover>
      <PlayerControlButton
        tooltipEnabled={!isSettingsPopoverOpened}
        onClick={handleToggleSettings}
        tooltipText="Settings"
        ref={settingButtonRef}
      >
        {isSettingsPopoverOpened ? <StyledSvgControlsSettingsSolid /> : <StyledSvgControlsSettingsOutline />}
      </PlayerControlButton>
      {mobile && (
        <MobileSettings
          onClose={handleClose}
          settings={settings}
          onSettingClick={setOpenedSetting}
          openedSetting={openedSettting}
          show={isSettingsPopoverOpened && mobile}
        />
      )}
    </span>
  )
}

SettingsButtonWithPopover.displayName = 'SettingsPopover'
