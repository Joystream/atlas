import { Boundary } from '@popperjs/core'
import { FC, MouseEvent, useRef, useState } from 'react'
import { VideoJsPlayer } from 'video.js'

import { Popover, PopoverImperativeHandle } from '@/components/_overlays/Popover'
import { CustomVideojsEvents } from '@/components/_video/VideoPlayer/utils'
import { atlasConfig } from '@/config'
import { usePersonalDataStore } from '@/providers/personalData'
import { sizes } from '@/styles'
import { isMobile } from '@/utils/browser'

import { PlayerControlButton } from './PlayerControlButton'
import { StyledSvgControlsSettingsOutline, StyledSvgControlsSettingsSolid } from './VideoPlayer.styles'

import { MobileSettings, Setting, Settings } from '../Settings'

export type AvailableTrack = {
  src: string
  language: string
  label: string
}

type SettingsPopoverProps = {
  boundariesElement: Boundary | null | undefined
  isFullScreen?: boolean
  playerHeightWithoutCustomControls?: number
  onSettingsPopoverToggle: (isSettingsVisible: boolean) => void
  isSettingsPopoverOpened: boolean
  availableTracks?: AvailableTrack[]
  onTrackChange: (selectedTrack: AvailableTrack | undefined) => void
  activeTrack?: AvailableTrack
  player: VideoJsPlayer | null
}

const TOP_OFFSET = sizes(8, true)
const RIGHT_OFFSET = sizes(4, true)

export const SettingsButtonWithPopover: FC<SettingsPopoverProps> = ({
  boundariesElement,
  isFullScreen,
  playerHeightWithoutCustomControls = 0,
  onSettingsPopoverToggle,
  isSettingsPopoverOpened,
  availableTracks,
  onTrackChange,
  activeTrack,
  player,
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
    allowMinimizedPleyer,
    captionsEnabled,
    actions: { setPlaybackRate, setAutoPlayNext, setCaptionsLanguage, setCaptionsEnabled, setMinimizedPlayerAllowed },
  } = usePersonalDataStore((state) => state)

  const subtitlesSettings: Setting | null =
    availableTracks && availableTracks?.length > 0
      ? {
          type: 'multi-value',
          label: 'Subtitles/CC',
          value: !captionsEnabled || !activeTrack?.label ? 'Off' : activeTrack?.label,
          options: [
            {
              label: 'Off',
              value: 'off',
              selected: !activeTrack,
              onOptionClick: () => {
                setCaptionsEnabled(false)
                onTrackChange(undefined)
                player?.trigger(CustomVideojsEvents.CaptionsSet)
                if (mobile) {
                  handleClose()
                }
              },
            },
            ...availableTracks.map((track) => ({
              label: track.label,
              value: track.language,
              selected: activeTrack?.language === track.language,
              onOptionClick: () => {
                onTrackChange(track)
                setCaptionsLanguage(track.language)
                player?.trigger(CustomVideojsEvents.CaptionsSet)
                if (!captionsEnabled) {
                  setCaptionsEnabled(true)
                }
                if (mobile) {
                  handleClose()
                }
              },
            })),
          ],
        }
      : null

  const speedSettings: Setting = {
    type: 'multi-value',
    label: 'Speed',
    value: playbackRate === 1 ? `Normal (${playbackRate}x)` : `${playbackRate}x`,
    options: atlasConfig.features.playback.playbackRates.map((availablePlaybackRate) => ({
      value: availablePlaybackRate,
      selected: availablePlaybackRate === playbackRate,
      onOptionClick: async (val) => {
        if (typeof val === 'number') {
          await setPlaybackRate(val)
          player?.trigger(CustomVideojsEvents.PlaybackSpeedSet)
          setOpenedSetting(null)
        }
        if (mobile) {
          handleClose()
        }
      },
      label: availablePlaybackRate === 1 ? `Normal (${availablePlaybackRate}x)` : `${availablePlaybackRate}x`,
    })),
  }

  const autoPlaySettings: Setting = {
    type: 'boolean',
    label: 'Autoplay',
    value: playNext,
    onSwitchClick: (value) => {
      setAutoPlayNext(value)
      if (mobile) {
        handleClose()
      }
    },
  }

  const minimizedPlayerSettings: Setting | null = !mobile
    ? {
        type: 'boolean',
        label: 'Minimized player',
        value: allowMinimizedPleyer,
        onSwitchClick: (value) => {
          setMinimizedPlayerAllowed(value)
          if (mobile) {
            handleClose()
          }
        },
      }
    : null

  const settings: Setting[] = [
    speedSettings,
    ...(subtitlesSettings ? [subtitlesSettings] : []),
    ...(minimizedPlayerSettings ? [minimizedPlayerSettings] : []),
    autoPlaySettings,
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
