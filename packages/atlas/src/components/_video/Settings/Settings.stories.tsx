import { Meta, StoryFn } from '@storybook/react'
import { useState } from 'react'

import { Setting, Settings, SettingsProps } from './Settings'

export default {
  title: 'video/Settings',
  component: Settings,
} as Meta<SettingsProps>

const Template: StoryFn<SettingsProps> = (args) => {
  const [quality, setQuality] = useState(320)
  const [speed, setSpeed] = useState(1.5)
  const [autoplay, setAutoplay] = useState(true)

  const [openedSettingList, setOpenedSettingList] = useState<string | null>(null)

  const availableSpeeds = [2, 1.5, 1.25, 1, 0.5, 0.25]
  const availableQualities = [1440, 1080, 720, 480, 320, 240]

  const settings: Setting[] = [
    {
      type: 'multi-value',
      label: 'Speed',
      value: `Normal (${speed}x) speed`,
      options: availableSpeeds.map((availableSpeed) => ({
        checked: speed === availableSpeed,
        onOptionClick: (val) => {
          if (typeof val === 'number') {
            setSpeed(val)
          }
        },
        value: availableSpeed,
        selected: availableSpeed === speed,
        label: `${availableSpeed}x`,
      })),
    },
    {
      type: 'multi-value',
      label: 'Quality',
      value: `${quality}p`,
      options: availableQualities.map((availableQuality) => ({
        checked: quality === availableQuality,
        onOptionClick: (val) => {
          if (typeof val === 'number') {
            setQuality(val)
          }
        },
        value: availableQuality,
        selected: availableQuality === quality,
        label: `${availableQuality}p`,
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
    <Settings {...args} openedSetting={openedSettingList} onSettingClick={setOpenedSettingList} settings={settings} />
  )
}

export const Default = Template.bind({})
