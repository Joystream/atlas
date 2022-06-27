import { Boundary } from '@popperjs/core'
import { FC, MouseEvent, useRef, useState } from 'react'

import { Popover, PopoverImperativeHandle } from '@/components/_overlays/Popover'
import { AVAILABLE_PLAYBACK_RATE } from '@/config/player'
import { usePersonalDataStore } from '@/providers/personalData'
import { isMobile } from '@/utils/browser'

import { PlayerControlButton } from './PlayerControlButton'
import { StyledSvgControlsSettingsOutline, StyledSvgControlsSettingsSolid } from './VideoPlayer.styles'

import { MobileSettings, Setting, Settings } from '../Settings'

type SettingsPopoverProps = {
  boundariesElement: Boundary | null | undefined
  isFullScreen?: boolean
  playerHeightWithoutCustomControls?: number
}

const TOP_OFFSET = 16

export const SettingsButtonWithPopover: FC<SettingsPopoverProps> = ({
  boundariesElement,
  isFullScreen,
  playerHeightWithoutCustomControls = 0,
}) => {
  const settingsRef = useRef<HTMLDivElement>(null)
  const popoverRef = useRef<PopoverImperativeHandle>(null)
  const settingButtonRef = useRef<HTMLButtonElement>(null)
  const [isSettingsOpened, setIsSettingsOpened] = useState(false)
  const [openedSettting, setOpenedSetting] = useState<string | null>(null)
  const mobile = isMobile()

  const maxHeight = playerHeightWithoutCustomControls - TOP_OFFSET

  const handleToggleSettings = (event: MouseEvent) => {
    event.stopPropagation()
    setIsSettingsOpened((opened) => !opened)
  }
  const handleClose = () => {
    setIsSettingsOpened(false)
    setOpenedSetting(null)
  }

  const {
    playbackRate,
    playNext,
    actions: { setPlaybackRate, setPlayNext },
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
        setPlayNext(value)
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
        boundariesPadding={{ right: 16, top: 16 }}
        flipEnabled={false}
        trigger={null}
        triggerTarget={settingButtonRef.current}
        onHide={handleClose}
        onShow={() => {
          setIsSettingsOpened(true)
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
      <PlayerControlButton onClick={handleToggleSettings} tooltipText="Settings" ref={settingButtonRef}>
        {isSettingsOpened ? <StyledSvgControlsSettingsSolid /> : <StyledSvgControlsSettingsOutline />}
      </PlayerControlButton>
      {mobile && (
        <MobileSettings
          onClose={handleClose}
          settings={settings}
          onSettingClick={setOpenedSetting}
          openedSetting={openedSettting}
          show={isSettingsOpened && mobile}
        />
      )}
    </span>
  )
}

SettingsButtonWithPopover.displayName = 'SettingsPopover'
